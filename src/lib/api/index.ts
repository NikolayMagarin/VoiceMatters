import axios from 'axios';
import Cookies from 'js-cookie';
import { config } from '../../config';
import { errorHandler } from './errors';

export const api = axios.create({
  baseURL: config.apiBaseUrl,
});

api.interceptors.request.use(async (reqConfig) => {
  let token = Cookies.get(config.cookie.accessToken);
  if (token) {
    reqConfig.headers['Authorization'] = `Bearer ${token}`;
  }
  return reqConfig;
});

api.interceptors.response.use((res) => res, errorHandler);
