import { type ReactNode, createContext, useEffect, useState } from 'react';

import { BadRequestError } from '../errors';
import { credentialService } from '../services/credential.service';
import { userService } from '../services/user.service';
import { vaultService } from '../services/vault.service';
import type { Credential } from '../types/Credential';
import type { User } from '../types/User';
import type { Vault } from '../types/Vault';

interface DataContextType {
  user: User | null;
  vaults: Vault[] | null;
  selectedVault: Vault | null;
  credentials: Credential[] | null;
  selectedCredential: Credential | null;

  logout(): void;
  addVault(vault: Vault): void;
  fetchVaults(): Promise<void>;
  selectVault(vault: Vault | null): void;
  updateVault(updatedVault: Vault): void;
  removeVault(vaultId: string): void;
  fetchCredentials(vaultId: string): Promise<void>;
  selectCredential(credentialId: string): Promise<void>;
  updateCredential(credential: Partial<Credential>): Promise<Credential>;
  readCredential(credentialId: string): Promise<Credential>;
  deleteCredential(credentialId: string): Promise<void>;
  refreshContext(): void;
}

export const DataContext = createContext({} as DataContextType);

interface DataContextProviderProps {
  children: ReactNode;
}

export const DataContextProvider = ({ children }: DataContextProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [vaults, setVaults] = useState<Vault[] | null>(null);
  const [selectedVault, setSelectedVault] = useState<Vault | null>(null);
  const [credentials, setCredentials] = useState<Credential[] | null>(null);
  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const initialData = async () => {
      if (!user) setUser(await fetchUser());
      fetchVaults();
    };
    initialData();
  }, [refresh]);

  async function fetchUser() {
    return await userService.readUser();
  }

  function logout() {
    userService.logout();

    setUser(null);
    setVaults(null);
    setSelectedVault(null);
    setCredentials(null);
    setSelectedCredential(null);
  }

  function addVault(vault: Vault) {
    setVaults((prevVaults) => [...prevVaults!, vault]);
  }

  async function fetchVaults() {
    setVaults(await vaultService.listUserVaults());
  }

  function selectVault(vault: Vault | null) {
    setSelectedCredential(null);

    setSelectedVault(vault);
    setCredentials(null);
  }

  function updateVault(updatedVault: Vault) {
    setVaults((prevVaults) => prevVaults!.map((vault) => (vault.id === updatedVault.id ? updatedVault : vault)));
  }

  function removeVault(vaultId: string) {
    setVaults((prevVaults) => prevVaults!.filter((vault) => vault.id !== vaultId));
  }

  async function fetchCredentials(vaultId: string) {
    const credentials = await credentialService.listVaultCredentials(vaultId);
    setCredentials(credentials);
  }

  const selectCredential = async (credentialId: string) => {
    if (credentialId === '') setSelectedCredential(null);
    setSelectedCredential(await readCredential(credentialId));
  };

  const updateCredential = async (credential: Partial<Credential>) => {
    if (!credential.id) throw new BadRequestError('Missing credential Id');
    if (!credential.name && !credential.website && !credential.login && !credential.password)
      throw new BadRequestError('At least one field is required');
    const updatedCredential = await credentialService.editCredential(
      credential.id,
      credential.name,
      credential.website,
      credential.login,
      credential.password,
    );
    fetchCredentials(updatedCredential.vaultId);
    selectCredential(updatedCredential.id);
    return updatedCredential;
  };

  async function readCredential(credentialId: string): Promise<Credential> {
    const credential = await credentialService.readCredential(credentialId);
    return credential;
  }

  async function deleteCredential(credentialId: string) {
    const credentialToDelete = await readCredential(credentialId);
    console.log('cred to delete: ', credentialToDelete);

    await credentialService.deleteCredential(credentialId);

    selectCredential('');
  }

  const refreshContext = () => setRefresh((state) => !state);

  return (
    <DataContext.Provider
      value={{
        user,
        logout,
        vaults,
        addVault,
        fetchVaults,
        selectedVault,
        selectVault,
        updateVault,
        removeVault,
        credentials,
        fetchCredentials,
        updateCredential,
        readCredential,
        deleteCredential,
        selectedCredential,
        selectCredential,
        refreshContext,
      }}>
      {children}
    </DataContext.Provider>
  );
};
