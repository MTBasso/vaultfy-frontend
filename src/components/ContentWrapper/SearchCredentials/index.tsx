import { MagnifyingGlass } from '@phosphor-icons/react';
import './styles.sass';

export function SearchCredentials() {
  return (
    <div className="input-wrapper">
      <MagnifyingGlass size={22} />
      <input
        placeholder="Search Credentials"
        className="search-input"
        type="text"
      />
    </div>
  );
}
