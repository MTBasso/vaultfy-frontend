import { CaretDown } from '@phosphor-icons/react';
import type { Vault } from '../../../types/Vault';
import './styles.sass';
import { useState } from 'react';
import { VaultItem } from '../VaultItem';

interface VaultListProps {
  vaults: Vault[];
}

export function VaultList({ vaults }: VaultListProps) {
  const [selectedVault, setSelectedVault] = useState<Vault | null>(vaults[0]);

  const handleVaultSelect = (vault: Vault) => {
    setSelectedVault(vault);
  };

  return (
    <nav className="vault-list-container">
      <div className="vault-list-title">
        <CaretDown size={24} weight="regular" />
        <h4>Vaults</h4>
      </div>
      {vaults.length > 0 ? (
        vaults.map((vault) => (
          <VaultItem
            key={vault.id}
            vault={vault}
            isSelected={vault === selectedVault}
            onSelect={() => handleVaultSelect(vault)}
          />
        ))
      ) : (
        <p>No vaults.</p>
      )}
    </nav>
  );
}
