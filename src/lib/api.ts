const axios = require('axios');
const { BIRDEYE_API_KEY } = require('../config/api');

interface TokenData {
  price: number;
  priceChange24h: number;
  volume24h: number;
  liquidity?: number;
  marketCap?: number;
  symbol: string;
  name?: string;
  address?: string;
  dexId?: string;
  pairAddress?: string;
  baseToken?: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken?: {
    address: string;
    name: string;
    symbol: string;
  };
}

const axiosConfig = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-API-KEY': BIRDEYE_API_KEY
  }
};

const USDC_ADDRESS = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

const api = {
  async fetchAllSolanaPairs(): Promise<TokenData[]> {
    try {
      console.log('Fetching Solana pairs from Birdeye...');
      
      // First, get top tokens
      const response = await axios.get(
        'https://public-api.birdeye.so/v2/tokens?sort_by=volume&limit=100',
        axiosConfig
      );
      
      if (!response.data?.data?.items?.length) {
        console.log('No tokens found in response');
        return [];
      }

      const tokens = response.data.data.items;
      console.log('Total tokens before filtering:', tokens.length);

      // Filter and transform the data
      const filteredPairs = tokens
        .filter((token: any) => {
          const hasLiquidity = (token.liquidity || 0) > 10000;
          const hasValidPrice = !isNaN(parseFloat(token.price));
          return hasLiquidity && hasValidPrice;
        })
        .map((token: any) => ({
          symbol: token.symbol,
          name: token.name || token.symbol,
          price: parseFloat(token.price),
          priceChange24h: token.price_change_24h || 0,
          volume24h: token.volume_24h || 0,
          liquidity: token.liquidity || 0,
          marketCap: token.market_cap || 0,
          address: token.address,
          baseToken: {
            address: token.address,
            name: token.name || token.symbol,
            symbol: token.symbol
          },
          quoteToken: {
            address: USDC_ADDRESS,
            name: 'USD Coin',
            symbol: 'USDC'
          }
        }))
        .sort((a: any, b: any) => b.volume24h - a.volume24h);

      console.log('Filtered pairs:', filteredPairs.length);
      if (filteredPairs.length > 0) {
        console.log('First pair:', JSON.stringify(filteredPairs[0], null, 2));
      }
      
      return filteredPairs;
    } catch (error) {
      console.error('Error fetching Birdeye pairs:', error);
      return [];
    }
  },

  async fetchTokenPrice(tokenAddress: string): Promise<number | null> {
    try {
      const response = await axios.get(
        `https://public-api.birdeye.so/v2/tokens?address=${tokenAddress}`,
        axiosConfig
      );
      
      const token = response.data?.data?.items?.[0];
      if (token?.price) {
        return parseFloat(token.price);
      }
      return null;
    } catch (error) {
      console.error('Error fetching token price:', error);
      return null;
    }
  },

  async fetchTokenOrderbook(tokenAddress: string): Promise<any> {
    try {
      // First get the pool address
      const poolResponse = await axios.get(
        `https://public-api.birdeye.so/v2/pools?base_address=${tokenAddress}&quote_address=${USDC_ADDRESS}`,
        axiosConfig
      );

      const poolAddress = poolResponse.data?.data?.items?.[0]?.pool_address;
      if (!poolAddress) {
        console.log('No pool found for token');
        return null;
      }

      const response = await axios.get(
        `https://public-api.birdeye.so/v2/pools/${poolAddress}/orderbook`,
        axiosConfig
      );
      
      return response.data?.data || null;
    } catch (error) {
      console.error('Error fetching orderbook:', error);
      return null;
    }
  },

  async fetchTokenOHLC(tokenAddress: string, resolution: string = '1D'): Promise<any> {
    try {
      const response = await axios.get(
        `https://public-api.birdeye.so/v2/tokens/${tokenAddress}/ohlcv?resolution=${resolution}`,
        axiosConfig
      );
      
      return response.data?.data || null;
    } catch (error) {
      console.error('Error fetching OHLC data:', error);
      return null;
    }
  }
};

module.exports = api;
