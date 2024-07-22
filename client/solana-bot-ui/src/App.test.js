import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from './App';
import { Connection, PublicKey, Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

// Mocking solana/web3.js methods
jest.mock('@solana/web3.js', () => {
    const actual = jest.requireActual('@solana/web3.js');
    return {
        ...actual,
        Connection: jest.fn().mockImplementation(() => ({
            requestAirdrop: jest.fn(() => Promise.resolve('airdropSignature')),
            confirmTransaction: jest.fn(() => Promise.resolve({})),
            sendTransaction: jest.fn(() => Promise.resolve('transactionSignature')),
        })),
        PublicKey: jest.fn().mockImplementation((key) => ({
            toString: () => key,
        })),
        Keypair: {
            generate: jest.fn(() => ({
                publicKey: {
                    toString: () => 'mockPublicKey',
                },
                secretKey: new Uint8Array(64), // Mock secret key as a Uint8Array
            })),
        },
        SystemProgram: {
            transfer: jest.fn(() => ({ type: 'transfer', params: {} })),
        },
        Transaction: jest.fn().mockImplementation(() => ({
            add: jest.fn().mockReturnThis(),
        })),
        LAMPORTS_PER_SOL: actual.LAMPORTS_PER_SOL,
    };
});

beforeEach(() => {
    process.env.REACT_APP_PROGRAM_ID = 'mockProgramId'; // Set a mock program ID for tests
});

afterEach(() => {
    delete process.env.REACT_APP_PROGRAM_ID; // Clean up environment variable after each test
});

test('renders Interact with Bot button', () => {
    render(<App />);
    const buttonElement = screen.getByText(/Interact with Bot/i);
    expect(buttonElement).toBeInTheDocument();
});

test('interacts with bot and shows success message', async () => {
    render(<App />);
    const buttonElement = screen.getByText(/Interact with Bot/i);

    // Simulate button click
    fireEvent.click(buttonElement);

    // Check for success message
    await waitFor(() => {
        const messageElement = screen.getByText((content, element) => content.includes('Transaction successful with signature'));
        expect(messageElement).toBeInTheDocument();
    });
});

test('shows error message when PROGRAM_ID is not defined', async () => {
    delete process.env.REACT_APP_PROGRAM_ID; // Ensure PROGRAM_ID is undefined
    render(<App />);
    const buttonElement = screen.getByText(/Interact with Bot/i);

    // Simulate button click
    fireEvent.click(buttonElement);

    // Check for error message
    await waitFor(() => {
        const messageElement = screen.getByText((content, element) => content.includes('PROGRAM_ID is not defined'));
        expect(messageElement).toBeInTheDocument();
    });
});
