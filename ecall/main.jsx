import React from 'react';
import ReactDOM from 'react-dom/client';

// Importar estilos globales del proyecto
import '../src/styles/global.css';

// Página E-Call
import ECallPage from '../src/ecall/ECallPage.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ECallPage />
  </React.StrictMode>
);