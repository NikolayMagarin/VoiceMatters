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
};
