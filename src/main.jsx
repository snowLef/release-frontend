// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { LogtoProvider } from '@logto/react';
import App from './App';
import './index.css';

const config = {
    endpoint: 'https://ruhxnl.logto.app/', // Проверь этот URL в консоли Logto!
    appId: 'acojh09ckmpo5pm2j0wvw', // Замени на реальный ID из Logto
    resources: ['https://ruhxnl.logto.app/api'], // Твой API Identifier
    scopes: ['roles', 'read:releases'], // 'roles' для ID токена, 'read:releases' для Access Token
};

ReactDOM.createRoot(document.getElementById('root')).render(
    <LogtoProvider config={config}>
        <App />
    </LogtoProvider>
);