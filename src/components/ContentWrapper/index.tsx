import { User } from '@phosphor-icons/react';
import { CredentialList } from './CredentialList';
import { SearchCredentials } from './SearchCredentials';
import './styles.sass';
import { useState } from 'react';
import type { Credential } from '../../types/Credential';
import { CredentialDetails } from './CredentialItem/CredentialDetails';

export function ContentWrapper() {
  const credentials = [
    {
      id: '1',
      name: 'Netflix',
      website: 'www.test.com',
      login: 'johndoe@gmail.com',
      password: 'password',
    },
    {
      id: '2',
      name: 'Steam',
      website: 'www.test2.com',
      login: 'johndoe@gmail.com',
      password: 'password',
    },
  ];

  const [selectedCredential, setSelectedCredential] =
    useState<Credential | null>(null);

  const handleCredentialSelect = (credential: Credential) => {
    if (selectedCredential && selectedCredential.id === credential.id)
      setSelectedCredential(null);
    setSelectedCredential(credential);
  };

  return (
    <>
      <div className="outer-wrapper">
        <header className="content-header">
          <SearchCredentials />
          <button>
            <User size={22} />
          </button>
        </header>
        <div className="bottom-wrapper">
          <CredentialList
            credentials={credentials}
            selectedCredential={selectedCredential}
            onSelectCredential={handleCredentialSelect}
          />
          {selectedCredential && (
            <CredentialDetails credential={selectedCredential} />
          )}
        </div>
      </div>
    </>
  );
}
