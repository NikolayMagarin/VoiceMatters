const authErrorTextMapper: [
  RegExp,
  string | ((...matchGroups: string[]) => string)
][] = [
  [
    /^Cannot find user|Refresh token expired|Incorrect refresh token/,
    'Сессия истекла',
  ],
];

const badRequestErrorTextMapper: [
  RegExp,
  string | ((...matchGroups: string[]) => string)
][] = [
  [/^Cannot find petition|Cannot get petition/, 'Петиция не найдена'],
  [/^Cannot find user|Cannot find creator/, 'Пользователь не найден'],
  [
    /^Authorization error|Authrization error|Only petition creator can delete news for this petition|Only petition creator can update news for this petition/,
    'Недостачно прав',
  ],
  [
    /^Cannot create news for uncompleted petition/,
    'Сначала завершите петицию, чтобы создать новость',
  ],
  [
    /^Cannot create news for blocked petition/,
    'Петиция заблокирована администратором',
  ],
  [/^Cannot create news/, 'Ошибка при создании новости'],
  [/^Cannot create petition/, 'Ошибка при создании петиции'],
  [/^Cannot create tag|Cannot create PetitionTag/, 'Ошибка при создании тега'],
  [
    /^Cannot create imageURL|Cannot create new image|IFormFile is empty/,
    'Ошибка при загрузке изображения',
  ],
  [/^Cannot find news/, 'Новость не найдена'],
  [
    /^Cannot complete blocked petition/,
    'Петиция заблокирована администратором',
  ],
  [/^Cannot sign petition/, 'Ошибка при подписании петиции'],
  [/^Petition .+ is completed/, 'Петиция завершена'],
  [/^Petition already signed/, 'Петиция уже подписана'],
  [
    /^Cannot update petition with (\d+) and more signs/,
    (signs) => `Редактирование петиции с ${signs} подписями невозможно`,
  ],
  [
    /^User with email .+ already registered/,
    'Пользователь с этим адресом эл. почты уже зарегистрирован',
  ],
  [/^Cannot create user/, 'Ошибка при регистрации пользователя'],
  [/^User is blocked/, 'Пользователь заблокирован администратором'],
  [/^Cannot verify password/, 'Пароль неверный'],
  [/^Cannot verify password/, 'Пароль неверный'],
];

export { authErrorTextMapper, badRequestErrorTextMapper };
