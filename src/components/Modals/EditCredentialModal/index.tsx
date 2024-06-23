import { X } from '@phosphor-icons/react';
import { type FormEvent, useEffect, useState } from 'react';
import { credentialService } from '../../../services/server.api';
import './styles.sass';
import { useData } from '../../../hooks/useData';

interface EditCredentialModalProps {
  isOpen: boolean;
  onClose(): void;
}

interface EditCredentialServiceProps {
  name?: string;
  website?: string;
  login?: string;
  password?: string;
}

export function EditCredentialModal({
  isOpen,
  onClose,
}: EditCredentialModalProps) {
  const {
    selectedVault,
    selectedCredential,
    selectCredential,
    refreshContext,
    fetchCredentials,
  } = useData();

  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedCredential) {
      setName(selectedCredential.name);
      setWebsite(selectedCredential.website);
      setLogin(selectedCredential.login);
      setPassword(selectedCredential.password);
    }
  }, [selectedCredential]);

  const handleEditCredential = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    const data: EditCredentialServiceProps = {};

    if (selectedCredential!.name !== name) data.name = name;
    if (selectedCredential!.website !== website) data.website = website;
    if (selectedCredential!.login !== login) data.login = login;
    if (selectedCredential!.password !== password) data.password = password;

    try {
      const response = await credentialService.editCredential(
        selectedCredential!.id,
        data.name,
        data.website,
        data.login,
        data.password,
      );
      console.log('Edit Credential: ', response.data);
      refreshContext();
      fetchCredentials(selectedVault!.id);
      selectCredential(null);
      onClose();
    } catch (error) {
      console.error('Edit Credential failed: ', error);
      setError('Edit Credential failed.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Credential</h2>
          <X
            className="modal-close"
            size={22}
            weight="bold"
            onClick={onClose}
          />
        </div>
        <form onSubmit={handleEditCredential}>
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
          <button type="submit">Edit Credential</button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}
