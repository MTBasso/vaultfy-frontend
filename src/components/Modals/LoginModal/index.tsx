import { X } from '@phosphor-icons/react';
import { type FormEvent, useState } from 'react';
import { userService } from '../../../services/server.api';
import './styles.sass';
import { isCustomError } from '../../../errors';
import { useData } from '../../../hooks/useData';

interface LoginModalProps {
  isOpen: boolean;
  onClose(): void;
  handleOpenRegisterModal(): void;
}

export function LoginModal({
  isOpen,
  onClose,
  handleOpenRegisterModal,
}: LoginModalProps) {
  const { refreshContext } = useData();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      await userService.loginUser(email, password);

      onClose();
      refreshContext();
    } catch (error) {
      if (isCustomError(error)) setError(error.message);
      setError('Login Failed. Please check your credentials.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Login</h2>
          <X
            className="modal-close"
            size={22}
            weight="bold"
            onClick={onClose}
          />
        </div>
        <form onSubmit={handleLogin}>
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
          <button type="submit">Login</button>
        </form>
        <p className="register">Don't have an account yet?</p>
        <button onClick={handleOpenRegisterModal}>Sign Up</button>
      </div>
    </div>
  );
}
