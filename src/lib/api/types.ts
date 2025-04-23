export interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface GetUserResponse {
  id: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  email: string;
  birthDate: string | null; // ?
  sex: string | null;
  imageUuid: string | null;
  isBlocked: boolean;
  petitionsCreated: number;
  petitionsSigned: number;
  createdDate: string; // ?
}

export type GetTagsResponse = { id: string; name: string }[];

export interface GetPetitionResponse {
  id: string;
  title: string;
  textPayload: string;
  signQuantity: number;
  signQuantityPerDay: number;
  isCompleted: boolean;
  isBlocked: boolean;
  signedByCurrentUser: boolean;
  tags: {
    id: string;
    name: string;
  }[];
  images: {
    id: string;
    uuid: string;
    caption: string;
    order: number;
  }[];
  newsTitle: string;
  creator: {
    id: string;
    firstName: string;
    lastName: string;
    sex: 'Male' | 'Female' | null;
    imageUuid: string;
    isBlocked: boolean;
  };
  createdDate: string;
  updatedDate: string;
}

export type CreatePetitionResponse = GetPetitionResponse;

export type GetPetitionUsersResponse = {
  id: string;
  firstName: string;
  lastName: string;
  sex: string;
  imageUuid: string;
  isBlocked: boolean;
}[];

export interface SearchPetitionsParams {
  title: string;
  userId: string;
  tagIds: string[];
  completed: 'include' | 'exclude' | 'default';
  sort: {
    type: 'signs' | 'signsToday' | 'date';
    descending: boolean;
  };
  pageNumber: number;
  pageSize: number;
}

export type SearchPetitionsResponse = GetPetitionResponse[];
