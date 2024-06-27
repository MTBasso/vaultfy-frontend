import { Plus } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { useData } from '../../hooks/useData';
import { CredentialDetails } from './CredentialItem/CredentialDetails';
import { CredentialList } from './CredentialList';
import './styles.sass';
import { CreateCredentialModal } from '../Modals/CreateCredentialModal';

export function ContentWrapper() {
  const { credentials, selectedVault, selectedCredential, selectCredential, fetchCredentials } = useData();

  const [isCreateCredentialModalOpen, setIsCreateCredentialModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const openCreateCredentialModal = () => setIsCreateCredentialModalOpen(true);
  const closeCreateCredentialModal = () => setIsCreateCredentialModalOpen(false);

  const handleCredentialSelect = async (credentialId: string) => {
    await selectCredential(credentialId);
  };

  useEffect(() => {
    if (!selectedVault) return;

    setLoading(true);

    const loadCredentials = async () => {
      try {
        console.log('loadCredentials called');
        await fetchCredentials(selectedVault.id);
      } catch (error) {
        console.error('Failed to fetch Credentials: ', error);
      } finally {
        setLoading(false);
      }
    };

    loadCredentials();
  }, [selectedVault]);

  useEffect(() => {
    if (!selectedCredential || !selectedCredential.id) {
      console.log('no selected credential');
      return;
    }

    setLoading(true);
    const fetchData = async () => {
      try {
        console.log('selectedCredential');
        await selectCredential(selectedCredential.id);
      } catch (error) {
        console.error('Error selecting Credential: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="modals">
        <CreateCredentialModal isOpen={isCreateCredentialModalOpen} onClose={closeCreateCredentialModal} />
      </div>
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
          {loading === true ? (
            <div className="skeleton">
              <h4>Credentials</h4>

              <div className="skeleton-item" />
              <div className="skeleton-item" />
              <div className="skeleton-item" />
            </div>
          ) : (
            <>
              {credentials && (
                <div className="credentials-list-wrapper">
                  <h4>Credentials</h4>
                  <CredentialList selectedCredential={selectedCredential} onSelectCredential={handleCredentialSelect} />
                </div>
              )}
              {selectedCredential && <CredentialDetails />}
            </>
          )}
        </div>
      </div>
    </>
  );
}
