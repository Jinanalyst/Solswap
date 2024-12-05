/** @type {import('next').NextConfig} */
const webpack = require('webpack');

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['raw.githubusercontent.com'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        url: require.resolve('url/'),
        zlib: require.resolve('browserify-zlib'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        assert: require.resolve('assert/'),
        os: require.resolve('os-browserify/browser'),
        path: require.resolve('path-browserify'),
        buffer: require.resolve('buffer/'),
        ws: require.resolve('ws'),
      };

      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser',
        })
      );
    }

    // Prevent webpack from trying to bundle native modules
    config.externals = [...(config.externals || []), { 'utf-8-validate': 'utf-8-validate', bufferutil: 'bufferutil' }];

    return config;
  },
  transpilePackages: [
    '@solana/web3.js',
    '@solana/wallet-adapter-base',
    '@solana/wallet-adapter-react',
    '@solana/wallet-adapter-react-ui',
    '@solana/wallet-adapter-phantom',
    '@solana/wallet-adapter-solflare',
    '@solana/spl-token',
    'rpc-websockets',
    'ws',
  ],
}

module.exports = nextConfig
