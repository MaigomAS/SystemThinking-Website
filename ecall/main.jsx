import React from 'react';
import ReactDOM from 'react-dom/client';
import ECallPage from '../src/ecall/ECallPage.jsx';
import '../src/styles/tokens.css';
import '../src/styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ECallPage />
  </React.StrictMode>,
);
