import { NextApiRequest, NextApiResponse } from 'next'
import { Connection } from '@solana/web3.js'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Check Solana RPC connection
    const connection = new Connection(
      process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
    )
    await connection.getVersion()

    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NEXT_PUBLIC_ENVIRONMENT || 'production',
      solana: {
        network: process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet-beta',
        connected: true,
      },
    })
  } catch (error) {
    console.error('Health check failed:', error)
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
