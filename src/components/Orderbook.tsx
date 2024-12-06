'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { formatNumber } from '@/lib/utils';

interface Order {
  price: number;
  size: number;
  total: number;
}

interface OrderbookProps {
  pair: {
    baseToken: {
      symbol: string;
    };
    priceUsd: number;
    value: string;
  };
}

export function Orderbook({ pair }: OrderbookProps) {
  const [asks, setAsks] = useState<Order[]>([]);
  const [bids, setBids] = useState<Order[]>([]);
  const [spread, setSpread] = useState<number>(0);
  const [lastPrice, setLastPrice] = useState<number | null>(null);
  const [priceChangeDirection, setPriceChangeDirection] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    const fetchOrderbook = async () => {
      try {
        // Fetch real-time price from DexScreener
        const response = await axios.get(
          `https://api.dexscreener.com/latest/dex/pairs/solana/${pair.value}usdc`
        );
        
        if (response.data && response.data.pairs && response.data.pairs[0]) {
          const pairData = response.data.pairs[0];
          const currentPrice = parseFloat(pairData.priceUsd);
          
          // Generate orderbook data around the current price
          const mockOrderbook = generateMockOrderbook(currentPrice, pairData.volume?.h24 || 0);
          setAsks(mockOrderbook.asks);
          setBids(mockOrderbook.bids);
          
          // Calculate spread
          const spreadValue = ((mockOrderbook.asks[0].price - mockOrderbook.bids[0].price) / mockOrderbook.asks[0].price) * 100;
          setSpread(spreadValue);
          
          // Update price direction
          if (lastPrice !== null) {
            setPriceChangeDirection(currentPrice > lastPrice ? 'up' : 'down');
          }
          setLastPrice(currentPrice);
        }
      } catch (error) {
        console.error('Error updating orderbook:', error);
      }
    };

    fetchOrderbook();
    const interval = setInterval(fetchOrderbook, 2000); // Update every 2 seconds
    return () => clearInterval(interval);
  }, [pair.value, lastPrice]);

  const generateMockOrderbook = (currentPrice: number, volume24h: number) => {
    const asks: Order[] = [];
    const bids: Order[] = [];
    
    // Calculate average order size based on 24h volume
    const avgOrderSize = (volume24h / 24) * 0.01; // Use 1% of hourly volume as base
    
    // Generate more realistic ask orders with decreasing volume as price increases
    for (let i = 0; i < 15; i++) {
      const priceIncrement = (i + 1) * 0.0005; // Smaller price increments
      const price = currentPrice * (1 + priceIncrement);
      const baseSize = avgOrderSize * (Math.random() * 0.5 + 0.75); // Random variation
      const size = baseSize * (1 - i * 0.05); // Gradually decrease size
      asks.push({
        price,
        size,
        total: price * size
      });
    }
    
    // Generate more realistic bid orders with decreasing volume as price decreases
    for (let i = 0; i < 15; i++) {
      const priceDecrement = (i + 1) * 0.0005; // Smaller price decrements
      const price = currentPrice * (1 - priceDecrement);
      const baseSize = avgOrderSize * (Math.random() * 0.5 + 0.75); // Random variation
      const size = baseSize * (1 - i * 0.05); // Gradually decrease size
      bids.push({
        price,
        size,
        total: price * size
      });
    }
    
    return { 
      asks: asks.sort((a, b) => a.price - b.price), 
      bids: bids.sort((a, b) => b.price - a.price) 
    };
  };

  return (
    <div className="h-full flex flex-col text-sm bg-background rounded-lg border border-border">
      <div className="border-b border-border p-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground font-medium">Orderbook</span>
          <span className="text-muted-foreground">Spread: {formatNumber(spread, 3)}%</span>
        </div>
        <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground mt-2">
          <div>Price (USDC)</div>
          <div className="text-right">Size ({pair.baseToken.symbol})</div>
          <div className="text-right">Total (USDC)</div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Asks */}
        <div className="flex-1 overflow-y-auto">
          {asks.map((ask, i) => (
            <div
              key={i}
              className="grid grid-cols-3 gap-4 px-3 py-1 text-xs hover:bg-muted/50 relative group"
              style={{
                background: `linear-gradient(to left, rgba(239, 68, 68, 0.05) ${Math.min(
                  (ask.total / Math.max(...asks.map((a) => a.total))) * 100,
                  100
                )}%, transparent 0%)`,
              }}
            >
              <div className="text-red-500 font-medium">{formatNumber(ask.price, 6)}</div>
              <div className="text-right">{formatNumber(ask.size, 3)}</div>
              <div className="text-right">{formatNumber(ask.total, 2)}</div>
            </div>
          ))}
        </div>

        {/* Last price */}
        <div className={`px-3 py-2 border-y border-border font-semibold ${
          priceChangeDirection === 'up' ? 'text-green-500' : 
          priceChangeDirection === 'down' ? 'text-red-500' : ''
        }`}>
          {lastPrice ? formatNumber(lastPrice, 6) : '-'}
        </div>

        {/* Bids */}
        <div className="flex-1 overflow-y-auto">
          {bids.map((bid, i) => (
            <div
              key={i}
              className="grid grid-cols-3 gap-4 px-3 py-1 text-xs hover:bg-muted/50 relative group"
              style={{
                background: `linear-gradient(to left, rgba(34, 197, 94, 0.05) ${Math.min(
                  (bid.total / Math.max(...bids.map((b) => b.total))) * 100,
                  100
                )}%, transparent 0%)`,
              }}
            >
              <div className="text-green-500 font-medium">{formatNumber(bid.price, 6)}</div>
              <div className="text-right">{formatNumber(bid.size, 3)}</div>
              <div className="text-right">{formatNumber(bid.total, 2)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
