import { FormEvent, useCallback, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { apiPath } from '../../lib/api/apiPath';
import { LoginResponse } from '../../lib/api/types';
import { saveCookies, useAuth } from '../../lib/auth';
import styles from './Login.module.css';

function Login() {
  const formRef = useRef<HTMLFormElement>(null);
  const { login, isAuthenticated, user, logout, fetchUser } = useAuth();
  const navigate = useNavigate();
  const [submitStarted, setSubmitStarted] = useState(false);

  const handleFormSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setSubmitStarted(true);

      const data = new FormData(formRef.current!);

      try {
        const {
          data: { accessToken, refreshToken },
        } = await api.post<LoginResponse>(apiPath.login, {
          email: data.get('Email')?.toString(),
          password: data.get('Password')?.toString(),
        });

        saveCookies({ accessToken, refreshToken });
        login(null, accessToken);
        fetchUser();

        navigate('/');
      } catch {
        setSubmitStarted(false);
      }
    },
    [login, navigate, fetchUser]
  );

  const handleGoBack = useCallback(() => {
    navigate('/');
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
            <button
              type='submit'
              className={styles['submit-btn']}
              disabled={submitStarted}
            >
              Авторизоваться
            </button>

            <div>
              Нет аккаунта? <Link to='/register'>Зарегистрироваться</Link>
            </div>
          </form>
        )}
        {isAuthenticated && !!user && (
          <div className={styles['logined-wrapper']}>
            <div>
              Вы авторизованы как {`${user.firstName} ${user.lastName}`}
            </div>
            <div>Выйти из аккаунта?</div>
            <div className={styles['logined-choises']}>
              <button onClick={logout}>Выйти</button>
              <button onClick={handleGoBack}>На главную</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
