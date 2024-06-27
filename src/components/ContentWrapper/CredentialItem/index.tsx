import { memo } from 'react';
import type { Credential } from '../../../types/Credential';
import './styles.sass';

interface CredentialItemProps {
  credential: Credential;
  isSelected: boolean;
  onSelect(): void;
}

export const CredentialItem = memo(({ credential, isSelected, onSelect }: CredentialItemProps) => {
  return (
    <div className="wrapper2">
      <div onClick={onSelect} className="credential-item-wrapper">
        <div className={`credential-item ${isSelected ? 'selected' : ''}`}>
          <h4>{credential.name}</h4>
          <p>{credential.login}</p>
        </div>
      </div>
    </div>
  );
});
