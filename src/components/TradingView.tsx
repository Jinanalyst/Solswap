import { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

export function TradingView() {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartContainerRef.current) {
      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: { color: 'transparent' },
          textColor: '#D9D9D9',
        },
        grid: {
          vertLines: { color: 'rgba(42, 46, 57, 0.5)' },
          horzLines: { color: 'rgba(42, 46, 57, 0.5)' },
        },
        width: chartContainerRef.current.clientWidth,
        height: 400,
      });

      const candlestickSeries = chart.addCandlestickSeries();
      
      // Sample data - replace with real data
      const data = [
        { time: '2024-01-01', open: 50, high: 55, low: 48, close: 52 },
        { time: '2024-01-02', open: 52, high: 57, low: 51, close: 56 },
        { time: '2024-01-03', open: 56, high: 58, low: 54, close: 55 },
      ];

      candlestickSeries.setData(data);

      const handleResize = () => {
        if (chartContainerRef.current) {
          chart.applyOptions({ width: chartContainerRef.current.clientWidth });
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chart.remove();
      };
    }
  }, []);

  return (
    <div className="rounded-lg bg-card p-4 shadow-lg">
      <div ref={chartContainerRef} />
    </div>
  );
}
