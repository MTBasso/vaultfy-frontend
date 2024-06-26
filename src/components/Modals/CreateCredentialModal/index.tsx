import { X } from '@phosphor-icons/react';
import { type FormEvent, useState } from 'react';
import './styles.sass';
import { BadRequestError, isCustomError } from '../../../errors';
import { useData } from '../../../hooks/useData';
import { credentialService } from '../../../services/credential.service';

interface CreateCredentialModalProps {
  isOpen: boolean;
  onClose(): void;
}

export function CreateCredentialModal({ isOpen, onClose }: CreateCredentialModalProps) {
  const { selectedVault, refreshContext, fetchCredentials } = useData();

  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleCreateCredential = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      if (!selectedVault) throw new BadRequestError("There's no selected vault");
      await credentialService.createCredential(selectedVault.id, name, website, login, password);

      onClose();
      setName('');
      setWebsite('');
      setLogin('');
      setPassword('');
      refreshContext();
      fetchCredentials(selectedVault.id);
    } catch (error) {
      if (isCustomError(error)) setError(error.message);
      setError('Create Credential failed.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create Credential</h2>
          <X className="modal-close" size={22} weight="bold" onClick={onClose} />
        </div>
        <form onSubmit={handleCreateCredential}>
          <div>
            <label htmlFor="name">
              Name:
              <input
                type="name"
                id="name"
                placeholder="Vault name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label htmlFor="website">
              Website:
              <input
                type="website"
                id="website"
                placeholder="www.website.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label htmlFor="login">
              Login:
              <input
                type="login"
                id="login"
                placeholder="www.website.com"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label htmlFor="password">
              Password:
              <input
                type="password"
                id="password"
                placeholder="www.website.com"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit">Create Credential</button>
        </form>
      </div>
    </div>
  );
}
