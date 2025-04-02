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
