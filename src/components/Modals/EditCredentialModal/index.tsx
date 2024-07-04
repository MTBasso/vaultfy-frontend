import { X } from '@phosphor-icons/react';
import { type FormEvent, useEffect, useState } from 'react';
import './styles.sass';
import { BadRequestError, isCustomError } from '../../../errors';
import { useData } from '../../../hooks/useData';

interface EditCredentialModalProps {
  isOpen: boolean;
  onClose(): void;
}

interface EditCredentialServiceProps {
  id: string;
  name?: string;
  website?: string;
  login?: string;
  password?: string;
}

export function EditCredentialModal({ isOpen, onClose }: EditCredentialModalProps) {
  const { selectedVault, selectedCredential, updateCredential, refreshContext } = useData();

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
      setPassword(selectedCredential.decryptedPassword!);
    }
  }, [selectedCredential]);

  const handleEditCredential = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      if (!selectedVault) throw new BadRequestError("There's no selected vault");
      if (!selectedCredential) throw new BadRequestError("There's no selected credential");

      const data: EditCredentialServiceProps = {
        id: selectedCredential.id,
      };

      if (selectedCredential.name !== name) data.name = name;
      if (selectedCredential.website !== website) data.website = website;
      if (selectedCredential.login !== login) data.login = login;
      if (selectedCredential.decryptedPassword !== password) data.password = password;

      await updateCredential(data);
      refreshContext();
      onClose();
    } catch (error) {
      if (isCustomError(error)) setError(error.message);
      setError('Edit Credential failed.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Credential</h2>
          <X className="modal-close" size={22} weight="bold" onClick={onClose} />
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
