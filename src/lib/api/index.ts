import axios from 'axios';
import { config } from '../../config';
import { errorHandler } from './errors';

export const api = axios.create({
  baseURL: config.apiBaseUrl,
});

api.interceptors.response.use((res) => res, errorHandler);
