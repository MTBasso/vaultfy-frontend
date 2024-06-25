import { X } from '@phosphor-icons/react';
import { type FormEvent, useState } from 'react';
import { userService } from '../../../services/server.api';
import './styles.sass';
import { isCustomError } from '../../../errors';
import { useData } from '../../../hooks/useData';

interface RegisterModalProps {
  isOpen: boolean;
  onClose(): void;
  handleOpenLoginModal(): void;
}

export function RegisterModal({
  isOpen,
  onClose,
  handleOpenLoginModal,
}: RegisterModalProps) {
  const { refreshContext } = useData();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      await userService.registerUser(username, email, password);

      onClose();
      refreshContext();
    } catch (error) {
      if (isCustomError(error)) setError(error.message);
      setError('Unhandled server error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Register</h2>
          <X
            className="modal-close"
            size={22}
            weight="bold"
            onClick={onClose}
          />
        </div>
        <form onSubmit={handleRegister}>
          <div>
            <label htmlFor="username">
              Username:
              <input
                type="username"
                id="username"
                placeholder="johnDoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label htmlFor="email">
              Email:
              <input
                type="email"
                id="email"
                placeholder="johnDoe@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                placeholder="•••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit">Register</button>
        </form>
        <p className="register">Already have an account?</p>
        <button onClick={handleOpenLoginModal}>Log In</button>
      </div>
    </div>
  );
}
