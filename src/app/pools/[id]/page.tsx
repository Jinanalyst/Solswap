'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LineChart, ArrowUpRight, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// Mock data - replace with actual data fetching
const mockPoolData = {
  'sol-usdc': {
    name: 'SOL-USDC',
    token1: {
      symbol: 'SOL',
      icon: '/icons/sol.png',
      price: '$22.45',
      priceChange: '+2.34%',
    },
    token2: {
      symbol: 'USDC',
      icon: '/icons/usdc.png',
      price: '$1.00',
      priceChange: '0.00%',
    },
    stats: {
      tvl: '$12.5M',
      volume24h: '$1.2M',
      fees24h: '$3.6K',
      apr: '24.5%',
    },
    myLiquidity: {
      poolTokens: '123.45',
      value: '$2,345.67',
      share: '0.05%',
      token1Amount: '10.5 SOL',
      token2Amount: '235.67 USDC',
    },
  },
};

export default function PoolDetailsPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('overview');
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
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Link
              href="/pools"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Pools
            </Link>
            <span className="text-sm text-muted-foreground">/</span>
            <span className="text-sm">{poolData.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative h-10 w-16">
              <img
                src={poolData.token1.icon}
                alt={poolData.token1.symbol}
                className="absolute left-0 top-0 h-8 w-8 rounded-full"
              />
              <img
                src={poolData.token2.icon}
                alt={poolData.token2.symbol}
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{poolData.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <span>{poolData.token1.price}</span>
                  <span className="text-sm text-green-500">
                    {poolData.token1.priceChange}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span>{poolData.token2.price}</span>
                  <span className="text-sm text-muted-foreground">
                    {poolData.token2.priceChange}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/trade?pool=${params.id}`}
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            <LineChart className="h-4 w-4" />
            Trade
          </Link>
          <Link
            href={`/pools/${params.id}/add`}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add Liquidity
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card className="p-6">
          <h3 className="text-sm text-muted-foreground">TVL</h3>
          <p className="mt-1 text-2xl font-bold">{poolData.stats.tvl}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm text-muted-foreground">24h Volume</h3>
          <p className="mt-1 text-2xl font-bold">{poolData.stats.volume24h}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm text-muted-foreground">24h Fees</h3>
          <p className="mt-1 text-2xl font-bold">{poolData.stats.fees24h}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm text-muted-foreground">APR</h3>
          <p className="mt-1 text-2xl font-bold text-green-500">
            {poolData.stats.apr}
          </p>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="overflow-hidden">
        <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
          <div className="border-b border-border px-6 pt-4">
            <TabsList className="mb-[-1px]">
              <TabsTrigger value="overview" className="relative px-6 pb-4">
                Overview
              </TabsTrigger>
              <TabsTrigger value="myLiquidity" className="relative px-6 pb-4">
                My Liquidity
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="p-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Price Chart will go here */}
              <Card className="aspect-[4/3] p-6">
                <h3 className="mb-4 font-medium">Price Chart</h3>
                {/* Add TradingView chart component here */}
              </Card>

              {/* Transactions will go here */}
              <Card className="aspect-[4/3] p-6">
                <h3 className="mb-4 font-medium">Recent Transactions</h3>
                {/* Add transactions list component here */}
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="myLiquidity" className="space-y-6 p-6">
            <Card className="p-6">
              <h3 className="mb-4 font-medium">Your Liquidity Position</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Pool Tokens</span>
                  <span>{poolData.myLiquidity.poolTokens}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Value</span>
                  <span>{poolData.myLiquidity.value}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Pool Share</span>
                  <span>{poolData.myLiquidity.share}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Token Amounts</span>
                  <div className="text-right">
                    <div>{poolData.myLiquidity.token1Amount}</div>
                    <div>{poolData.myLiquidity.token2Amount}</div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex gap-3">
              <Link
                href={`/pools/${params.id}/remove`}
                className="flex-1 rounded-lg border border-border py-3 text-center font-medium hover:bg-muted"
              >
                Remove Liquidity
              </Link>
              <Link
                href={`/pools/${params.id}/add`}
                className="flex-1 rounded-lg bg-primary py-3 text-center font-medium text-white hover:bg-primary/90"
              >
                Add Liquidity
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </main>
  );
}
