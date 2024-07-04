import { BadRequestError, InternalServerError } from '../errors';
import type { Credential } from '../types/Credential';
import { serverApi } from './apiConfig';

export const credentialService = {
  listVaultCredentials: async (vaultId: string): Promise<Credential[]> => {
    const response = await serverApi.get(`credential/list/${vaultId}`);
    if (response.data.error) throw new InternalServerError('Failed to fetch vault credential list ');

    return response.data.credentials;
  },
  readCredential: async (credentialId: string): Promise<Credential> => {
    const response = await serverApi.get(`credential/read/${credentialId}`);
    if (response.data.error) throw new InternalServerError('Failed to read credential');

    return response.data.credential;
  },
  createCredential: async (vaultId: string, name: string, website: string, login: string, password: string) => {
    const response = await serverApi.post(`credential/register`, {
      vaultId,
      name,
      website,
      login,
      password,
    });
    if (response.data.error) throw new InternalServerError('Failed to create credential');
  },
  editCredential: async (
    credentialId: string,
    name?: string,
    website?: string,
    login?: string,
    password?: string,
  ): Promise<Credential> => {
    if (!name && !website && !login && !password) throw new BadRequestError('At least one field is required');

    const response = await serverApi.patch(`credential/update/${credentialId}`, {
      name,
      login,
      website,
      password,
    });
    if (response.data.error) {
      throw new InternalServerError(`Failed to update credential: ${response.data.error}`);
    }
    return response.data.credential;
  },
  deleteCredential: async (credentialId: string) => {
    const response = await serverApi.delete(`credential/delete/${credentialId}`);
    if (response.data.error) throw new InternalServerError('Failed to delete credential');
  },
};
