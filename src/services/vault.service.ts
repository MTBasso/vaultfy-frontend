import { BadRequestError, InternalServerError, UnauthorizedError } from '../errors';
import type { Vault } from '../types/Vault';
import { serverApi } from './apiConfig';

export const vaultService = {
  listUserVaults: async (): Promise<Vault[]> => {
    const userId = serverApi.defaults.headers.common.UserId || localStorage.getItem('userId');

    if (userId === undefined) throw new UnauthorizedError('Missing userId in request');

    const response = await serverApi.get(`vault/list/${userId}`);
    if (response.data.error) throw new InternalServerError('Failed to fetch user vault list');

    return response.data.vaults;
  },
  createVault: async (name: string, color: string) => {
    const response = await serverApi.post('vault/register', { name, color });
    if (response.data.error) throw new InternalServerError('Failed to create vault');
  },
  editVault: async (vaultId: string, name?: string, color?: string) => {
    if (!name && !color) throw new BadRequestError('At least one field is required');

    const response = await serverApi.patch(`vault/update/${vaultId}`, {
      name,
      color,
    });
    if (response.data.error) throw new InternalServerError('Failed to update vault');

    return response;
  },
  deleteVault: async (vaultId: string) => {
    const response = await serverApi.delete(`vault/delete/${vaultId}`);
    if (response.data.error) throw new InternalServerError('Failed to delete vault');
  },
};
