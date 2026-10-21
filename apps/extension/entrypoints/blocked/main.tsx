import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '../../assets/main.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Missing #root element in blocked-page HTML');

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
