import { getBlob } from '../../../utils/getBlob';

export async function preparePetition({
  id,
  title,
  payload,
  images,
  tags,
}: {
  id: string;
  title: string;
  payload: string;
  images: { image: string; name: string; id?: string }[];
  tags: string[];
}): Promise<FormData> {
  const formData = new FormData();

  formData.append('Id', id);
  formData.append('Title', title);
  formData.append('TextPayload', payload);
  if (tags.length) {
    tags.forEach((tag, i) => {
      formData.append(`Tags[${i}]`, tag);
    });
  } else {
    formData.append('Tags', '[]');
  }

  if (images.length) {
    (
      await Promise.all(
        images.map((image) => (image.id ? null : getBlob(image.image)))
      )
    ).forEach((file, i) => {
      if (file) {
        formData.append(`Images[${i}].File`, file, images[i].name || 'image');
      } else {
        formData.append(`Images[${i}].Uuid`, images[i].id!);
      }
      formData.append(`Images[${i}].Caption`, images[i].name);
      formData.append(`Images[${i}].Order`, `${i + 1}`);
    });
  } else {
    formData.append('Images', '[]');
  }

  return formData;
}
