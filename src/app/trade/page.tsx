'use client';

import { useEffect, useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { TradingView } from '@/components/TradingView';
import { TokenSwap } from '@/components/TokenSwap';
import { SwapForm } from '@/components/SwapForm';
import { DCAForm } from '@/components/DCAForm';
import { PositionsPanel } from '@/components/PositionsPanel';
import { TransactionHistory } from '@/components/TransactionHistory';
import { Orderbook } from '@/components/Orderbook';
import { fetchAllSolanaPairs } from '@/lib/api';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface TradingPair {
  label: string;
  value: string;
  price: string;
  change: string;
  volume: string;
  isPositive: boolean;
  liquidity: string;
  marketCap?: string;
  dexId: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceUsd: number;
}

type Tab = 'trade' | 'swap' | 'dca';
type BottomTab = 'positions' | 'transactions';

export default function TradePage() {
  const [pairs, setPairs] = useState<TradingPair[]>([]);
  const [selectedPair, setSelectedPair] = useState<TradingPair | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('trade');
  const [bottomTab, setBottomTab] = useState<BottomTab>('positions');
  const [isLoading, setIsLoading] = useState(true);
  const [isPairsOpen, setIsPairsOpen] = useState(true);

  useEffect(() => {
    const fetchPairs = async () => {
      try {
        if (!isLoading) setIsLoading(true);
        console.log('Starting to fetch pairs...');
        const pairsData = await fetchAllSolanaPairs();
        console.log('Received pairs data:', pairsData.length, 'pairs');
        
        if (pairsData.length === 0) {
          console.log('No pairs data received');
          return;
        }

        const formattedPairs = pairsData.map(pair => ({
          label: `${pair.symbol}/USDC`,
          value: pair.symbol,
          price: pair.price.toFixed(pair.price < 0.01 ? 8 : pair.price < 1 ? 4 : 2),
          change: `${pair.priceChange24h >= 0 ? '+' : ''}${pair.priceChange24h.toFixed(2)}%`,
          volume: pair.volume24h > 1000000 
            ? `$${(pair.volume24h / 1000000).toFixed(1)}M` 
            : `$${(pair.volume24h / 1000).toFixed(1)}K`,
          liquidity: pair.liquidity > 1000000 
            ? `$${(pair.liquidity / 1000000).toFixed(1)}M` 
            : `$${(pair.liquidity / 1000).toFixed(1)}K`,
          marketCap: pair.marketCap && pair.marketCap > 0 
            ? pair.marketCap > 1000000 
              ? `$${(pair.marketCap / 1000000).toFixed(1)}M` 
              : `$${(pair.marketCap / 1000).toFixed(1)}K`
            : undefined,
          isPositive: pair.priceChange24h >= 0,
          dexId: pair.dexId || '',
          pairAddress: pair.pairAddress || '',
          baseToken: {
            address: pair.baseToken?.address || '',
            name: pair.baseToken?.name || pair.symbol,
            symbol: pair.symbol
          },
          priceUsd: pair.price
        }));

        console.log('Formatted pairs:', formattedPairs.length);
        console.log('First formatted pair:', formattedPairs[0]);

        setPairs(formattedPairs);
        if (!selectedPair && formattedPairs.length > 0) {
          setSelectedPair(formattedPairs[0]);
        }
      } catch (error) {
        console.error('Error in fetchPairs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPairs();
    const interval = setInterval(fetchPairs, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredPairs = pairs.filter((pair) =>
    pair.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pair.baseToken.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pair.dexId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      {/* Left sidebar - Trading pairs */}
      <Collapsible
        open={isPairsOpen}
        onOpenChange={setIsPairsOpen}
        className="relative"
      >
        <CollapsibleContent className="data-[state=open]:w-80 data-[state=closed]:w-0 border-r border-border bg-card transition-all duration-300">
          <div className="p-4 w-80">
            <div className="relative">
              <input
                type="text"
                placeholder="Search pairs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-border bg-background p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            </div>

            <div className="mt-4 h-[calc(100vh-8rem)] overflow-auto">
              {isLoading ? (
                <div className="text-center text-muted-foreground">
                  Loading pairs...
                </div>
              ) : pairs.length === 0 ? (
                <div className="text-center text-muted-foreground">
                  No trading pairs found
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredPairs.length === 0 ? (
                    <div className="text-center text-muted-foreground">
                      No matches found for "{searchTerm}"
                    </div>
                  ) : (
                    filteredPairs.map((pair) => (
                      <div
                        key={pair.pairAddress}
                        className={`flex cursor-pointer items-center justify-between rounded-lg p-3 hover:bg-muted ${
                          selectedPair?.pairAddress === pair.pairAddress ? 'bg-muted' : ''
                        }`}
                        onClick={() => setSelectedPair(pair)}
                      >
                        <div>
                          <div className="font-medium">{pair.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {pair.baseToken.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {pair.dexId} • L: {pair.liquidity}
                          </div>
                        </div>
                        <div className="text-right">
                          <div>${pair.price}</div>
                          <div
                            className={`text-sm ${
                              pair.isPositive ? 'text-green-500' : 'text-red-500'
                            }`}
                          >
                            {pair.change}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Vol: {pair.volume}
                          </div>
                          {pair.marketCap && (
                            <div className="text-xs text-muted-foreground">
                              MCap: {pair.marketCap}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </CollapsibleContent>
        
        <CollapsibleTrigger asChild>
          <button className="absolute -right-6 top-1/2 z-10 flex h-12 w-6 -translate-y-1/2 items-center justify-center rounded-r-lg border border-l-0 border-border bg-card hover:bg-muted">
            {isPairsOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </CollapsibleTrigger>
      </Collapsible>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">{selectedPair?.label}</h1>
              <div className={`text-lg ${selectedPair?.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {selectedPair?.price}
              </div>
              <div className={`rounded px-2 py-1 text-sm ${
                selectedPair?.isPositive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
              }`}>
                {selectedPair?.change}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">24h Volume:</span>
              <span className="font-medium">{selectedPair?.volume}</span>
            </div>
          </div>
        </div>

        {/* Chart and Trading Area */}
        <div className="flex flex-1 min-h-0">
          {/* Chart and Orderbook */}
          <div className="flex flex-1 flex-col min-h-0">
            <div className="flex flex-1 min-h-0">
              {/* Chart */}
              <div className="flex-1 p-4">
                <div className="h-full rounded-lg border border-border bg-card">
                  {selectedPair && <TradingView pair={selectedPair.value} />}
                </div>
              </div>
              
              {/* Orderbook */}
              <div className="w-80 border-l border-border bg-card">
                {selectedPair && <Orderbook pair={selectedPair} />}
              </div>
            </div>

            {/* Bottom Panel */}
            <div className="h-80 border-t border-border bg-card p-4">
              <div className="flex h-full flex-col">
                <div className="mb-4 flex items-center gap-4 border-b border-border">
                  <button
                    onClick={() => setBottomTab('positions')}
                    className={`px-4 py-2 text-sm font-medium ${
                      bottomTab === 'positions'
                        ? 'border-b-2 border-primary text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Positions
                  </button>
                  <button
                    onClick={() => setBottomTab('transactions')}
                    className={`px-4 py-2 text-sm font-medium ${
                      bottomTab === 'transactions'
                        ? 'border-b-2 border-primary text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Transaction History
                  </button>
                </div>
                {bottomTab === 'positions' ? (
                  <PositionsPanel />
                ) : (
                  <TransactionHistory />
                )}
              </div>
            </div>
          </div>

          {/* Trading Interface */}
          <div className="w-96 border-l border-border bg-card p-4">
            <div className="flex items-center gap-4 border-b border-border">
              <button
                onClick={() => setActiveTab('trade')}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'trade'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Trade
              </button>
              <button
                onClick={() => setActiveTab('swap')}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'swap'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Swap
              </button>
              <button
                onClick={() => setActiveTab('dca')}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === 'dca'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                DCA
              </button>
            </div>
            <div className="mt-4">
              {activeTab === 'trade' && selectedPair && (
                <TokenSwap pair={selectedPair} />
              )}
              {activeTab === 'swap' && selectedPair && (
                <SwapForm pair={selectedPair} />
              )}
              {activeTab === 'dca' && selectedPair && (
                <DCAForm pair={selectedPair} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
