import { X } from '@phosphor-icons/react';
import { type FormEvent, useState } from 'react';
import './styles.sass';
import { isCustomError } from '../../../errors';
import { useData } from '../../../hooks/useData';
import { vaultService } from '../../../services/vault.service';

interface CreateVaultModalProps {
  isOpen: boolean;
  onClose(): void;
}

export function CreateVaultModal({ isOpen, onClose }: CreateVaultModalProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { refreshContext } = useData();

  const handleCreateVault = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      await vaultService.createVault(name, color);

      refreshContext();
      onClose();
      setName('');
      setColor('');
    } catch (error) {
      if (isCustomError(error)) setError(error.message);
      setError('Create vault failed.');
    }
  };

  const colors = [
    { name: 'red', hex: '#dc2626' },
    { name: 'orange', hex: '#ea580c' },
    { name: 'amber', hex: '#d97706' },
    { name: 'yellow', hex: '#ca8a04' },
    { name: 'lime', hex: '#65a30d' },
    { name: 'green', hex: '#16a34a' },
    { name: 'emerald', hex: '#059669' },
    { name: 'teal', hex: '#0d9488' },
    { name: 'cyan', hex: '#0891b2' },
    { name: 'sky', hex: '#0284c7' },
    { name: 'blue', hex: '#2563eb' },
    { name: 'indigo', hex: '#4f46e5' },
    { name: 'violet', hex: '#7c3aed' },
    { name: 'purple', hex: '#9333ea' },
    { name: 'fuchsia', hex: '#c026d3' },
    { name: 'pink', hex: '#db2777' },
    { name: 'rose', hex: '#e11d48' },
  ];

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create Vault</h2>
          <X className="modal-close" size={22} weight="bold" onClick={onClose} />
        </div>
        <form onSubmit={handleCreateVault}>
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
          <div className="color-options">
            <label>Colors:</label>
            <div className="colors">
              {colors.map((colorOption) => (
                <label key={colorOption.hex} className="color-label">
                  <input
                    type="radio"
                    name="color"
                    value={colorOption.name}
                    checked={color === colorOption.name}
                    onChange={(e) => setColor(e.target.value)}
                    required
                  />
                  <span className="color-swatch" style={{ backgroundColor: colorOption.hex }} />
                </label>
              ))}
            </div>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit">Create Vault</button>
        </form>
      </div>
    </div>
  );
}
