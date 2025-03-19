import Cookies from 'js-cookie';
import { ChangeEvent, FormEvent, useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { config } from '../../config';
import { api, apiPath } from '../../lib/api';
import type { GetUserResponse, RegisterResponse } from '../../lib/api/types';
import { useAuth } from '../../lib/auth';
import { imageUrl } from '../../utils/imageUrl';
import styles from './Register.module.css';
import { validateFormData } from './utils/validateForm';

function Register() {
  const formRef = useRef<HTMLFormElement>(null);
  const [imagePreview, setImagePreview] = useState('');
  const { login, setAuthenticationStatus, isAuthenticated, user, logout } =
    useAuth();
  const navigate = useNavigate();

  const handleImageSelect = useCallback(
    (e: ChangeEvent) => {
      const image = (e.target as HTMLInputElement).files?.[0];
      if (image) {
        imagePreview && URL.revokeObjectURL(imagePreview);
        setImagePreview(URL.createObjectURL(image));
      }
    },
    [imagePreview]
  );

  const handleFormSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const validated = validateFormData(new FormData(formRef.current!));
      if (validated.error) {
        alert(validated.error);
        return;
      }

      const data = validated.data as FormData;

      try {
        setAuthenticationStatus('pending');
        const registerResponse = await api.post<RegisterResponse>(
          apiPath.register,
          data
        );
        setAuthenticationStatus('succeeded');
        const { accessToken, refreshToken } = registerResponse.data;

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
        console.error(error);
        setAuthenticationStatus('failed');
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
    <div className={styles.register}>
      <div className={styles['form-wrapper']}>
        {!isAuthenticated && (
          <form
            className={styles.form}
            ref={formRef}
            onSubmit={handleFormSubmit}
          >
            <div style={{ fontSize: '35px', textAlign: 'center' }}>
              Регистрация
            </div>
            <div className={styles.container}>
              <div className={styles['input-group']}>
                <label htmlFor='FirstName'>Имя</label>
                <input
                  className={styles.input}
                  type='text'
                  name='FirstName'
                  required
                />
              </div>
              <div className={styles['input-group']}>
                <label htmlFor='LastName'>Фамилия</label>
                <input
                  className={styles.input}
                  type='text'
                  name='LastName'
                  required
                />
              </div>
              <div className={styles['input-group']}>
                <label htmlFor='DateOfBirth'>Дата рождения</label>
                <input
                  className={styles.input}
                  type='date'
                  name='DateOfBirth'
                />
              </div>
              <div className={styles['input-group']}>
                <label htmlFor='Sex'>Пол</label>
                <div className={styles['sex-input-container']}>
                  <div>
                    <input type='radio' name='Sex' value='Male' />
                    <label>М</label>
                  </div>
                  <div>
                    <input type='radio' name='Sex' value='Female' />
                    <label>Ж</label>
                  </div>
                </div>
              </div>
              <div className={styles['input-group']}>
                <label htmlFor='Phone'>Телефон</label>
                <input className={styles.input} type='tel' name='Phone' />
              </div>
              <div className={styles['input-group']}>
                <label htmlFor='Image'>Изображение профиля</label>
                <div className={styles.input}>
                  {imagePreview ? (
                    <>
                      <img
                        className={styles['image-preview']}
                        src={imagePreview}
                        alt='preview'
                      ></img>
                      {'Изменить'}
                    </>
                  ) : (
                    <>Выбрать</>
                  )}
                  <input
                    className={styles['image-input']}
                    type='file'
                    accept='image/png,image/jpeg'
                    name='Image'
                    onChange={handleImageSelect}
                  />
                </div>
              </div>
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
              Зарегистрироваться
            </button>
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

export default Register;
