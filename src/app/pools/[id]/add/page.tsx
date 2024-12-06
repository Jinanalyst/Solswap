'use client';

import { AddLiquidity } from '@/components/AddLiquidity';

// Mock data - replace with actual data fetching
const mockPoolData = {
  'sol-usdc': {
    poolId: 'sol-usdc',
    token1: {
      symbol: 'SOL',
      icon: '/icons/sol.png',
      balance: '12.345',
    },
    token2: {
      symbol: 'USDC',
      icon: '/icons/usdc.png',
      balance: '1,234.56',
    },
    exchangeRate: '22.45',
    poolShare: '0.05',
  },
  'ray-usdc': {
    poolId: 'ray-usdc',
    token1: {
      symbol: 'RAY',
      icon: '/icons/ray.png',
      balance: '145.67',
    },
    token2: {
      symbol: 'USDC',
      icon: '/icons/usdc.png',
      balance: '1,234.56',
    },
    exchangeRate: '1.23',
    poolShare: '0.12',
  },
};

export default function AddLiquidityPage({ params }: { params: { id: string } }) {
  const poolData = mockPoolData[params.id as keyof typeof mockPoolData];

  if (!poolData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg border border-border p-8 text-center">
          <h2 className="text-xl font-medium">Pool Not Found</h2>
          <p className="mt-2 text-muted-foreground">
            The pool you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto min-h-screen px-4 py-8">
      <AddLiquidity {...poolData} />
    </main>
  );
}
