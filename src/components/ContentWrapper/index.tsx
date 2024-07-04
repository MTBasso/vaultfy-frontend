import { Plus } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { useData } from '../../hooks/useData';
import { CredentialDetails } from './CredentialItem/CredentialDetails';
import { CredentialList } from './CredentialList';
import './styles.sass';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { CreateCredentialModal } from '../Modals/CreateCredentialModal';
import { CredentialDetailsModal } from '../Modals/CredentialDetailsModal';

export function ContentWrapper() {
  const { user, credentials, selectedVault, selectedCredential, selectCredential, fetchCredentials } = useData();

  const [isCreateCredentialModalOpen, setIsCreateCredentialModalOpen] = useState(false);
  const [isCredentialDetailsModalOpen, setIsCredentialDetailsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const openCreateCredentialModal = () => setIsCreateCredentialModalOpen(true);
  const closeCreateCredentialModal = () => setIsCreateCredentialModalOpen(false);

  const openCredentialDetailsModal = () => setIsCredentialDetailsModalOpen(true);
  const closeCredentialDetailsModal = () => setIsCredentialDetailsModalOpen(false);

  const handleCredentialSelect = async (credentialId: string) => {
    selectCredential(credentialId);
  };

  useEffect(() => {
    if (!selectedVault) return;

    setLoading(true);

    const loadCredentials = async () => {
      try {
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
    if (selectedCredential) openCredentialDetailsModal();
  }, [selectedCredential]);

  useEffect(() => {
    if (!selectedCredential || !selectedCredential.id) return;

    setLoading(true);
    const fetchData = async () => {
      try {
        await selectCredential(selectedCredential.id);
      } catch (error) {
        console.error('Error selecting Credential: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const isDesktop = useMediaQuery('(min-width: 768px)');

  return (
    <>
      {user ? (
        <>
          <div className="content-modals">
            <CreateCredentialModal isOpen={isCreateCredentialModalOpen} onClose={closeCreateCredentialModal} />
          </div>
          <div className="content-wrapper">
            <div className="content-header">
              <h4>Credentials</h4>
              {selectedVault ? (
                <>
                  <button onClick={openCreateCredentialModal} className="add-credential-button">
                    New Credential
                    <Plus size={22} weight="bold" />
                  </button>
                </>
              ) : null}
            </div>
            <div className="content">
              {loading === true ? (
                <div className="skeleton">
                  <div className="skeleton-item" />
                  <div className="skeleton-item" />
                  <div className="skeleton-item" />
                </div>
              ) : (
                <>
                  {credentials && (
                    <div className="credential-list-wrapper">
                      <CredentialList
                        selectedCredential={selectedCredential}
                        onSelectCredential={handleCredentialSelect}
                      />
                    </div>
                  )}
                  <div className="credential-details-wrapper">
                    {selectedCredential ? (
                      isDesktop ? (
                        <CredentialDetails />
                      ) : (
                        <CredentialDetailsModal
                          isOpen={isCredentialDetailsModalOpen}
                          onClose={closeCredentialDetailsModal}
                        />
                      )
                    ) : null}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
