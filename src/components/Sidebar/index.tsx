import { Plus } from '@phosphor-icons/react';
import { Logo } from '../../assets/Logo/Logo';
import './styles.sass';
import { VaultList } from './VaultList';

export function Sidebar() {
  const vaults = [
    {
      id: '1',
      name: 'Games',
      website: 'www.test.com',
      login: 'username',
      password: 'testPass',
    },
    {
      id: '2',
      name: 'Work',
      website: 'www.test2.com',
      login: 'username',
      password: 'testPass',
    },
  ];

  return (
    <>
      <div className="wrapper">
        <div className="top-half">
          <Logo />
          <VaultList vaults={vaults} />
        </div>
        <div className="new-vault-button">
          <button>
            New Vault <Plus size={24} />
          </button>
        </div>
      </div>
    </>
  );
}
