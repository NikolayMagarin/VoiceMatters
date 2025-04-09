interface Petition {
  title: string;
  payload: string;
  images: { image: string; name: string }[];
  tags: string[];
}

interface SuccessValidationResult {
  error: null;
  result: Petition;
}

interface FailedValidationResult {
  error: string;
}

export function validatePetition({
  title,
  payload,
  images,
  tags,
}: Petition): SuccessValidationResult | FailedValidationResult {
  if (title.length === 0) {
    return { error: 'Заголовок петиции отсутствует' };
  } else if (title.length < 10) {
    return { error: 'Заголовок петиции слишком короткий' };
  } else if (title.length > 200) {
    return { error: 'Заголовок петиции слишком длинный' };
  }

  if (tags.some((tag) => tag.length < 2)) {
    return {
      error: 'Некоторые добавленные теги слишком короткие',
    };
  }

  if (images.some((image) => image.name.length > 50)) {
    return {
      error: 'У некоторых изображений слишком длинное название',
    };
  }

  if (payload.length < 200) {
    return { error: 'Текст петиции слишком короткий' };
  } else if (payload.length > 20_000) {
    return { error: 'Текст петиции слишком длинный' };
  }

  return {
    error: null,
    result: {
      title,
      payload,
      images,
      tags,
    },
  };
}
