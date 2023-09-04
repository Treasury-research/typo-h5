import { Wallet } from 'ethers';
import fetch, { Headers } from 'node-fetch';
import { describe, test, expect } from '@jest/globals';

describe('Backend API', () => {
  test('api should properly register new wallet', async () => {
    // Generate a new random wallet
    const wallet = Wallet.createRandom();

    const TEST_MESSAGE = 'testing'

    // Prepare the data to be sent
    const data = {
      email: `${wallet.address}@gmail.com`,
      wallet_address: wallet.address,
      message: TEST_MESSAGE,
      signature: await wallet.signMessage(TEST_MESSAGE),
    };

    // Set the endpoint to send the POST request
    const url = 'http://localhost:8080/api/users/register';

    // Configure the headers for the POST request
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    // Send the POST request with the wallet data
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    });



    // Check if the response is ok
    expect(response.ok).toBe(true);

    // Parse the response data
    const result:any = await response.json();
    // Check if the result contains the expected data
    expect(result).toHaveProperty('wallet_address');
    expect(result.wallet_address).toEqual(wallet.address);
    // Check if the result contains the expected data
    expect(result).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        email: expect.any(String),
        wallet_address: wallet.address,
        is_verified: expect.any(Boolean),
        created_at: expect.any(String),
        updated_at: expect.any(String),
      }),
);

  });
});