import { Copy, Eye, NotePencil, Trash, X } from '@phosphor-icons/react';
import { useState } from 'react';
import { useData } from '../../../hooks/useData';
import './styles.sass';
import { CredentialIcon } from '../../ContentWrapper/CredentialIcon';
import { DeleteCredentialModal } from '../DeleteCredentialModal';
import { EditCredentialModal } from '../EditCredentialModal';

interface CredentialDetailsModalProps {
  isOpen: boolean;
  onClose(): void;
}

export function CredentialDetailsModal({ isOpen, onClose }: CredentialDetailsModalProps) {
  const { selectedVault, selectedCredential, selectCredential, fetchCredentials } = useData();

  const [isEditCredentialModalOpen, setEditCredentialModalOpen] = useState(false);
  const [isDeleteCredentialModalOpen, setDeleteCredentialModalOpen] = useState(false);
  const [exposedPassword, setExposedPassword] = useState(false);

  const openEditCredentialModal = () => setEditCredentialModalOpen(true);
  const closeEditCredentialModal = () => setEditCredentialModalOpen(false);
  const openDeleteCredentialModal = () => setDeleteCredentialModalOpen(true);
  const closeDeleteCredentialModal = () => setDeleteCredentialModalOpen(false);

  async function handleAfterDelete() {
    selectCredential('');
    await fetchCredentials(selectedVault!.id);
    closeDeleteCredentialModal();
    onClose();
  }

  async function handleClose() {
    selectCredential('');
    onClose();
  }

  function handleExposePassword() {
    setExposedPassword((state) => !state);
  }

  function handleIconLoad() {
    return null;
  }

  if (!isOpen) return null;
  if (!selectedCredential) return null;

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
      <div className="credential-details-modal-overlay ">
        <div className="credential-details-modal-content">
          <div className="modal-header">
            <h2>Credential Details</h2>
            <X className="modal-close" size={22} weight="bold" onClick={handleClose} />
          </div>
          <div className="details-modal-info">
            <div className="icon-name-vault">
              <CredentialIcon name={selectedCredential.name} onLoad={handleIconLoad} />
              <div className="name-and-vault">
                <h4>{selectedCredential.name}</h4>
                <span className={`${selectedVault?.color}`}>{selectedVault?.name}</span>
              </div>
            </div>
            <div className="details-controllers">
              <button onClick={openEditCredentialModal}>
                <NotePencil size={22} />
              </button>
              <button onClick={openDeleteCredentialModal} className="delete">
                <Trash size={22} />
              </button>
            </div>
          </div>
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
      </div>
    </>
  );
}
