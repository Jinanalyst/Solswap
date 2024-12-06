'use client';

import { useState } from 'react';
import { Search, Star, ExternalLink, Plus } from 'lucide-react';
import Link from 'next/link';

interface Pool {
  id: string;
  name: string;
  token1: {
    symbol: string;
    icon: string;
  };
  token2: {
    symbol: string;
    icon: string;
  };
  apr: string;
  tvl: string;
  volume24h: string;
  myLiquidity: string;
  isFavorite: boolean;
  isStable: boolean;
}

interface PoolListProps {
  showMyPools?: boolean;
  showFavorites?: boolean;
}

const mockPools: Pool[] = [
  {
    id: 'sol-usdc',
    name: 'SOL-USDC',
    token1: {
      symbol: 'SOL',
      icon: '/icons/sol.png',
    },
    token2: {
      symbol: 'USDC',
      icon: '/icons/usdc.png',
    },
    apr: '24.5%',
    tvl: '$12.5M',
    volume24h: '$1.2M',
    myLiquidity: '$1,234',
    isFavorite: true,
    isStable: false,
  },
  {
    id: 'ray-usdc',
    name: 'RAY-USDC',
    token1: {
      symbol: 'RAY',
      icon: '/icons/ray.png',
    },
    token2: {
      symbol: 'USDC',
      icon: '/icons/usdc.png',
    },
    apr: '32.1%',
    tvl: '$8.3M',
    volume24h: '$890K',
    myLiquidity: '$567',
    isFavorite: false,
    isStable: false,
  },
  {
    id: 'usdc-usdt',
    name: 'USDC-USDT',
    token1: {
      symbol: 'USDC',
      icon: '/icons/usdc.png',
    },
    token2: {
      symbol: 'USDT',
      icon: '/icons/usdt.png',
    },
    apr: '12.3%',
    tvl: '$25.7M',
    volume24h: '$5.4M',
    myLiquidity: '$2,345',
    isFavorite: true,
    isStable: true,
  },
];

type SortKey = 'apr' | 'tvl' | 'volume24h' | 'myLiquidity';
type PoolType = 'all' | 'standard' | 'stable';

