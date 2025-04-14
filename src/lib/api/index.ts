import axios from 'axios';
import { config } from '../../config';
import Cookies from 'js-cookie';

const defaultTransforms = axios.defaults.transformRequest
  ? Array.isArray(axios.defaults.transformRequest)
    ? axios.defaults.transformRequest
    : [axios.defaults.transformRequest]
  : [];

export const api = axios.create({
  baseURL: config.apiBaseUrl,
  transformRequest: [
    function (data, headers) {
      const token = Cookies.get(config.cookie.accessToken);

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        //
      }

      return data;
    },
    ...defaultTransforms,
  ],
});

export const apiPath = {
  register: '/api/auth/register',
  login: '/api/auth/signin',
  refreshToken: '/api/auth/refresh-token',
  getMyUser: '/api/users/me',
  createPetition: '/api/petitions',
  getTags: (
    searchPhrase?: string,
    pageSize: number = 10,
    pageNumber: number = 1
  ) => {
    if (!searchPhrase) {
      return '/api/tags';
    }

    const query = new URLSearchParams({
      SearchPhrase: searchPhrase,
      PageNumber: pageNumber.toString(),
      PageSize: pageSize.toString(),
    });

    return `/api/tags?${query.toString()}`;
  },
  getPetition: (id: string) => `api/petitions/${id}`,
  signPetition: (id: string) => `api/petitions/${id}/sign`,
  getPetitionUsers: (
    petitionId: string,
    pageSize: number = 10,
    pageNumber: number = 1
  ) => {
    const query = new URLSearchParams({
      PetitionId: petitionId,
      PageNumber: pageNumber.toString(),
      PageSize: pageSize.toString(),
    });

    return `api/petitions/users?${query.toString()}`;
  },
};
