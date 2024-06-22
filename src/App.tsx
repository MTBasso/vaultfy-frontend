import { ContentWrapper } from './components/ContentWrapper';
import { Sidebar } from './components/Sidebar';
import './styles/default.sass';

export function App() {
  return (
    <div className="app-wrapper">
      <Sidebar />
      <ContentWrapper />
    </div>
  );
}
