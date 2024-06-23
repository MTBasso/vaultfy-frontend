import { X } from '@phosphor-icons/react';
import { type FormEvent, useState } from 'react';
import { credentialService } from '../../../services/server.api';
import './styles.sass';
import { useData } from '../../../hooks/useData';

interface CreateCredentialModalProps {
  isOpen: boolean;
  onClose(): void;
}

export function CreateCredentialModal({
  isOpen,
  onClose,
}: CreateCredentialModalProps) {
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { selectedVault, refreshContext, fetchCredentials } = useData();

  const handleCreateCredential = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      const response = await credentialService.createCredential(
        selectedVault!.id,
        name,
        website,
        login,
        password,
      );
      console.log('Create Credential: ', response.data);
      onClose();
      setName('');
      setWebsite('');
      setLogin('');
      setPassword('');
      refreshContext();
      fetchCredentials(selectedVault!.id);
    } catch (error) {
      console.error('Create Credential failed: ', error);
      setError('Create Credential failed.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create Credential</h2>
          <X
            className="modal-close"
            size={22}
            weight="bold"
            onClick={onClose}
          />
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
