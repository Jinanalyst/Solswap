'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickData } from 'lightweight-charts';
import axios from 'axios';
import { format } from 'date-fns';

interface ChartContainerProps {
  pair?: string;
}

export function TradingView({ pair = 'SOL' }: ChartContainerProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  const [timeframe, setTimeframe] = useState<string>('1h');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const timeframes = [
    { label: '5m', value: '5m' },
    { label: '15m', value: '15m' },
    { label: '1h', value: '1h' },
    { label: '4h', value: '4h' },
    { label: '1d', value: '1d' },
  ];

  const fetchKlines = async () => {
    try {
      setIsLoading(true);
      // Use DexScreener API for historical data
      const response = await axios.get(
        `https://api.dexscreener.com/latest/dex/pairs/solana/${pair}usdc`
      );

      if (!response.data.pairs || response.data.pairs.length === 0) {
        throw new Error('No pair data found');
      }

      const pairData = response.data.pairs[0];
      const currentTime = Math.floor(Date.now() / 1000);
      
      // Create candlestick data
      const candleData: CandlestickData[] = [{
        time: currentTime,
        open: parseFloat(pairData.priceUsd),
        high: parseFloat(pairData.priceUsd) * 1.001,
        low: parseFloat(pairData.priceUsd) * 0.999,
        close: parseFloat(pairData.priceUsd)
      }];

      const volumeData = [{
        time: currentTime,
        value: pairData.volume?.h24 || 0,
        color: 'rgba(76, 175, 80, 0.5)'
      }];

      if (candlestickSeriesRef.current && volumeSeriesRef.current) {
        candlestickSeriesRef.current.setData(candleData);
        volumeSeriesRef.current.setData(volumeData);
      }
    } catch (error) {
      console.error('Error fetching price data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (chartContainerRef.current) {
      const handleResize = () => {
        if (chartRef.current && chartContainerRef.current) {
          chartRef.current.applyOptions({
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
          });
        }
      };

      const chartInstance = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: 'transparent' },
          textColor: 'var(--text-primary)',
          fontSize: 12,
        },
        grid: {
          vertLines: { color: 'rgba(42, 46, 57, 0.1)' },
          horzLines: { color: 'rgba(42, 46, 57, 0.1)' },
        },
        rightPriceScale: {
          borderVisible: false,
          scaleMargins: {
            top: 0.1,
            bottom: 0.2,
          },
          borderColor: 'rgba(197, 203, 206, 0.3)',
        },
        timeScale: {
          borderVisible: false,
          timeVisible: true,
          secondsVisible: false,
          borderColor: 'rgba(197, 203, 206, 0.3)',
          tickMarkFormatter: (time: number) => {
            return format(new Date(time * 1000), 'HH:mm:ss');
          },
        },
        crosshair: {
          mode: 1,
          vertLine: {
            color: 'rgba(32, 38, 46, 0.1)',
            style: 3,
            visible: true,
            labelVisible: true,
          },
          horzLine: {
            color: 'rgba(32, 38, 46, 0.1)',
            style: 3,
            visible: true,
            labelVisible: true,
          },
        },
        handleScale: {
          mouseWheel: true,
          pinch: true,
          axisPressedMouseMove: true,
        },
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
      });

      chartRef.current = chartInstance;

      const candlestickSeries = chartInstance.addCandlestickSeries({
        upColor: '#22c55e',
        downColor: '#ef4444',
        borderVisible: false,
        wickUpColor: '#22c55e',
        wickDownColor: '#ef4444',
      });

      const volumeSeries = chartInstance.addHistogramSeries({
        color: '#6B7280',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: '',
      });

      chartInstance.applyOptions({
        rightPriceScale: {
          scaleMargins: {
            top: 0.8,
            bottom: 0,
          },
        },
      });

      candlestickSeriesRef.current = candlestickSeries;
      volumeSeriesRef.current = volumeSeries;

      window.addEventListener('resize', handleResize);
      fetchKlines();

      // Set up real-time updates
      const updateInterval = setInterval(fetchKlines, 10000); // Update every 10 seconds

      return () => {
        clearInterval(updateInterval);
        window.removeEventListener('resize', handleResize);
        if (chartRef.current) {
          chartRef.current.remove();
        }
      };
    }
  }, [pair]);

  useEffect(() => {
    fetchKlines();
  }, [timeframe, pair]);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-4 py-2">
        <div className="flex gap-2">
          {timeframes.map((tf) => (
            <button
              key={tf.value}
              onClick={() => setTimeframe(tf.value)}
              className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
                timeframe === tf.value
                  ? 'bg-primary text-white'
                  : 'hover:bg-primary/10'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>
      <div className="relative flex-1" ref={chartContainerRef}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          </div>
        )}
      </div>
    </div>
  );
}
