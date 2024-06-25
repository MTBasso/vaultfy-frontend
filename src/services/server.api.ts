import axios from 'axios';
import {
  BadRequestError,
  InternalServerError,
  UnauthorizedError,
} from '../errors';
import type { Credential } from '../types/Credential';
import type { User } from '../types/User';
import type { Vault } from '../types/Vault';

const serverApi = axios.create({
  baseURL: 'http://localhost:5000/',
});

const authToken = localStorage.getItem('authToken');
const userId = localStorage.getItem('userId');

if (authToken && userId) {
  serverApi.defaults.headers.common.Authorization = `Bearer ${authToken}`;
  serverApi.defaults.headers.common.UserId = userId;
}

export const userService = {
  registerUser: async (
    username: string,
    email: string,
    password: string,
  ): Promise<{ token: string; user: User }> => {
    const response = await serverApi.post('user/register', {
      username,
      email,
      password,
    });
    if (response.data.error)
      throw new InternalServerError('Failed to register user');

    const { token, user } = response.data;
    localStorage.setItem('authToken', token);
    localStorage.setItem('userId', user.id);

    serverApi.defaults.headers.common.Authorization = `Bearer ${token}`;
    serverApi.defaults.headers.common.UserId = user.id;

    return response.data;
  },
  loginUser: async (
    email: string,
    password: string,
  ): Promise<{ token: string; userId: string }> => {
    const response = await serverApi.post('user/login', { email, password });
    if (response.data.error)
      throw new InternalServerError('Failed to log in user');

    const { token, userId } = response.data;
    localStorage.setItem('authToken', token);
    localStorage.setItem('userId', userId);

    serverApi.defaults.headers.common.Authorization = `Bearer ${token}`;
    serverApi.defaults.headers.common.UserId = userId;

    return response.data;
  },
  readUser: async (): Promise<User> => {
    const userId =
      serverApi.defaults.headers.common.UserId ||
      localStorage.getItem('userId');

    const response = await serverApi.get(`user/read/${userId}`);
    if (response.data.error)
      throw new InternalServerError('Failed to read user');

    return response.data.user;
  },
};

export const vaultService = {
  listUserVaults: async (): Promise<Vault[]> => {
    const userId =
      serverApi.defaults.headers.common.UserId ||
      localStorage.getItem('userId');

    if (userId === undefined)
      throw new UnauthorizedError('Missing userId in request');

    const response = await serverApi.get(`vault/list/${userId}`);
    if (response.data.error)
      throw new InternalServerError('Failed to fetch user vault list');

    return response.data.vaults;
  },
  createVault: async (name: string, color: string) => {
    const response = await serverApi.post('vault/register', { name, color });
    if (response.data.error)
      throw new InternalServerError('Failed to create vault');
  },
  editVault: async (vaultId: string, name?: string, color?: string) => {
    if (!name && !color)
      throw new BadRequestError('At least one field is required');

    const response = await serverApi.patch(`vault/update/${vaultId}`, {
      name,
      color,
    });
    if (response.data.error)
      throw new InternalServerError('Failed to update vault');

    return response;
  },
  deleteVault: async (vaultId: string) => {
    const response = await serverApi.delete(`vault/delete/${vaultId}`);
    if (response.data.error)
      throw new InternalServerError('Failed to delete vault');
  },
};

export const credentialService = {
  listVaultCredentials: async (vaultId: string): Promise<Credential[]> => {
    const response = await serverApi.get(`credential/list/${vaultId}`);
    if (response.data.error)
      throw new InternalServerError('Failed to fetch vault credential list ');

    return response.data.credentials;
  },
  readCredential: async (credentialId: string): Promise<Credential> => {
    const response = await serverApi.get(`credential/read/${credentialId}`);
    if (response.data.error)
      throw new InternalServerError('Failed to read credential');

    return response.data.credential;
  },
  createCredential: async (
    vaultId: string,
    name: string,
    website: string,
    login: string,
    password: string,
  ) => {
    const response = await serverApi.post(`credential/register`, {
      vaultId,
      name,
      website,
      login,
      password,
    });
    if (response.data.error)
      throw new InternalServerError('Failed to create credential');
  },
  editCredential: async (
    credentialId: string,
    name?: string,
    website?: string,
    login?: string,
    password?: string,
  ) => {
    if (!name && !website && !login && !password)
      throw new BadRequestError('At least one field is required');

    const response = await serverApi.patch(
      `credential/update/${credentialId}`,
      {
        name,
        login,
        website,
        password,
      },
    );
    if (response.data.error)
      throw new InternalServerError('Failed to update credential');
  },
  deleteCredential: async (credentialId: string) => {
    const response = await serverApi.delete(
      `credential/delete/${credentialId}`,
    );
    if (response.data.error)
      throw new InternalServerError('Failed to delete credential');
  },
};
