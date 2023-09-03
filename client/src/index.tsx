import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from '@mui/material';
import { theme } from './core/theme';
import { BrowserRouter } from 'react-router-dom';
import App from './pages/app/app';
import { restoreSession } from './lib/login';


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
require('./core/firebase');
require('./core/i18next');
restoreSession();
root.render(
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
