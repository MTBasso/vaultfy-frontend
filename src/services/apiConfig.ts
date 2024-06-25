import axios from 'axios';
import {
  BadRequestError,
  InternalServerError,
  UnauthorizedError,
} from '../errors';

export const serverApi = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_BASE_URL,
});

const authToken = localStorage.getItem('authToken');
const userId = localStorage.getItem('userId');

if (authToken && userId) {
  serverApi.defaults.headers.common.Authorization = `Bearer ${authToken}`;
  serverApi.defaults.headers.common.UserId = userId;
}

serverApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      switch (status) {
        case 400:
          return Promise.reject(
            new BadRequestError(data.message || 'Bad Request'),
          );
        case 401:
          return Promise.reject(
            new UnauthorizedError(data.message || 'Unauthorized'),
          );
        case 500:
          return Promise.reject(
            new InternalServerError(data.message || 'Internal Server Error'),
          );
        default:
          return Promise.reject(new Error(data.message || 'An error occurred'));
      }
    }
    if (error.request) {
      return Promise.reject(
        new Error('No response from server. Please try again later.'),
      );
    }
    return Promise.reject(
      new Error(`Error in setting up request: ${error.message}`),
    );
  },
);

export const imageApi = axios.create({
  baseURL: import.meta.env.VITE_IMAGE_API_BASE_URL,
});

imageApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      switch (status) {
        case 400:
          return Promise.reject(new Error('Bad Request'));
        case 404:
          return Promise.reject(new Error('Not Found'));
        case 500:
          return Promise.reject(
            new InternalServerError('Internal Server Error'),
          );
        default:
          return Promise.reject(new Error(data.message || 'An error occurred'));
      }
    }
    if (error.request) {
      return Promise.reject(
        new Error('No response from server. Please try again later.'),
      );
    }
    return Promise.reject(
      new Error(`Error in setting up request: ${error.message}`),
    );
  },
);
