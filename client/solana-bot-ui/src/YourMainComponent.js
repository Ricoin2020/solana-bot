// Import necessary modules and components
import React, { useState, useEffect, useCallback } from 'react';
import {
  Connection,
  PublicKey,
  clusterApiUrl,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import { useWallet, WalletMultiButton } from '@solana/wallet-adapter-react';
import { Container, Box, Typography, Button, Card, CardContent } from '@mui/material';

// Constants for Solana program and network
const PROGRAM_ID = new PublicKey('GKb17PhyqakyZ6A29QRRS69vvPZuvqPPA5PKR4UyxYVx');
const NETWORK = clusterApiUrl('testnet');

const YourMainComponent = () => {
  const { publicKey, sendTransaction, connected } = useWallet();
  const [message, setMessage] = useState('');
  const [balance, setBalance] = useState(null);

  // Fetch balance when publicKey changes
  useEffect(() => {
    const getBalance = async () => {
      if (publicKey) {
        const connection = new Connection(NETWORK, 'confirmed');
        const balance = await connection.getBalance(publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      }
    };

    getBalance();
  }, [publicKey]);

  // Function to interact with the bot
  const interactWithBot = useCallback(async () => {
    try {
      if (!connected) {
        const errorMsg = 'Wallet not connected';
        setMessage(errorMsg);
        console.error(errorMsg);
        return;
      }

      const connection = new Connection(NETWORK, 'confirmed');

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: PROGRAM_ID,
          lamports: 1000,
        })
      );

      console.log('Sending transaction...');
      const signature = await sendTransaction(transaction, connection);

      await connection.confirmTransaction(signature, 'confirmed');
      console.log('Transaction confirmed, signature:', signature);

      setMessage(`Transaction successful with signature: ${signature}`);
      setBalance(await connection.getBalance(publicKey) / LAMPORTS_PER_SOL);
    } catch (error) {
      console.error('Error interacting with bot:', error);
      setMessage('Error interacting with bot: ' + error.message);
    }
  }, [publicKey, sendTransaction, connected]);

  // Render component
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          bgcolor: 'background.paper',
          boxShadow: 1,
          borderRadius: 2,
          p: 2,
          minWidth: 300,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Interact with Bot
        </Typography>
        <WalletMultiButton />
        {connected && (
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Wallet Address: {publicKey.toBase58()}
              </Typography>
              {balance !== null && (
                <Typography variant="body2" color="text.secondary">
                  Balance: {balance} SOL
                </Typography>
              )}
            </CardContent>
          </Card>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={interactWithBot}
          disabled={!connected}
          sx={{ mt: 2 }}
        >
          Interact with Bot
        </Button>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {message}
        </Typography>
      </Box>
    </Container>
  );
};

export default YourMainComponent;
