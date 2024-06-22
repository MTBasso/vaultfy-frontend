import { Copy, Eye, NotePencil, Star, Trash } from '@phosphor-icons/react';
import type { Credential } from '../../../../types/Credential';
import { CredentialIcon } from '../../CredentialIcon';
import './styles.sass';

interface CredentialDetailsProps {
  credential: Credential;
}

export function CredentialDetails({ credential }: CredentialDetailsProps) {
  return (
    <>
      <div className="credential-details-container">
        <header className="credential-header">
          <div className="info">
            <CredentialIcon name={credential.name} />
            <div className="name-and-vault">
              <h4>{credential.name}</h4>
              <span>Games</span>
            </div>
          </div>
          <div className="controllers">
            <button>
              <Star size={22} />
            </button>
            <button>
              <NotePencil size={22} />
            </button>
            <button className="delete">
              <Trash size={22} />
            </button>
          </div>
        </header>
        <div className="credential-details">
          <div className="website">
            <span>Website</span>
            <p>{credential.website}</p>
          </div>
          <div className="username">
            <span>Username</span>
            <p>{credential.login}</p>
          </div>
          <div className="password">
            <div className="text">
              <span>Password</span>
              <p>***********</p>
            </div>
            <div className="buttons">
              <button>
                <Eye size={22} />
              </button>
              <button>
                <Copy size={22} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
