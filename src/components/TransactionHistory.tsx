import { formatDistanceToNow } from 'date-fns';

export function TransactionHistory() {
  const transactions = [
    {
      id: 1,
      type: 'Swap',
      from: { symbol: 'SOL', amount: '1.234' },
      to: { symbol: 'USDC', amount: '123.45' },
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      status: 'Confirmed',
    },
    {
      id: 2,
      type: 'Add Liquidity',
      from: { symbol: 'SOL', amount: '2.345' },
      to: { symbol: 'RAY', amount: '34.56' },
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      status: 'Confirmed',
    },
    {
      id: 3,
      type: 'Remove Liquidity',
      from: { symbol: 'SOL', amount: '0.567' },
      to: { symbol: 'USDC', amount: '56.78' },
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      status: 'Confirmed',
    },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b text-left">
            <th className="pb-4 pl-4">Type</th>
            <th className="pb-4">From</th>
            <th className="pb-4">To</th>
            <th className="pb-4">Time</th>
            <th className="pb-4 pr-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="border-b">
              <td className="py-4 pl-4 font-medium">{tx.type}</td>
              <td className="py-4">
                {tx.from.amount} {tx.from.symbol}
              </td>
              <td className="py-4">
                {tx.to.amount} {tx.to.symbol}
              </td>
              <td className="py-4">
                {formatDistanceToNow(tx.timestamp, { addSuffix: true })}
              </td>
              <td className="py-4 pr-4">
                <span className="rounded-full bg-primary/20 px-2 py-1 text-sm text-primary">
                  {tx.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
