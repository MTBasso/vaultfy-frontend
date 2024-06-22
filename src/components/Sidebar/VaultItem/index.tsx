import type { Vault } from '../../../types/Vault';
import './styles.sass';

interface VaultItemProps {
  vault: Vault;
  isSelected: boolean;
  onSelect(): void;
}

export function VaultItem({ vault, isSelected, onSelect }: VaultItemProps) {
  return (
    <div
      className={`item-container ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}>
      <p>
        <span className="dot"> </span>
        {vault.name}
      </p>
    </div>
  );
}
