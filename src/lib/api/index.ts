import axios from 'axios';
import { config } from '../../config';
import Cookies from 'js-cookie';
import { SearchPetitionsParams } from './types';

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

    return `/api/tags?${query}`;
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

    return `api/petitions/users?${query}`;
  },
  searchPetitions: (params: SearchPetitionsParams) => {
    const query = new URLSearchParams({
      PageNumber: params.pageNumber.toString(),
      PageSize: params.pageSize.toString(),
    });

    if (params.title) {
      query.set('SearchPhrase', params.title);
    }

    if (params.completed !== 'default') {
      query.set(
        'IncludeCompleted',
        params.completed === 'include' ? 'Enable' : 'Disable'
      );
    }

    switch (params.sort.type) {
      case 'date':
        query.set(
          'SortByDate',
          params.sort.descending ? 'Descending' : 'Ascending'
        );
        break;
      case 'signs':
        query.set(
          'SortBySignQuantity',
          params.sort.descending ? 'Descending' : 'Ascending'
        );
        break;
      case 'signsToday':
        query.set(
          'SortBySignQuantityPerDay',
          params.sort.descending ? 'Descending' : 'Ascending'
        );
        break;
    }

    params.tagIds.forEach((tagId) => query.append('TagIds', tagId));

    if (params.userId) {
      query.set('CreatorId', params.userId);
      return `api/users/petitions?${query}`;
    }

    return `api/petitions?${query}`;
  },
  searchUsers: (
    searchPhrase?: string,
    pageSize: number = 10,
    pageNumber: number = 1
  ) => {
    if (!searchPhrase) {
      return '/api/users';
    }

    const query = new URLSearchParams({
      SearchPhrase: searchPhrase,
      PageNumber: pageNumber.toString(),
      PageSize: pageSize.toString(),
    });

    return `/api/users?${query}`;
  },
  updatePetiton: 'api/petitions',
  completePetiton: (id: string) => `api/petitions/${id}/complete`,
  createNews: 'api/news',
  updateNews: 'api/news',
  deleteNews: (id: string) => `api/news/${id}`,
};
