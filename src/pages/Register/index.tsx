import { useEffect, useRef } from 'react';
import Image from './images/image.png';
import styles from './Register.module.css';

function Register() {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const form = formRef.current;
    const inputs = form?.getElementsByTagName('input');

    const onEnter = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && e.target instanceof HTMLElement) {
        e.preventDefault();
        if (e.target.nextSibling instanceof HTMLElement) {
          e.target.nextSibling.focus();
        } else if (
          e.target instanceof HTMLButtonElement &&
          e.target.type === 'submit'
        ) {
          form?.requestSubmit();
        }
      }
    };

    if (inputs) {
      for (let i = 0; i < inputs.length; i++) {
        const input = inputs.item(i);
        input?.addEventListener('keypress', onEnter);
      }
    }

    const onFormSubmit = (e: SubmitEvent) => {
      e.preventDefault();
      if (
        e.target instanceof HTMLFormElement &&
        e.submitter instanceof HTMLButtonElement &&
        e.submitter.type === 'submit'
      ) {
        // console.log(e.target.elements);
        // e.target.elements;

        alert(
          (e.target.elements.namedItem('fullname') as HTMLInputElement).value
        );
      }
    };

    form?.addEventListener('submit', onFormSubmit);

    return () => {
      if (inputs) {
        for (let i = 0; i < inputs.length; i++) {
          const input = inputs.item(i);
          input?.removeEventListener('keypress', onEnter);
        }
      }

      form?.removeEventListener('submit', onFormSubmit);
    };
  }, []);

  return (
    <div className={styles.Register}>
      <img src={Image} alt='Река в лесу в горах' className={styles.image} />
      <div className={styles['form-wrapper']}>
        <form className={styles.form} ref={formRef}>
          <div style={{ fontSize: '35px', textAlign: 'center' }}>
            Регистрация
          </div>
          <input
            className={styles.input}
            type='text'
            name='fullname'
            placeholder='Имя Фамилия'
            required
          />
          <input
            className={styles.input}
            type='text'
            name='city'
            placeholder='Город'
          />
          <input
            className={styles.input}
            type='email'
            name='email'
            placeholder='Email'
            required
          />
          <input
            className={styles.input}
            type='password'
            name='password'
            placeholder='Пароль'
            required
          />
          <button type='submit' className={styles['submit-btn']}>
            Зарегистрироваться
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
