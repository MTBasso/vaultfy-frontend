import { InternalServerError } from '../errors';
import type { User } from '../types/User';
import { serverApi } from './apiConfig';

export const userService = {
  registerUser: async (username: string, email: string, password: string): Promise<{ token: string; user: User }> => {
    const response = await serverApi.post('user/register', {
      username,
      email,
      password,
    });
    if (response.data.error) throw new InternalServerError('Failed to register user');

    const { token, user } = response.data;
    localStorage.setItem('authToken', token);
    localStorage.setItem('userId', user.id);

    serverApi.defaults.headers.common.Authorization = `Bearer ${token}`;
    serverApi.defaults.headers.common.UserId = user.id;

    return response.data;
  },
  loginUser: async (email: string, password: string): Promise<{ token: string; userId: string }> => {
    const response = await serverApi.post('user/login', { email, password });
    if (response.data.error) throw new InternalServerError('Failed to log in user');

    const { token, userId } = response.data;
    localStorage.setItem('authToken', token);
    localStorage.setItem('userId', userId);

    serverApi.defaults.headers.common.Authorization = `Bearer ${token}`;
    serverApi.defaults.headers.common.UserId = userId;

    return response.data;
  },
  readUser: async (): Promise<User> => {
    const userId = serverApi.defaults.headers.common.UserId || localStorage.getItem('userId');

    const response = await serverApi.get(`user/read/${userId}`);
    if (response.data.error) throw new InternalServerError('Failed to read user');

    return response.data.user;
  },
};
