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
  const [loading, setLoading] = useState(false);

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
    const fetchData = async () => {
      setLoading(true);

      await fetchVaults();
      setLoading(false);
    };

    if (user) fetchData();
  }, [user]);

  function handleLogout() {
    logout();
    refreshContext();
  }

  return (
    <>
      <div className="sidebar-modals">
        <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} handleOpenRegisterModal={openRegisterModal} />
        <RegisterModal
          isOpen={isRegisterModalOpen}
          onClose={closeRegisterModal}
          handleOpenLoginModal={openLoginModal}
        />
      </div>
      <div className="sidebar-wrapper">
        <div className="logo-user">
          <Logo />
          <div className="user-buttons">
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
        {user ? (
          loading ? (
            <div className="skeleton">
              <h4>Vaults</h4>
              <div className="skeleton-item" />
              <div className="skeleton-item" />
            </div>
          ) : (
            <div className="vault-list-wrapper">{vaults && <VaultList vaults={vaults} />}</div>
          )
        ) : null}
      </div>
    </>
  );
}
