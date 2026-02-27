// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { LogtoProvider } from '@logto/react';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import './styles/App.css';
import './styles/index.css';
import './styles/components/platforms.css';

const config = {
    endpoint: 'https://ruhxnl.logto.app/', // Проверь этот URL в консоли Logto!
    appId: 'acojh09ckmpo5pm2j0wvw', // Замени на реальный ID из Logto
    resources: ['http://localhost:8080'], // Твой API Identifier
    scopes: ['read:releases', 'api:admin'], // 'roles' для ID токена, 'read:releases' для Access Token
};

ReactDOM.createRoot(document.getElementById('root')).render(
    <LogtoProvider config={config}>
        <App />
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 4000,
                style: {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.9rem',
                },
                success: {
                    style: { background: '#1F4568', color: '#F5F1E8' },
                    iconTheme: { primary: '#F5F1E8', secondary: '#1F4568' },
                },
                error: {
                    style: { background: '#D14532', color: '#F5F1E8' },
                    iconTheme: { primary: '#F5F1E8', secondary: '#D14532' },
                },
            }}
        />
    </LogtoProvider>
);