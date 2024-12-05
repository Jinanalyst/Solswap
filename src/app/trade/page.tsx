import { TradingView } from '@/components/TradingView';
import { TokenSwap } from '@/components/TokenSwap';

export default function TradePage() {
  return (
    <main className="container mx-auto flex min-h-screen flex-col gap-6 px-4 py-8">
      <h1 className="text-3xl font-bold">Trade</h1>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TradingView />
        </div>
        
        <div className="rounded-lg bg-card p-6 shadow-lg">
          <TokenSwap />
        </div>
      </div>
    </main>
  );
}
