import { Brand } from './components/Brand';
import { AppStateProvider } from './state';
import { NavProvider, useNav } from './nav/context';
import { ToastProvider } from './ui';
import { Home } from './screens/Home';
import { SheetRoot } from './sheets/SheetRoot';
import './styles/global.css';

function Screens() {
  const { screen } = useNav();
  if (screen.name === 'home') return <Home />;
  // Camera detail screen lands in Commit 8.
  return <Home />;
}

export default function App() {
  return (
    <AppStateProvider>
      <ToastProvider>
        <NavProvider>
          <div className="stage">
            <div className="app">
              <header className="app-header">
                <Brand />
              </header>
              <Screens />
            </div>
          </div>
          <SheetRoot />
        </NavProvider>
      </ToastProvider>
    </AppStateProvider>
  );
}
