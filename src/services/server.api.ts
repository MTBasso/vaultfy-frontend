import axios, { type AxiosResponse } from 'axios';

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
  registerUser: async (username: string, email: string, password: string) => {
    const response = await serverApi.post('user/register', {
      username,
      email,
      password,
    });
    if (!response.data) throw new Error('Internal server error');
    const { token, user } = response.data;
    localStorage.setItem('authToken', token);
    localStorage.setItem('userId', user.id);

    serverApi.defaults.headers.common.Authorization = `Bearer ${token}`;
    serverApi.defaults.headers.common.UserId = user.id;

    return response;
  },
  loginUser: async (email: string, password: string) => {
    const response = await serverApi.post('user/login', { email, password });
    if (!response.data) throw new Error('Internal server error');
    const { token, userId } = response.data;

    localStorage.setItem('authToken', token);
    localStorage.setItem('userId', userId);

    serverApi.defaults.headers.common.Authorization = `Bearer ${token}`;
    serverApi.defaults.headers.common.UserId = userId;
    return response;
  },
  readUser: async (userId: string) => {
    const response = await serverApi.get(`user/read/${userId}`);
    if (!response.data) throw new Error('Internal server error');
    return response;
  },
};

export const vaultService = {
  listUserVaults: async (userId?: string) => {
    let response: AxiosResponse;
    if (userId === undefined)
      response = await serverApi.get(
        `vault/list/${serverApi.defaults.headers.common.UserId}`,
      );
    response = await serverApi.get(`vault/list/${userId}`);
    if (!response.data) throw new Error('Internal server error');
    return response;
  },
  createVault: async (name: string, color: string) => {
    const response = await serverApi.post('vault/register', { name, color });
    if (!response.data) throw new Error('Internal server error');
    return response;
  },
  editVault: async (vaultId: string, name?: string, color?: string) => {
    if (!name && !color) throw new Error('Bad Request');
    const response = await serverApi.patch(`vault/update/${vaultId}`, {
      name,
      color,
    });
    return response;
  },
  deleteVault: async (vaultId: string) => {
    const response = await serverApi.delete(`vault/delete/${vaultId}`);
    return response;
  },
};

export const credentialService = {
  listVaultCredentials: async (vaultId: string) => {
    const response = await serverApi.get(`credential/list/${vaultId}`);
    return response;
  },
  readCredential: async (credentialId: string) => {
    const response = await serverApi.get(`credential/read/${credentialId}`);
    return response;
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
    return response;
  },
  editCredential: async (
    credentialId: string,
    name?: string,
    website?: string,
    login?: string,
    password?: string,
  ) => {
    if (!name && !website && !login && !password)
      throw new Error('Bad Request');
    const response = await serverApi.patch(
      `credential/update/${credentialId}`,
      {
        name,
        login,
        website,
        password,
      },
    );
    return response;
  },
  deleteCredential: async (credentialId: string) => {
    const response = await serverApi.delete(
      `credential/delete/${credentialId}`,
    );
    return response;
  },
};
