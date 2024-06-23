import { X } from '@phosphor-icons/react';
import { type FormEvent, useState } from 'react';
import { credentialService } from '../../../services/server.api';
import './styles.sass';
import { useData } from '../../../hooks/useData';

interface DeleteCredentialModalProps {
  isOpen: boolean;
  onClose(): void;
}

export function DeleteCredentialModal({
  isOpen,
  onClose,
}: DeleteCredentialModalProps) {
  const [error, setError] = useState<string | null>(null);
  const {
    selectedVault,
    selectedCredential,
    selectCredential,
    refreshContext,
    fetchCredentials,
  } = useData();

  const handleDeleteCredential = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      const response = await credentialService.deleteCredential(
        selectedCredential!.id,
      );
      console.log('Delete Credential: ', response.data);
      refreshContext();
      fetchCredentials(selectedVault!.id);
      selectCredential(null);
      onClose();
    } catch (error) {
      console.error('Delete Credential failed: ', error);
      setError('Delete Credential failed.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Delete Credential</h2>
          <X
            className="modal-close"
            size={22}
            weight="bold"
            onClick={onClose}
          />
        </div>
        <p className="confirmation-prompt">
          Do you want to delete this credential?
        </p>
        <div className="buttons">
          <button
            className="delete-button"
            onClick={handleDeleteCredential}
            type="submit">
            Delete
          </button>
          <button onClick={onClose} type="submit">
            Cancel
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}
