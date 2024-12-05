'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

export function useTokenBalance(mintAddress: string) {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  return useQuery({
    queryKey: ['tokenBalance', mintAddress, publicKey?.toBase58()],
    queryFn: async () => {
      if (!publicKey || !mintAddress) return null;

      try {
        const mint = new PublicKey(mintAddress);
        const tokenAccounts = await connection.getTokenAccountsByOwner(publicKey, {
          programId: TOKEN_PROGRAM_ID,
        });

        const account = tokenAccounts.value.find((account) => {
          const accountMint = account.account.data.parsed.info.mint;
          return accountMint === mintAddress;
        });

        if (!account) return null;

        return {
          amount: account.account.data.parsed.info.tokenAmount.uiAmount,
          decimals: account.account.data.parsed.info.tokenAmount.decimals,
        };
      } catch (error) {
        console.error('Error fetching token balance:', error);
        return null;
      }
    },
    enabled: !!publicKey && !!mintAddress,
  });
}
