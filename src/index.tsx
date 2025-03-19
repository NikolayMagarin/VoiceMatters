import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, defaultAuthProviderValue } from './lib/auth';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <AuthProvider value={defaultAuthProviderValue}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>
);
