'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickData } from 'lightweight-charts';
import axios from 'axios';
import { format } from 'date-fns';

interface ChartContainerProps {
  pair?: string;
}

export function TradingView({ pair = 'SOLUSDT' }: ChartContainerProps) {
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
      const response = await axios.get(
        `https://api.binance.com/api/v3/klines?symbol=${pair}&interval=${timeframe}&limit=1000`
      );

      const candleData: CandlestickData[] = response.data.map((d: any) => ({
        time: d[0] / 1000,
        open: parseFloat(d[1]),
        high: parseFloat(d[2]),
        low: parseFloat(d[3]),
        close: parseFloat(d[4]),
      }));

      const volumeData = response.data.map((d: any) => ({
        time: d[0] / 1000,
        value: parseFloat(d[5]),
        color: parseFloat(d[4]) >= parseFloat(d[1]) ? 'rgba(76, 175, 80, 0.5)' : 'rgba(255, 82, 82, 0.5)',
      }));

      if (candlestickSeriesRef.current && volumeSeriesRef.current) {
        candlestickSeriesRef.current.setData(candleData);
        volumeSeriesRef.current.setData(volumeData);
      }
    } catch (error) {
      console.error('Error fetching klines:', error);
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
          textColor: '#999',
        },
        grid: {
          vertLines: { color: 'rgba(42, 46, 57, 0.2)' },
          horzLines: { color: 'rgba(42, 46, 57, 0.2)' },
        },
        rightPriceScale: {
          borderVisible: false,
        },
        timeScale: {
          borderVisible: false,
          timeVisible: true,
        },
        crosshair: {
          vertLine: {
            color: '#6B7280',
            width: 1,
            style: 3,
            visible: true,
            labelVisible: true,
          },
          horzLine: {
            color: '#6B7280',
            width: 1,
            style: 3,
            visible: true,
            labelVisible: true,
          },
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
        scaleMargins: {
          top: 0.8,
          bottom: 0,
        },
      });

      candlestickSeriesRef.current = candlestickSeries;
      volumeSeriesRef.current = volumeSeries;

      window.addEventListener('resize', handleResize);
      fetchKlines();

      return () => {
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
      <div className="relative flex-1">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          </div>
        )}
        <div ref={chartContainerRef} className="absolute inset-0" />
        <div className="mt-4 text-sm text-muted-foreground">
          Last updated: {format(new Date(), 'PPpp')}
        </div>
      </div>
    </div>
  );
}
