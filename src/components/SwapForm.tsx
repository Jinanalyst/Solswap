'use client';

import { useState } from 'react';
import { ArrowDownUp } from 'lucide-react';

interface SwapFormProps {
  selectedPair?: {
    label: string;
    value: string;
    price: string;
  };
}

export function SwapForm({ selectedPair }: SwapFormProps) {
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState('0.5');

  const slippageOptions = [
    { label: '0.5%', value: '0.5' },
    { label: '1.0%', value: '1.0' },
    { label: '2.0%', value: '2.0' },
  ];

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border p-4">
        <h3 className="text-lg font-medium">Swap Tokens</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Trade tokens instantly with minimal slippage
        </p>
      </div>

      <div className="p-4">
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-muted-foreground">From</label>
            <div className="relative">
              <input
                type="text"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="w-full rounded-lg border border-border bg-background p-3 pr-24 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0.00"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button className="text-sm text-primary hover:text-primary/80">
                  Max
                </button>
                <span className="font-medium">
                  {selectedPair?.label.split('/')[0]}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button className="rounded-full bg-background p-2 hover:bg-muted">
              <ArrowDownUp className="h-5 w-5" />
            </button>
          </div>

          <div>
            <label className="mb-2 block text-sm text-muted-foreground">To</label>
            <div className="relative">
              <input
                type="text"
                value={toAmount}
                onChange={(e) => setToAmount(e.target.value)}
                className="w-full rounded-lg border border-border bg-background p-3 pr-24 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0.00"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <span className="font-medium">
                  {selectedPair?.label.split('/')[1]}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-muted-foreground">
              Slippage Tolerance
            </label>
            <div className="grid grid-cols-3 gap-2">
              {slippageOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSlippage(option.value)}
                  className={`rounded-lg border border-border p-2 text-sm font-medium transition-colors ${
                    slippage === option.value
                      ? 'border-primary bg-primary text-white'
                      : 'hover:border-primary hover:bg-primary/5'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-background p-4">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-muted-foreground">Rate</span>
              <span>1 {selectedPair?.label.split('/')[0]} = {selectedPair?.price} {selectedPair?.label.split('/')[1]}</span>
            </div>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-muted-foreground">Price Impact</span>
              <span className="text-green-500">{'<'}0.01%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Minimum received</span>
              <span>0.00 {selectedPair?.label.split('/')[1]}</span>
            </div>
          </div>

          <button className="w-full rounded-lg bg-primary py-4 font-semibold text-white hover:bg-primary/90">
            Swap Tokens
          </button>
        </div>
      </div>
    </div>
  );
}
