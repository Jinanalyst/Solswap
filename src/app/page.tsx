import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Solar<span className="text-primary">DEX</span>
        </h1>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
            href="/trade"
          >
            <h3 className="text-2xl font-bold">Trade →</h3>
            <div className="text-lg">
              Swap tokens instantly with minimal slippage
            </div>
          </Link>
          
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
            href="/pools"
          >
            <h3 className="text-2xl font-bold">Pools →</h3>
            <div className="text-lg">
              Provide liquidity and earn rewards
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
            href="/portfolio"
          >
            <h3 className="text-2xl font-bold">Portfolio →</h3>
            <div className="text-lg">
              Track your assets and earnings
            </div>
          </Link>
          
          <a
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
            href="https://docs.solardex.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h3 className="text-2xl font-bold">Documentation →</h3>
            <div className="text-lg">
              Learn how to use SolarDEX
            </div>
          </a>
        </div>
      </div>
    </main>
  );
}