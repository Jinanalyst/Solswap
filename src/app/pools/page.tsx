'use client';

import { useState } from 'react';
import { PoolList } from '@/components/PoolList';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

export default function PoolsPage() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <main className="container mx-auto min-h-screen px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Liquidity Pools</h1>
        <p className="text-muted-foreground">
          Provide liquidity to earn trading fees and farming rewards
        </p>
      </div>

      <Card className="overflow-hidden">
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <div className="border-b border-border px-6 pt-4">
            <TabsList className="mb-[-1px]">
              <TabsTrigger value="all" className="relative px-6 pb-4">
                All Pools
              </TabsTrigger>
              <TabsTrigger value="your" className="relative px-6 pb-4">
                Your Liquidity
              </TabsTrigger>
              <TabsTrigger value="watchlist" className="relative px-6 pb-4">
                Watchlist
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="p-6">
            <PoolList />
          </TabsContent>

          <TabsContent value="your" className="p-6">
            <PoolList showMyPools={true} />
          </TabsContent>

          <TabsContent value="watchlist" className="p-6">
            <PoolList showFavorites={true} />
          </TabsContent>
        </Tabs>
      </Card>

      {/* Analytics Section */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="p-6">
          <h3 className="mb-2 text-lg font-medium">Total Value Locked</h3>
          <p className="text-2xl font-bold">$123.45M</p>
          <p className="text-sm text-green-500">+5.67% (24h)</p>
        </Card>

        <Card className="p-6">
          <h3 className="mb-2 text-lg font-medium">24h Trading Volume</h3>
          <p className="text-2xl font-bold">$45.67M</p>
          <p className="text-sm text-red-500">-2.34% (24h)</p>
        </Card>

        <Card className="p-6">
          <h3 className="mb-2 text-lg font-medium">Total Fees (24h)</h3>
          <p className="text-2xl font-bold">$234.56K</p>
          <p className="text-sm text-green-500">+3.45% (24h)</p>
        </Card>
      </div>
    </main>
  );
}
