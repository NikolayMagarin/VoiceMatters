import { getBlob } from '../../../utils/getBlob';

export async function preparePetition({
  title,
  payload,
  images,
  tags,
}: {
  title: string;
  payload: string;
  images: { image: string; name: string }[];
  tags: string[];
}): Promise<FormData> {
  const formData = new FormData();

  formData.append('Title', title);
  formData.append('TextPayload', payload);
  if (tags.length) {
    tags.forEach((tag, i) => {
      formData.append(`Tags[${i}]`, tag);
    });
  }

  if (images.length) {
    (await Promise.all(images.map((image) => getBlob(image.image)))).forEach(
      (file, i) => {
        formData.append(`Images[${i}].File`, file, images[i].name || 'image');
        formData.append(`Images[${i}].Caption`, images[i].name);
        formData.append(`Images[${i}].Order`, `${i + 1}`);
      }
    );
  } else {
    formData.append('Images', '[]');
  }

  return formData;
}
