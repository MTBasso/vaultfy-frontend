import { type ReactNode, createContext, useEffect, useState } from 'react';

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
  fetchVaults(): void;
  selectVault(vault: Vault | null): void;
  updateVault(updatedVault: Vault): void;
  removeVault(vaultId: string): void;
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
      if (!user) setUser(await fetchUser());
      fetchVaults();
    };
    initialData();
  }, [refresh]);

  async function fetchUser() {
    return await userService.readUser();
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

  function addVault(vault: Vault) {
    setVaults((prevVaults) => [...prevVaults!, vault]);
  }

  async function fetchVaults() {
    const vaults = await vaultService.listUserVaults();
    setVaults(vaults);
  }

  function selectVault(vault: Vault | null) {
    setSelectedVault(vault);
    setCredentials(null);
    if (selectedCredential?.vaultId !== vault?.id) selectCredential(null);
  }

  function updateVault(updatedVault: Vault) {
    setVaults((prevVaults) =>
      prevVaults!.map((vault) =>
        vault.id === updatedVault.id ? updatedVault : vault,
      ),
    );
  }

  function removeVault(vaultId: string) {
    setVaults((prevVaults) =>
      prevVaults!.filter((vault) => vault.id !== vaultId),
    );
  }

  async function fetchCredentials(vaultId: string) {
    const credentials = await credentialService.listVaultCredentials(vaultId);
    setCredentials(credentials);
  }

  const selectCredential = (credential: Credential | null) => {
    setSelectedCredential(credential);
  };

  async function readCredential(credentialId: string): Promise<Credential> {
    const credential = await credentialService.readCredential(credentialId);
    return credential;
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
        readCredential,
        selectedCredential,
        selectCredential,
        refreshContext,
      }}>
      {children}
    </DataContext.Provider>
  );
};
