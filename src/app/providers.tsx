'use client';

import { ThemeProvider } from 'next-themes';
import { WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { WALLET_ADAPTERS, RPC_ENDPOINT } from '@/config/wallet';
import { useMemo } from 'react';
import { ConnectionProvider } from '@solana/wallet-adapter-react';

require('@solana/wallet-adapter-react-ui/styles.css');

export function Providers({ children }: { children: React.ReactNode }) {
  const wallets = useMemo(() => WALLET_ADAPTERS.map(Adapter => new Adapter()), []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ConnectionProvider endpoint={RPC_ENDPOINT}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            {children}
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ThemeProvider>
  );
}
