import { isAxiosError } from 'axios';
import Cookies from 'js-cookie';
import { FormEvent, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { config } from '../../config';
import { api, apiPath } from '../../lib/api';
import { GetUserResponse, LoginResponse } from '../../lib/api/types';
import { useAuth } from '../../lib/auth';
import { imageUrl } from '../../utils/imageUrl';
import styles from './Login.module.css';

function Login() {
  const formRef = useRef<HTMLFormElement>(null);
  const { login, setAuthenticationStatus, isAuthenticated, user, logout } =
    useAuth();
  const navigate = useNavigate();

  const handleFormSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      const data = new FormData(formRef.current!);

      try {
        setAuthenticationStatus('pending');
        const loginResponse = await api.post<LoginResponse>(apiPath.login, {
          email: data.get('Email')?.toString(),
          password: data.get('Password')?.toString(),
        });
        setAuthenticationStatus('succeeded');
        const { accessToken, refreshToken } = loginResponse.data;

        const accessTokenExpireDate = new Date();
        accessTokenExpireDate.setDate(accessTokenExpireDate.getDate() + 60);
        Cookies.set(config.cookie.accessToken, accessToken, {
          expires: accessTokenExpireDate,
        });

        const refreshTokenExpireDate = new Date();
        refreshTokenExpireDate.setDate(refreshTokenExpireDate.getDate() + 360);
        Cookies.set(config.cookie.refreshToken, refreshToken, {
          expires: refreshTokenExpireDate,
        });

        const userData = (await api.get<GetUserResponse>(apiPath.getMyUser))
          .data;

        login(
          {
            id: userData.id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            profileImgUrl: userData.imageUuid
              ? imageUrl(userData.imageUuid)
              : '/assets/images/user-icon.svg',
          },
          accessToken
        );

        navigate('/');
      } catch (error) {
        setAuthenticationStatus('failed');
        if (isAxiosError(error)) {
          switch (error.response?.data['Errors'][0]['Message']) {
            case 'Cannot verify password':
              alert('Пароль неверный');
              break;
            case 'Cannot find user':
              alert('Пользователь не найден');
              break;

            default:
              break;
          }
        }
      }
    },
    [login, navigate, setAuthenticationStatus]
  );

  const handleLogout = useCallback(() => {
    Cookies.remove(config.cookie.accessToken);
    Cookies.remove(config.cookie.refreshToken);
    logout();
  }, [logout]);

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <div className={styles.login}>
      <div className={styles['form-wrapper']}>
        {!isAuthenticated && (
          <form
            className={styles.form}
            ref={formRef}
            onSubmit={handleFormSubmit}
          >
            <div style={{ fontSize: '35px', textAlign: 'center' }}>
              Авторизация
            </div>
            <div className={styles.container}>
              <div className={styles['input-group']}>
                <label htmlFor='Email'>Эл. почта</label>
                <input
                  className={styles.input}
                  type='email'
                  name='Email'
                  required
                />
              </div>
              <div className={styles['input-group']}>
                <label htmlFor='Password'>Пароль</label>
                <input
                  className={styles.input}
                  type='password'
                  name='Password'
                  required
                />
              </div>
            </div>
            <button type='submit' className={styles['submit-btn']}>
              Авторизоваться
            </button>

            <div>
              Нет аккаунта? <Link to='/register'>Зарегистрироваться</Link>
            </div>
          </form>
        )}
        {isAuthenticated && (
          <div className={styles['logined-wrapper']}>
            <div>
              Вы авторизованы как {`${user.firstName} ${user.lastName}`}
            </div>
            <div>Выйти из аккаунта?</div>
            <div className={styles['logined-choises']}>
              <button onClick={handleLogout}>Выйти</button>
              <button onClick={handleGoBack}>Вернуться</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
