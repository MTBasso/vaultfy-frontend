import { Copy, Eye, NotePencil, Trash } from '@phosphor-icons/react';
import { useData } from '../../../../hooks/useData';
import { CredentialIcon } from '../../CredentialIcon';
import './styles.sass';
import { useEffect, useState } from 'react';
import { DeleteCredentialModal } from '../../../Modals/DeleteCredentialModal';
import { EditCredentialModal } from '../../../Modals/EditCredentialModal';

export function CredentialDetails() {
  const { selectedCredential, selectCredential, fetchCredentials, selectedVault } = useData();

  const [exposedPassword, setExposedPassword] = useState(false);
  const [iconLoaded, setIconLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditCredentialModalOpen, setEditCredentialModalOpen] = useState(false);
  const [isDeleteCredentialModalOpen, setDeleteCredentialModalOpen] = useState(false);

  const openEditCredentialModal = () => setEditCredentialModalOpen(true);
  const closeEditCredentialModal = () => setEditCredentialModalOpen(false);
  const openDeleteCredentialModal = () => setDeleteCredentialModalOpen(true);
  const closeDeleteCredentialModal = () => setDeleteCredentialModalOpen(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedCredential) return;
      setLoading(true);
      await selectCredential(selectedCredential.id);

      setLoading(false);
      setIconLoaded(true);
    };

    fetchData();
  }, [selectedCredential?.id, selectCredential?.name]);

  const handleIconLoad = () => {
    setIconLoaded(true);
  };

  const handleAfterDelete = async () => {
    selectCredential('');
    await fetchCredentials(selectedVault!.id);
    closeDeleteCredentialModal();
  };

  function handleExposePassword() {
    setExposedPassword((state) => !state);
  }

  if (selectedCredential === null) return null;

  return (
    <>
      <div className="credential-details-modals">
        <DeleteCredentialModal
          isOpen={isDeleteCredentialModalOpen}
          onClose={closeDeleteCredentialModal}
          onAfterDelete={handleAfterDelete}
        />
        <EditCredentialModal isOpen={isEditCredentialModalOpen} onClose={closeEditCredentialModal} />
      </div>
      {loading || !iconLoaded ? (
        <div className="skeleton-loading">
          <div className="skeleton-rectangle" />
        </div>
      ) : (
        <div className="loaded-details">
          <header className="credential-header">
            <div className="info">
              <CredentialIcon name={selectedCredential.name} onLoad={handleIconLoad} />
              <div className="name-and-vault">
                <h4>{selectedCredential.name}</h4>
                <span className={`${selectedVault?.color}`}>{selectedVault?.name}</span>
              </div>
            </div>
            <div className="controllers">
              <button onClick={openEditCredentialModal}>
                <NotePencil size={22} />
              </button>
              <button onClick={openDeleteCredentialModal} className="delete">
                <Trash size={22} />
              </button>
            </div>
          </header>
          <div className="credential-details">
            <div className="website">
              <span>Website</span>
              <p>{selectedCredential.website}</p>
            </div>
            <div className="username">
              <span>Username</span>
              <p>{selectedCredential.login}</p>
            </div>
            <div className="password">
              <div className="text">
                <span>Password</span>
                {exposedPassword ? <p>{selectedCredential.decryptedPassword}</p> : <p>•••••••••••</p>}
              </div>
              <div className="buttons">
                <button className={`${exposedPassword && 'exposed'}`} onClick={handleExposePassword}>
                  <Eye size={22} />
                </button>
                <button>
                  <Copy size={22} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
