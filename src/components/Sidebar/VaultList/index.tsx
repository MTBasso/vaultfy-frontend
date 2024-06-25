import { Plus } from '@phosphor-icons/react';
import { useData } from '../../../hooks/useData';
import type { Vault } from '../../../types/Vault';
import { VaultItem } from '../VaultItem';
import './styles.sass';
import { useState } from 'react';
import { CreateVaultModal } from '../../Modals/CreateVaultModal';

interface VaultListProps {
  vaults: Vault[];
}

export function VaultList({ vaults }: VaultListProps) {
  const { fetchCredentials, selectedVault, selectVault } = useData();
  const [isCreateVaultModalOpen, setCreateVaultModalOpen] = useState(false);

  const openCreateVaultModal = () => {
    setCreateVaultModalOpen(true);
  };
  const closeCreateVaultModal = () => setCreateVaultModalOpen(false);

  const handleVaultSelect = (vault: Vault) => {
    selectVault(vault);
    fetchCredentials(vault.id);
  };

  return (
    <div className="vault-list-container">
      <CreateVaultModal
        isOpen={isCreateVaultModalOpen}
        onClose={closeCreateVaultModal}
      />
      <div className="vault-list-title">
        <h4>Vaults</h4>
      </div>
      <div className="bottom-half">
        <div className="vault-list">
          {vaults.length > 0 ? (
            vaults.map((vault) => (
              <VaultItem
                key={vault.name}
                vault={vault}
                isSelected={vault === selectedVault}
                onSelect={() => handleVaultSelect(vault)}
              />
            ))
          ) : (
            <p>No vaults.</p>
          )}
        </div>
        <div className="new-vault-button">
          <button onClick={openCreateVaultModal}>
            New Vault <Plus size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
