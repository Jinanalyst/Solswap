'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { TradingView } from '@/components/TradingView';
import { TokenSwap } from '@/components/TokenSwap';
import { SwapForm } from '@/components/SwapForm';
import { DCAForm } from '@/components/DCAForm';
import { PositionsPanel } from '@/components/PositionsPanel';
import { TransactionHistory } from '@/components/TransactionHistory';

const tradingPairs = [
  { 
    label: 'SOL/USDT',
    value: 'SOLUSDT',
    price: '108.45',
    change: '+5.67%',
    volume: '245.3M',
    isPositive: true
  },
  { 
    label: 'BTC/USDT',
    value: 'BTCUSDT',
    price: '43,567.89',
    change: '-1.23%',
    volume: '1.2B',
    isPositive: false
  },
  { 
    label: 'ETH/USDT',
    value: 'ETHUSDT',
    price: '2,345.67',
    change: '+2.45%',
    volume: '789.1M',
    isPositive: true
  },
  { 
    label: 'AVAX/USDT',
    value: 'AVAXUSDT',
    price: '34.56',
    change: '+3.21%',
    volume: '156.7M',
    isPositive: true
  },
];

type Tab = 'trade' | 'swap' | 'dca';
type BottomTab = 'positions' | 'transactions';

export default function TradePage() {
  const [selectedPair, setSelectedPair] = useState(tradingPairs[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('trade');
  const [bottomTab, setBottomTab] = useState<BottomTab>('positions');

  const filteredPairs = tradingPairs.filter(pair =>
    pair.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderForm = () => {
    switch (activeTab) {
      case 'trade':
        return <TokenSwap selectedPair={selectedPair} />;
      case 'swap':
        return <SwapForm selectedPair={selectedPair} />;
      case 'dca':
        return <DCAForm selectedPair={selectedPair} />;
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {/* Left sidebar - Market selector */}
      <div className="w-72 flex-none border-r border-border bg-card">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search markets"
              className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="border-y border-border bg-muted/30">
          <div className="grid grid-cols-4 px-4 py-2 text-sm font-medium text-muted-foreground">
            <div>Pair</div>
            <div className="text-right">Price</div>
            <div className="text-right">24h</div>
            <div className="text-right">Vol</div>
          </div>
        </div>

        <div className="h-[calc(100vh-12rem)] overflow-auto">
          {filteredPairs.map((pair) => (
            <button
              key={pair.value}
              onClick={() => setSelectedPair(pair)}
              className={`w-full px-4 py-3 hover:bg-muted/50 ${
                selectedPair.value === pair.value ? 'bg-muted' : ''
              }`}
            >
              <div className="grid grid-cols-4 text-sm">
                <div className="font-medium">{pair.label}</div>
                <div className="text-right">{pair.price}</div>
                <div className={`text-right ${pair.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {pair.change}
                </div>
                <div className="text-right text-muted-foreground">{pair.volume}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">{selectedPair.label}</h1>
              <div className={`text-lg ${selectedPair.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {selectedPair.price}
              </div>
              <div className={`rounded px-2 py-1 text-sm ${
                selectedPair.isPositive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
              }`}>
                {selectedPair.change}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">24h Volume:</span>
              <span className="font-medium">{selectedPair.volume}</span>
            </div>
          </div>
        </div>

        {/* Chart and Trading Area */}
        <div className="flex flex-1 min-h-0">
          {/* Chart */}
          <div className="flex flex-1 flex-col min-h-0">
            <div className="flex-1 overflow-hidden p-4">
              <div className="h-full rounded-lg border border-border bg-card">
                <TradingView pair={selectedPair.value} />
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
                <div className="flex-1 min-h-0">
                  {bottomTab === 'positions' ? (
                    <PositionsPanel />
                  ) : (
                    <TransactionHistory />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Trading Form */}
          <div className="w-96 flex-none border-l border-border bg-card">
            <div className="border-b border-border">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('trade')}
                  className={`flex-1 px-4 py-3 text-sm font-medium ${
                    activeTab === 'trade'
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Trade
                </button>
                <button
                  onClick={() => setActiveTab('swap')}
                  className={`flex-1 px-4 py-3 text-sm font-medium ${
                    activeTab === 'swap'
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Swap
                </button>
                <button
                  onClick={() => setActiveTab('dca')}
                  className={`flex-1 px-4 py-3 text-sm font-medium ${
                    activeTab === 'dca'
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  DCA
                </button>
              </div>
            </div>
            <div className="p-4">
              {renderForm()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
