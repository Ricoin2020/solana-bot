import React, { useState, useEffect, useMemo } from 'react';
import {
    Connection,
    PublicKey,
    clusterApiUrl,
    Transaction,
    SystemProgram,
    LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { Button, Container, Paper, Typography } from '@mui/material';

// Initialize the program ID and network
const PROGRAM_ID = new PublicKey('GKb17PhyqakyZ6A29QRRS69vvPZuvqPPA5PKR4UyxYVx');
const NETWORK = clusterApiUrl('testnet');

function YourMainComponent() {
    const { publicKey, sendTransaction, connected } = useWallet();
    const [message, setMessage] = useState('');
    const [balance, setBalance] = useState(null);

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

    const interactWithBot = async () => {
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
    };

    return (
        <Container>
            <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
                <WalletMultiButton />
                {connected && <Typography variant="body1">Wallet Address: {publicKey.toBase58()}</Typography>}
                {connected && balance !== null && <Typography variant="body1">Balance: {balance} SOL</Typography>}
                <Button 
                    onClick={interactWithBot} 
                    disabled={!connected} 
                    variant="contained" 
                    color="primary" 
                    style={{ marginTop: '10px' }}
                >
                    Interact with Bot
                </Button>
                <Typography variant="body2" color="error">{message}</Typography>
            </Paper>
        </Container>
    );
}

const App = () => {
    const network = NETWORK;

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
        ],
        []
    );

    return (
        <ConnectionProvider endpoint={network}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <YourMainComponent />
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default App;
