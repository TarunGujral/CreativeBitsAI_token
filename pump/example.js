/**
 * Pump.fun Token Launch and Display Script
 *
 * This script demonstrates how to launch a token via the Pump.fun API using axios,
 * and then displays the token contract address in a formatted manner.
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

// Configuration (update these values or set them in a .env file)
const API_KEY = process.env.PUMP_FUN_API_KEY || 'your_api_key_here';
const BASE_URL = process.env.PUMP_FUN_BASE_URL || 'https://api.pump.fun';
const TOKEN_LAUNCH_ENDPOINT = process.env.PUMP_FUN_TOKEN_LAUNCH_ENDPOINT || '/token/launch';

// Your token contract address (provided)
const tokenContractAddress = 'DUWAv5Y4Gp9ch3zvbRyZa4QcuowvBsyiVtsYjcUspump';

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
  const url = `${BASE_URL}${TOKEN_LAUNCH_ENDPOINT}`;

  // Prepare the payload for token launch
  const payload = {
    name: tokenName,
    symbol: tokenSymbol,
    total_supply: totalSupply,
    decimals: decimals
  };

  // Setup headers for authentication and JSON content
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
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('No response received from the API:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    console.error('Error configuration:', error.config);
    throw error;
  }
}

/**
 * Displays the token contract address in a formatted manner.
 *
 * @param {string} address - The token contract address.
 */
function displayTokenContractAddress(address) {
  console.log('\n======================================');
  console.log('           TOKEN CONTRACT ADDRESS     ');
  console.log('======================================');
  console.log(address);
  console.log('======================================\n');
}

/**
 * Main function to execute the token launch process and display the token contract address.
 */
async function main() {
  // Define your token parameters
  const tokenName = 'creative bits AI';
  const tokenSymbol = 'CBAI';
  const totalSupply = 1000000; // Example total supply
  const decimals = 18;         // Standard number of decimals

  try {
    // Validate token parameters
    validateTokenParameters(tokenName, tokenSymbol, totalSupply, decimals);

    // Launch the token via the Pump.fun API
    const launchResult = await launchToken(tokenName, tokenSymbol, totalSupply, decimals);

    // Optionally process the launch result further
    console.log('Token launch process completed successfully.');
    if (launchResult && launchResult.token_id) {
      console.log(`Token ID: ${launchResult.token_id}`);
    } else {
      console.log('No token ID was returned from the API.');
    }

    // Display the token contract address
    displayTokenContractAddress(tokenContractAddress);
  } catch (error) {
    console.error('Token launch failed. Please review the errors above and try again.');
  }
}

// Execute the main function
main();
