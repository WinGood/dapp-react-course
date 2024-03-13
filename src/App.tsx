import { TonConnectButton } from '@tonconnect/ui-react';
import { useState } from 'react';
import { toNano } from 'ton-core';
import './App.css';
import reactLogo from './assets/react.svg';
import { useAccountContract } from './hooks/useAccountContract';
import { useTonConnect } from './hooks/useTonConnect';
import viteLogo from '/vite.svg';

function App() {
  const [count, setCount] = useState(0);
  const { owner_address, balance, sendDeposit } = useAccountContract();
  const { connected } = useTonConnect();

  const balanceTon = (balance || 0) / 1000000000;

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <div className="card">
        <b>Contract Balance</b>
        <div className="Hint">{balanceTon} TON</div>
        <b>Our contract Owner</b>
        <div className="Hint">{owner_address?.toString().slice(0, 16) + '...'}</div>
      </div>
      <TonConnectButton />
      {connected && (
        <button
          onClick={() => {
            sendDeposit(toNano('0.02'));
          }}
        >
          Deposit
        </button>
      )}
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  );
}

export default App;
