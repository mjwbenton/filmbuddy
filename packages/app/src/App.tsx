import { Brand } from './components/Brand';
import './styles/global.css';

export default function App() {
  return (
    <div className="stage">
      <div className="app">
        <header className="app-header">
          <Brand />
        </header>
        <div className="page" />
      </div>
    </div>
  );
}
