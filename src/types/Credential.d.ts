export interface Credential {
  id: string;
  name: string;
  website: string;
  login: string;
  decryptedPassword?: string;
  password?: string;
  vaultId: string;
}
