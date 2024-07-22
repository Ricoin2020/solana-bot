import React, { createContext, useContext, useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null);

  const connectWallet = async () => {
    const connection = new Connection('https://api.devnet.solana.com');
    const publicKey = new PublicKey('GKb17PhyqakyZ6A29QRRS69vvPZuvqPPA5PKR4UyxYVx');
    setWallet({ connection, publicKey });
  };

  return (
    <WalletContext.Provider value={{ wallet, connectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  return useContext(WalletContext);
};
