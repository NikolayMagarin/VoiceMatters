import { SearchNewsParams, SearchPetitionsParams } from './types';

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
  getPetition: (id: string) => `api/petitions/${id}?allowBlocked=true`,
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

    if (params.blocked) {
      query.set('AllowBlocked', 'true');
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
    const query = new URLSearchParams({
      PageNumber: pageNumber.toString(),
      PageSize: pageSize.toString(),
      AllowBlocked: 'true',
    });

    if (searchPhrase) {
      query.set('SearchPhrase', searchPhrase);
    }

    return `/api/users?${query}`;
  },
  updatePetiton: 'api/petitions',
  completePetiton: (id: string) => `api/petitions/${id}/complete`,
  deletePetition: (id: string) => `api/petitions/${id}`,
  createNews: 'api/news',
  updateNews: 'api/news',
  deleteNews: (id: string) => `api/news/${id}`,
  getUser: (id: string) => `api/users/${id}?allowBlocked=true`,
  getStats: 'api/stats',
  searchNews: (params: SearchNewsParams) => {
    const query = new URLSearchParams({
      PageNumber: params.pageNumber.toString(),
      PageSize: params.pageSize.toString(),
    });

    if (params.title) {
      query.set('SearchPhrase', params.title);
    }

    switch (params.sort.type) {
      case 'date':
        query.set(
          'SortByCompleteDate',
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

    return `api/news?${query}`;
  },
  blockPetition: (id: string) => {
    const query = new URLSearchParams({
      Id: id,
    });

    return `api/admin/block-petition?${query}`;
  },
  unblockPetition: (id: string) => {
    const query = new URLSearchParams({
      Id: id,
    });

    return `api/admin/unblock-petition?${query}`;
  },
  blockUser: (id: string) => {
    const query = new URLSearchParams({
      Id: id,
    });

    return `api/admin/block-user?${query}`;
  },
  unblockUser: (id: string) => {
    const query = new URLSearchParams({
      Id: id,
    });

    return `api/admin/unblock-user?${query}`;
  },
};
