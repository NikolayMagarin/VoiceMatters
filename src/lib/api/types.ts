export interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export type GetAccessTokenResonse = string;

export interface GetUserResponse {
  id: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  email: string;
  birthDate: string | null;
  sex: string | null;
  imageUuid: string | null;
  isBlocked: boolean;
  petitionsCreated: number;
  petitionsSigned: number;
  createdDate: string;
  role: {
    id: string;
    name: 'User' | 'Admin';
  };
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
    caption: string | null;
    order: number;
  }[];
  newsTitle: string | null;
  newsId: string | null;
  creator: {
    id: string;
    firstName: string;
    lastName: string;
    sex: 'Male' | 'Female' | null;
    imageUuid: string | null;
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
  blocked: boolean;
  sort: {
    type: 'signs' | 'signsToday' | 'date';
    descending: boolean;
  };
  pageNumber: number;
  pageSize: number;
}

export type SearchPetitionsResponse = GetPetitionResponse[];

export type SearchUsersResponse = {
  id: string;
  firstName: string;
  lastName: string;
  sex: string | null;
  imageUuid: string | null;
  isBlocked: boolean;
}[];

export type UpdatePetitionResponse = GetPetitionResponse;

export interface CreateNewsResponse {
  id: string;
  title: string;
  petitionId: string;
  petitionImages: {
    id: string;
    uuid: string;
    caption: string;
    order: number;
  }[];
  petitionTags: [
    {
      id: string;
      name: string;
    }
  ];
  signQuantity: number;
  isPetitionBlocked: boolean;
}

export type UpdateNewsResponse = CreateNewsResponse;

export interface GetStatsResponse {
  id: string;
  userQuantity: number;
  petitionQuantity: number;
  signsQuantity: number;
}

export type StatsMessage =
  | StatsMessageWithQuantity
  | StatsMessageWithoutQuantity;

export interface StatsMessageWithoutQuantity {
  Method: 'PetitionCreated' | 'PetitionSigned' | 'UserRegistered';
}

export interface StatsMessageWithQuantity {
  Method: 'PetitionDeleted';
  Quantity: number;
}

export interface SearchNewsParams {
  title: string;
  sort: {
    type: 'signs' | 'signsToday' | 'date';
    descending: boolean;
  };
  pageNumber: number;
  pageSize: number;
}

export type SearchNewsResponse = CreateNewsResponse[];
