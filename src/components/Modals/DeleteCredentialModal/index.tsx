import { X } from '@phosphor-icons/react';
import { type FormEvent, useState } from 'react';
import './styles.sass';
import { BadRequestError, isCustomError } from '../../../errors';
import { useData } from '../../../hooks/useData';

interface DeleteCredentialModalProps {
  isOpen: boolean;
  onClose(): void;
  onAfterDelete(): void;
}

export function DeleteCredentialModal({ isOpen, onClose, onAfterDelete }: DeleteCredentialModalProps) {
  const [error, setError] = useState<string | null>(null);
  const { selectedVault, selectedCredential, refreshContext, deleteCredential } = useData();

  const handleDeleteCredential = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      if (!selectedCredential) throw new BadRequestError("There's no selected credential");
      if (!selectedVault) throw new BadRequestError("There's no selected vault");

      await deleteCredential(selectedCredential.id);
      refreshContext();
      onAfterDelete();
    } catch (error) {
      if (isCustomError(error)) setError(error.message);
      setError('Delete Credential failed.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Delete Credential</h2>
          <X className="modal-close" size={22} weight="bold" onClick={onClose} />
        </div>
        <p className="confirmation-prompt">Do you want to delete this credential?</p>
        <div className="buttons">
          <button className="delete-button" onClick={handleDeleteCredential} type="submit">
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
