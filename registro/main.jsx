import React from 'react';
import ReactDOM from 'react-dom/client';
import { RegistroPage } from '../src/registro/index.js';
import '../src/styles/tokens.css';
import '../src/styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RegistroPage />
  </React.StrictMode>,
);
