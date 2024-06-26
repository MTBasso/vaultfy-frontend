import { SignOut, User } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { Logo } from '../../assets/Logo/Logo';
import { useData } from '../../hooks/useData';
import { VaultList } from './VaultList';
import './styles.sass';
import { LoginModal } from '../Modals/LoginModal';
import { RegisterModal } from '../Modals/RegisterModal';

export function Sidebar() {
  const { user, vaults, fetchVaults, logout, refreshContext } = useData();

  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);

  const openLoginModal = () => {
    closeRegisterModal();
    setLoginModalOpen(true);
  };
  const closeLoginModal = () => setLoginModalOpen(false);

  const openRegisterModal = () => {
    closeLoginModal();
    setRegisterModalOpen(true);
  };
  const closeRegisterModal = () => setRegisterModalOpen(false);

  useEffect(() => {
    fetchVaults();
  }, []);

  function handleLogout() {
    logout();
    refreshContext();
  }

  return (
    <>
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} handleOpenRegisterModal={openRegisterModal} />
      <RegisterModal isOpen={isRegisterModalOpen} onClose={closeRegisterModal} handleOpenLoginModal={openLoginModal} />
      <div className="wrapper">
        <div className="top-half">
          <div className="logo-user">
            <Logo />
            {!user ? (
              <button onClick={openLoginModal}>
                <User size={22} />
              </button>
            ) : (
              <button className="sign-out-button" onClick={handleLogout}>
                <SignOut size={22} />
              </button>
            )}
          </div>
        </div>
        <div className="bottom-half">
          <div className="vault-list">{vaults && <VaultList vaults={vaults} />}</div>
        </div>
      </div>
    </>
  );
}
