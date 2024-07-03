import { useData } from '../../../hooks/useData';
import type { Credential } from '../../../types/Credential';
import { CredentialItem } from '../CredentialItem';
import './styles.sass';

interface CredentialListProps {
  selectedCredential: Credential | null;
  onSelectCredential(credentialId: string): Promise<void>;
}

export function CredentialList({ selectedCredential, onSelectCredential }: CredentialListProps) {
  const { credentials } = useData();

  return (
    <div className="credential-list">
      {credentials ? (
        credentials?.map((credential) => (
          <CredentialItem
            key={credential.name}
            credential={credential}
            isSelected={selectedCredential?.id === credential.id}
            onSelect={() => onSelectCredential(credential.id)}
          />
        ))
      ) : (
        <p>There are no credentials in this vault</p>
      )}
    </div>
  );
}
