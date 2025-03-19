export function validateFormData(data: FormData):
  | {
      data: FormData;
      error: null;
    }
  | { data: null; error: string } {
  const validated = new FormData();

  const values = {
    FirstName: (data.get('FirstName') as string).trim(),
    LastName: (data.get('LastName') as string).trim(),
    DateOfBirth: data.get('DateOfBirth') as string,
    Sex: data.get('Sex') as string,
    Phone: (data.get('Phone') as string).trim(),
    Email: (data.get('Email') as string).trim(),
    Password: data.get('Password') as string,
    Image: data.get('Image') as File,
  };

  if (!values.FirstName) {
    return { error: 'Обязательное поле "Имя" не заплнено', data: null };
  }

  if (!values.LastName) {
    return { error: 'Обязательное поле "Фамилия" не заплнено', data: null };
  }

  if (!values.Email) {
    return { error: 'Обязательное поле "Эл. почта" не заплнено', data: null };
  }

  if (!values.Password) {
    return { error: 'Обязательное поле "Пароль" не заплнено', data: null };
  }

  if (
    values.FirstName.length < 2 ||
    values.FirstName.length > 30 ||
    values.FirstName.includes(' ')
  ) {
    return {
      error: 'Введите имя от 2 до 30 символов без пробелов',
      data: null,
    };
  }

  if (
    values.LastName.length < 2 ||
    values.LastName.length > 30 ||
    values.LastName.includes(' ')
  ) {
    return {
      error: 'Введите фамилию от 2 до 30 символов без пробелов',
      data: null,
    };
  }

  if (values.DateOfBirth && new Date(values.DateOfBirth) > new Date()) {
    return { error: 'Введена некорректная дата рождения', data: null };
  }

  if (
    values.Phone &&
    !/^((8|\+7)[- ]?)?(\(?\d{3}\)?[- ]?)?[\d\- ]{7,10}$/.test(values.Phone)
  ) {
    return { error: 'Введен некорректный номер телефона', data: null };
  }

  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(values.Email)) {
    return { error: 'Введен некорректный адрес электронной почты', data: null };
  }

  if (
    !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,30}$/.test(
      values.Password
    )
  ) {
    return {
      error:
        'Введенный пароль слишком слабый, используйте от 8 до 30 латинских символов, разные регистры и специальные символы',
      data: null,
    };
  }

  validated.append('FirstName', values.FirstName);
  validated.append('LastName', values.LastName);
  values.DateOfBirth && validated.append('DateOfBirth', values.DateOfBirth);
  values.Sex && validated.append('Sex', values.Sex);
  values.Phone && validated.append('Phone', values.Phone);
  validated.append('Email', values.Email);
  validated.append('Password', values.Password);
  values.Image && values.Image.size && validated.append('Image', values.Image);

  return { data: validated, error: null };
}
