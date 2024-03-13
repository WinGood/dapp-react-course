import { TonConnectUIProvider } from '@tonconnect/ui-react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const manifestURL = 'https://raw.githubusercontent.com/WinGood/dapp-react-course/main/public/manifest.json';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <TonConnectUIProvider manifestUrl={manifestURL}>
    <App />
  </TonConnectUIProvider>
);
