import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import WalletContextProvider from './wallet';
import '@solana/wallet-adapter-react-ui/styles.css';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <WalletContextProvider>
        <App />
      </WalletContextProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
