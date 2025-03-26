/**
 * Pump.fun Token Launch Script
 *
 * This script demonstrates how to launch a token via the Pump.fun API.
 * It uses axios for sending HTTP requests and includes detailed logging,
 * parameter validation, and robust error handling.
 *
 * Requirements:
 * - Node.js environment
 * - npm packages: axios, dotenv
 *
 * To install dependencies, run:
 *   npm install axios dotenv
 *
 * Usage:
 *   node launchToken.js
 */

const axios = require('axios');
require('dotenv').config();

// Configuration (ensure these values are set in your .env file or update directly)
const API_KEY = process.env.PUMP_FUN_API_KEY || 'your_api_key_here';
const BASE_URL = process.env.PUMP_FUN_BASE_URL || 'https://api.pump.fun';
const TOKEN_LAUNCH_ENDPOINT = process.env.PUMP_FUN_TOKEN_LAUNCH_ENDPOINT || '/token/launch';

/**
 * Validates the token parameters to ensure they meet the required criteria.
 *
 * @param {string} tokenName - The name of the token.
 * @param {string} tokenSymbol - The symbol of the token.
 * @param {number} totalSupply - The total supply of the token.
 * @param {number} decimals - The number of decimals for the token.
 */
function validateTokenParameters(tokenName, tokenSymbol, totalSupply, decimals) {
  if (!tokenName || typeof tokenName !== 'string') {
    throw new Error('Invalid token name provided.');
  }
  if (!tokenSymbol || typeof tokenSymbol !== 'string') {
    throw new Error('Invalid token symbol provided.');
  }
  if (!Number.isInteger(totalSupply) || totalSupply <= 0) {
    throw new Error('Total supply must be a positive integer.');
  }
  if (!Number.isInteger(decimals) || decimals < 0) {
    throw new Error('Decimals must be a non-negative integer.');
  }
  console.log('Token parameters validated successfully.');
}

/**
 * Launches a token via the Pump.fun API.
 *
 * @param {string} tokenName - The name of the token.
 * @param {string} tokenSymbol - The symbol of the token.
 * @param {number} totalSupply - The total supply of the token.
 * @param {number} decimals - The number of decimals for the token.
 * @returns {Promise<Object>} The response data from the API.
 */
async function launchToken(tokenName, tokenSymbol, totalSupply, decimals) {
  // Construct the API endpoint URL
  const url = `${BASE_URL}${TOKEN_LAUNCH_ENDPOINT}`;

  // Create the payload with token details
  const payload = {
    name: tokenName,
    symbol: tokenSymbol,
    total_supply: totalSupply,
    decimals: decimals
  };

  // Setup headers including the API key for authentication
  const headers = {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  };

  console.log('Launching token with the following details:');
  console.log(JSON.stringify(payload, null, 2));
  console.log(`Sending POST request to: ${url}`);

  try {
    const response = await axios.post(url, payload, { headers });
    console.log('Token launched successfully!');
    console.log('Response data:');
    console.log(response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      // The API responded with an error status code
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // No response received from the API
      console.error('No response received from the API:', error.request);
    } else {
      // Error setting up the request
      console.error('Error setting up request:', error.message);
    }
    console.error('Error configuration:', error.config);
    throw error;
  }
}

/**
 * Main function to execute the token launch process.
 */
async function main() {
  // Define your token parameters
  const tokenName = 'PumpFun Token';
  const tokenSymbol = 'PFT';
  const totalSupply = 1000000;  // Example total supply value
  const decimals = 18;          // Standard decimals for many tokens

  try {
    // Validate token parameters before launching
    validateTokenParameters(tokenName, tokenSymbol, totalSupply, decimals);

    // Launch the token
    const launchResult = await launchToken(tokenName, tokenSymbol, totalSupply, decimals);

    // Optionally process the launch result further
    console.log('Token launch process completed successfully.');
    if (launchResult && launchResult.token_id) {
      console.log(`Token ID: ${launchResult.token_id}`);
    } else {
      console.log('No token ID was returned from the API.');
    }
  } catch (error) {
    console.error('Token launch failed. Please review the errors above and try again.');
  }
}

// Execute the main function
main();
