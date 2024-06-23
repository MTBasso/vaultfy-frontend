import { useData } from '../../../hooks/useData';
import type { Credential } from '../../../types/Credential';
import { CredentialItem } from '../CredentialItem';
import './styles.sass';

interface CredentialListProps {
  selectedCredential: Credential | null;
  onSelectCredential(credential: Credential): void;
}

export function CredentialList({
  selectedCredential,
  onSelectCredential,
}: CredentialListProps) {
  const { credentials } = useData()

  return (
    <>
      <div className="credential-list-container">
        {credentials ? (
          credentials.map((credential) => (
            <CredentialItem
              key={credential.id}
              credential={credential}
              isSelected={selectedCredential?.id === credential.id}
              onSelect={() => onSelectCredential(credential)}
            />
          ))
        ) : (
          <p>There are no credentials in this vault</p>
        )}
      </div>
    </>
  );
}
