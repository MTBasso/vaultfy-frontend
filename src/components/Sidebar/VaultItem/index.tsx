import { DotsThree } from '@phosphor-icons/react';
import type { Vault } from '../../../types/Vault';
import './styles.sass';
import { type MouseEvent, useState } from 'react';
import { ModifyVaultModal } from '../../Modals/ModifyVaultModal';

interface VaultItemProps {
  vault: Vault;
  isSelected: boolean;
  onSelect(): void;
}

export function VaultItem({ vault, isSelected, onSelect }: VaultItemProps) {
  const [isModifyVaultModalOpen, setModifyVaultModalOpen] = useState(false);

  const openModifyVaultModal = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setModifyVaultModalOpen(true);
  };
  const closeModifyVaultModal = () => setModifyVaultModalOpen(false);

  return (
    <>
      <ModifyVaultModal isOpen={isModifyVaultModalOpen} onClose={closeModifyVaultModal} vault={vault} />
      <div className={`item-container ${isSelected ? 'selected' : ''} ${vault.color}`} onClick={onSelect}>
        <div className="item-content">
          <span className={`dot ${vault.color}`}> </span>
          <p>{vault.name}</p>
          <div className="three-dots">
            <button onClick={openModifyVaultModal}>
              <DotsThree weight="bold" size={22} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
