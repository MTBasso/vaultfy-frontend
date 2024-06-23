import { type ReactNode, createContext, useEffect, useState } from 'react';
import {
  credentialService,
  userService,
  vaultService,
} from '../services/server.api';
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
  fetchVaults(): void;
  selectVault(vault: Vault | null): void;
  fetchCredentials(vaultId: string): void;
  selectCredential(credential: Credential | null): void;
  readCredential(credentialId: string): Promise<Credential>;
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
  const [selectedCredential, setSelectedCredential] =
    useState<Credential | null>(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const initialData = async () => {
      const user = await fetchUser();
      setUser(user);
      fetchVaults(user.id);
    };
    initialData();
  }, [refresh]);

  async function fetchUser() {
    const userId = localStorage.getItem('userId');
    if (!userId) throw new Error('No user id');
    const response = await userService.readUser(userId);
    return response.data.user;
  }

  function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    setUser(null);
    setVaults(null);
    setSelectedVault(null);
    setCredentials(null);
    setSelectedCredential(null);
  }

  async function fetchVaults(inputId?: string) {
    const userId = localStorage.getItem('userId') || inputId;
    if (!userId) throw new Error('No user id');
    const response = await vaultService.listUserVaults(userId);
    setVaults(response.data.vaults);
  }

  function selectVault(vault: Vault | null) {
    setSelectedVault(vault);
  }

  async function fetchCredentials(vaultId: string) {
    const response = await credentialService.listVaultCredentials(vaultId);
    console.log(response);
    setCredentials(response.data.credentials);
  }

  function selectCredential(credential: Credential | null) {
    setSelectedCredential(credential);
  }

  async function readCredential(credentialId: string): Promise<Credential> {
    const response = await credentialService.readCredential(credentialId);
    return response.data.Credential;
  }

  function refreshContext() {
    setRefresh((state) => !state);
  }

  return (
    <DataContext.Provider
      value={{
        user,
        vaults,
        selectedVault,
        credentials,
        selectedCredential,
        logout,
        fetchVaults,
        selectVault,
        fetchCredentials,
        selectCredential,
        readCredential,
        refreshContext,
      }}>
      {children}
    </DataContext.Provider>
  );
};
