import { Plus } from '@phosphor-icons/react';
import { useState } from 'react';
import { useData } from '../../hooks/useData';
import type { Credential } from '../../types/Credential';
import { CredentialDetails } from './CredentialItem/CredentialDetails';
import { CredentialList } from './CredentialList';
import './styles.sass';
import { CreateCredentialModal } from '../Modals/CreateCredentialModal';

export function ContentWrapper() {
  const { credentials, selectedVault, selectedCredential, selectCredential, readCredential } = useData();

  const [isCreateCredentialModalOpen, setIsCreateCredentialModalOpen] = useState(false);

  const openCreateCredentialModal = () => setIsCreateCredentialModalOpen(true);
  const closeCreateCredentialModal = () => setIsCreateCredentialModalOpen(false);

  const handleCredentialSelect = async (credential: Credential) => {
    selectCredential(credential);
    await readCredential(credential.id);
  };

  return (
    <>
      <CreateCredentialModal isOpen={isCreateCredentialModalOpen} onClose={closeCreateCredentialModal} />
      <div className="outer-wrapper">
        <div className="content-header">
          {selectedVault ? (
            <>
              <button onClick={openCreateCredentialModal} className="add-credential-button">
                New Credential
                <Plus size={22} weight="bold" />
              </button>
              {/* <SearchCredentials /> */}
            </>
          ) : null}
        </div>
        <div className="bottom-wrapper">
          {credentials && (
            <CredentialList selectedCredential={selectedCredential} onSelectCredential={handleCredentialSelect} />
          )}
          {selectedCredential && <CredentialDetails />}
        </div>
      </div>
    </>
  );
}
