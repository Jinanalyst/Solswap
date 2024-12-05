'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export function TokenSwap() {
  const { connected } = useWallet();
  const [amount, setAmount] = useState('');

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Swap Tokens</h2>
      
      <div className="rounded-lg bg-card/50 p-4">
        <label className="mb-2 block text-sm font-medium">From</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full rounded bg-background px-3 py-2"
          />
          <button className="rounded bg-primary px-3 py-2 font-medium text-primary-foreground">
            SOL
          </button>
        </div>
      </div>

      <button className="mx-auto rounded-full bg-card/50 p-2">
        ↓
      </button>

      <div className="rounded-lg bg-card/50 p-4">
        <label className="mb-2 block text-sm font-medium">To</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={(Number(amount) * 20).toString()}
            readOnly
            placeholder="0.00"
            className="w-full rounded bg-background px-3 py-2"
          />
          <button className="rounded bg-primary px-3 py-2 font-medium text-primary-foreground">
            USDC
          </button>
        </div>
      </div>

      {connected ? (
        <button className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90">
          Swap
        </button>
      ) : (
        <WalletMultiButton className="rounded-lg" />
      )}
    </div>
  );
}
