const axios = require('axios');
const { BIRDEYE_API_KEY } = require('../config/api');

async function testBirdeyeAPI() {
  console.log('Testing Birdeye API integration...\n');

  const axiosConfig = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-API-KEY': BIRDEYE_API_KEY
    }
  };

  // Test direct API call
  console.log('1. Testing direct API call to /tokens endpoint...');
  try {
    const response = await axios.get(
      'https://public-api.birdeye.so/v2/tokens?sort_by=volume&limit=100',
      axiosConfig
    );
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error: any) {
    console.error('Error:', error.response?.data || error.message);
  }
  console.log('\n-------------------\n');

  // Test USDC price
  console.log('2. Testing direct API call for USDC price...');
  try {
    const response = await axios.get(
      'https://public-api.birdeye.so/v2/tokens?address=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      axiosConfig
    );
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error: any) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testBirdeyeAPI().catch(console.error);