export function PoolList({ showMyPools = false, showFavorites = false }: PoolListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('tvl');
  const [sortDesc, setSortDesc] = useState(true);
  const [poolType, setPoolType] = useState<PoolType>('all');
  const [favorites, setFavorites] = useState<Set<string>>(
    new Set(mockPools.filter(p => p.isFavorite).map(p => p.id))
  );

  const toggleFavorite = (poolId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(poolId)) {
      newFavorites.delete(poolId);
    } else {
      newFavorites.add(poolId);
    }
    setFavorites(newFavorites);
  };

  const filteredPools = mockPools
    .filter(pool => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return pool.name.toLowerCase().includes(query);
      }
      // Pool type filter
      if (poolType === 'stable' && !pool.isStable) return false;
      if (poolType === 'standard' && pool.isStable) return false;
      // My pools filter
      if (showMyPools && Number(pool.myLiquidity.replace(/[^0-9.-]+/g, '')) === 0) return false;
      return true;
    })
    .sort((a, b) => {
      const aValue = Number(a[sortKey].replace(/[^0-9.-]+/g, ''));
      const bValue = Number(b[sortKey].replace(/[^0-9.-]+/g, ''));
      return sortDesc ? bValue - aValue : aValue - bValue;
    });

  return (
    <div className="flex flex-col gap-6">
      {/* Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setPoolType('all')}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                poolType === 'all'
                  ? 'bg-primary text-white'
                  : 'hover:bg-muted'
              }`}
            >
              All Pools
            </button>
            <button
              onClick={() => setPoolType('standard')}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                poolType === 'standard'
                  ? 'bg-primary text-white'
                  : 'hover:bg-muted'
              }`}
            >
              Standard
            </button>
            <button
              onClick={() => setPoolType('stable')}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                poolType === 'stable'
                  ? 'bg-primary text-white'
                  : 'hover:bg-muted'
              }`}
            >
              Stable
            </button>
          </div>
          <Link
            href="/pools/create"
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Create Pool
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search pools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            onClick={() => showMyPools = !showMyPools}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              showMyPools
                ? 'bg-primary text-white'
                : 'hover:bg-muted'
            }`}
          >
            My Pools
          </button>
        </div>
      </div>

      {/* Pool List */}
      <div className="rounded-lg border border-border">
        {/* Headers */}
        <div className="grid grid-cols-7 gap-4 border-b border-border bg-muted/50 p-4 text-sm font-medium text-muted-foreground">
          <div className="col-span-2">Pool</div>
          <button
            onClick={() => {
              if (sortKey === 'apr') {
                setSortDesc(!sortDesc);
              } else {
                setSortKey('apr');
                setSortDesc(true);
              }
            }}
            className="flex items-center gap-1 hover:text-foreground"
          >
            APR
            {sortKey === 'apr' && (
              <span className="ml-1">{sortDesc ? '↓' : '↑'}</span>
            )}
          </button>
          <button
            onClick={() => {
              if (sortKey === 'tvl') {
                setSortDesc(!sortDesc);
              } else {
                setSortKey('tvl');
                setSortDesc(true);
              }
            }}
            className="flex items-center gap-1 hover:text-foreground"
          >
            TVL
            {sortKey === 'tvl' && (
              <span className="ml-1">{sortDesc ? '↓' : '↑'}</span>
            )}
          </button>
          <button
            onClick={() => {
              if (sortKey === 'volume24h') {
                setSortDesc(!sortDesc);
              } else {
                setSortKey('volume24h');
                setSortDesc(true);
              }
            }}
            className="flex items-center gap-1 hover:text-foreground"
          >
            Volume 24H
            {sortKey === 'volume24h' && (
              <span className="ml-1">{sortDesc ? '↓' : '↑'}</span>
            )}
          </button>
          <button
            onClick={() => {
              if (sortKey === 'myLiquidity') {
                setSortDesc(!sortDesc);
              } else {
                setSortKey('myLiquidity');
                setSortDesc(true);
              }
            }}
            className="flex items-center gap-1 hover:text-foreground"
          >
            My Liquidity
            {sortKey === 'myLiquidity' && (
              <span className="ml-1">{sortDesc ? '↓' : '↑'}</span>
            )}
          </button>
          <div className="text-right">Action</div>
        </div>

        {/* Pool Rows */}
        <div className="divide-y divide-border">
          {filteredPools.map((pool) => (
            <div
              key={pool.id}
              className="grid grid-cols-7 gap-4 p-4 hover:bg-muted/50"
            >
              <div className="col-span-2 flex items-center gap-4">
                <button
                  onClick={() => toggleFavorite(pool.id)}
                  className={`text-sm ${
                    favorites.has(pool.id)
                      ? 'text-yellow-500'
                      : 'text-muted-foreground hover:text-yellow-500'
                  }`}
                >
                  <Star className="h-4 w-4" fill={favorites.has(pool.id) ? 'currentColor' : 'none'} />
                </button>
                <div className="flex items-center gap-2">
                  <div className="relative h-8 w-8">
                    <img
                      src={pool.token1.icon}
                      alt={pool.token1.symbol}
                      className="absolute left-0 top-0 h-6 w-6 rounded-full"
                    />
                    <img
                      src={pool.token2.icon}
                      alt={pool.token2.symbol}
                      className="absolute bottom-0 right-0 h-6 w-6 rounded-full"
                    />
                  </div>
                  <div>
                    <div className="font-medium">
                      {pool.token1.symbol}-{pool.token2.symbol}
                    </div>
                    {pool.isStable && (
                      <div className="rounded bg-blue-500/10 px-1.5 py-0.5 text-xs font-medium text-blue-500">
                        Stable
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-green-500">{pool.apr}</span>
              </div>
              <div className="flex items-center text-sm">{pool.tvl}</div>
              <div className="flex items-center text-sm">{pool.volume24h}</div>
              <div className="flex items-center text-sm">{pool.myLiquidity}</div>
              <div className="flex items-center justify-end gap-2">
                <Link
                  href={`/pools/${pool.id}`}
                  className="rounded-lg border border-border px-3 py-1 text-sm hover:bg-muted"
                >
                  Details
                </Link>
                <Link
                  href={`/pools/${pool.id}/add`}
                  className="rounded-lg bg-primary px-3 py-1 text-sm text-white hover:bg-primary/90"
                >
                  Add Liquidity
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
