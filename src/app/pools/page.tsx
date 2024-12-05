import { PoolList } from '@/components/PoolList';
import { CreatePool } from '@/components/CreatePool';

export default function PoolsPage() {
  return (
    <main className="container mx-auto flex min-h-screen flex-col gap-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Liquidity Pools</h1>
        <CreatePool />
      </div>
      
      <div className="rounded-lg bg-card p-6 shadow-lg">
        <PoolList />
      </div>
    </main>
  );
}
