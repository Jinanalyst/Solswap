export function PoolList() {
  const pools = [
    {
      id: 1,
      name: 'SOL-USDC',
      tvl: '$1,234,567',
      apy: '12.34%',
      volume24h: '$345,678',
    },
    {
      id: 2,
      name: 'SOL-RAY',
      tvl: '$567,890',
      apy: '8.45%',
      volume24h: '$123,456',
    },
    {
      id: 3,
      name: 'USDC-USDT',
      tvl: '$2,345,678',
      apy: '5.67%',
      volume24h: '$567,890',
    },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b text-left">
            <th className="pb-4 pl-4">Pool</th>
            <th className="pb-4">TVL</th>
            <th className="pb-4">APY</th>
            <th className="pb-4">Volume (24h)</th>
            <th className="pb-4 pr-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {pools.map((pool) => (
            <tr key={pool.id} className="border-b">
              <td className="py-4 pl-4 font-medium">{pool.name}</td>
              <td className="py-4">{pool.tvl}</td>
              <td className="py-4 text-primary">{pool.apy}</td>
              <td className="py-4">{pool.volume24h}</td>
              <td className="py-4 pr-4">
                <button className="rounded bg-primary px-3 py-1 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  Add Liquidity
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
