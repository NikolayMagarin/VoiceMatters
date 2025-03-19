import axios from 'axios';
import { config } from '../../config';
import Cookies from 'js-cookie';

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
  ],
});

export const apiPath = {
  register: '/api/auth/register',
  getMyUser: '/api/users/me',
};
