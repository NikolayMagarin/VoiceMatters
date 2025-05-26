import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../../lib/api';
import { apiPath } from '../../lib/api/apiPath';
import type { RegisterResponse } from '../../lib/api/types';
import { saveCookies, useAuth } from '../../lib/auth';
import styles from './Register.module.css';
import { validateFormData } from './utils/validateForm';

function Register() {
  const formRef = useRef<HTMLFormElement>(null);
  const [imagePreview, setImagePreview] = useState('');
  const { login, isAuthenticated, user, logout, fetchUser } = useAuth();
  const navigate = useNavigate();
  const [submitStarted, setSubmitStarted] = useState(false);

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
        toast.error(validated.error);
        return;
      }
      setSubmitStarted(true);

      const data = validated.data as FormData;

      try {
        const registerResponse = await api.post<RegisterResponse>(
          apiPath.register,
          data
        );
        const { accessToken, refreshToken } = registerResponse.data;

        saveCookies({ accessToken, refreshToken });
        login(null, accessToken);
        fetchUser();

        URL.revokeObjectURL(imagePreview);

        navigate('/');
      } catch {
        setSubmitStarted(false);
      }
    },
    [login, navigate, imagePreview, fetchUser]
  );

  useEffect(() => {}, []);

  const handleGoBack = useCallback(() => {
    navigate('/');
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
                        alt=''
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
            <button
              type='submit'
              className={styles['submit-btn']}
              disabled={submitStarted}
            >
              Зарегистрироваться
            </button>
            <div style={{ textAlign: 'center' }}>
              Уже есть аккаунт? <Link to='/login'>Авторизоваться</Link>
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

export default Register;
