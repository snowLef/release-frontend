import { useLogto } from '@logto/react';
import { useState, useEffect, useRef } from 'react';

import { API_BASE_URL, LOGTO_RESOURCE } from './services/api.js';
import Callback from './components/auth/Callback.jsx';
import UserDashboard from './components/dashboard/UserDashboard.jsx';
import AdminDashboard from './components/dashboard/AdminDashboard.jsx';
import PaymentReturn from './components/PaymentReturn.jsx';

function App() {
    const [user, setUser] = useState(null);
    const [scopes, setScopes] = useState([]); // ✅ Теперь scopes вместо roles
    const loadedUserRef = useRef(false);

    const {
        isAuthenticated,
        isLoading,
        signIn,
        signOut,
        getIdTokenClaims,
        getAccessToken, // ✅ Добавляем для получения Access Token
    } = useLogto();

    const handleLogout = () => {
        signOut(import.meta.env.VITE_APP_URL);
    };

    /**
     * ✅ Загружаем данные пользователя и scopes
     */
    useEffect(() => {
        if (!isAuthenticated || isLoading || loadedUserRef.current) return;

        const loadUser = async () => {
            try {
                // Получаем ID Token claims (для email, sub)
                const idClaims = await getIdTokenClaims();

                // Получаем Access Token (там есть scopes)
                const accessToken = await getAccessToken(LOGTO_RESOURCE);

                // Декодируем Access Token чтобы получить scopes
                const tokenParts = accessToken.split('.');
                if (tokenParts.length !== 3) throw new Error('Invalid JWT structure');
                const base64url = tokenParts[1].replace(/-/g, '+').replace(/_/g, '/');
                const padded = base64url.padEnd(base64url.length + (4 - base64url.length % 4) % 4, '=');
                const payload = JSON.parse(atob(padded));

                console.log('ID Token claims:', idClaims);
                console.log('Access Token payload:', payload);
                console.log('Scopes:', payload.scope);

                // Scopes обычно приходят строкой через пробел: "read:releases api:admin"
                const userScopes = payload.scope ? payload.scope.split(' ') : [];

                setScopes(userScopes);
                setUser({
                    id: idClaims.sub,
                    email: idClaims.email,
                });

                loadedUserRef.current = true;

                // Проверяем, является ли пользователь админом
                const isAdmin = userScopes.includes('api:admin');
                console.log('Is Admin:', isAdmin);
                console.log('User Scopes:', userScopes);

            } catch (error) {
                console.error('Ошибка загрузки пользователя:', error);
            }
        };

        loadUser();
    }, [isAuthenticated, isLoading, getIdTokenClaims, getAccessToken]);

    /**
     * Callback от Logto
     */
    if (window.location.pathname === '/callback') {
        return <Callback />;
    }

    if (window.location.pathname === '/payment-return') {
        return <PaymentReturn />;
    }

    /**
     * Инициализация SDK
     */
    if (isLoading) {
        return null;
    }

    /**
     * Не авторизован — сразу редиректим на страницу входа
     */
    if (!isAuthenticated) {
        signIn(`${import.meta.env.VITE_APP_URL}/callback`);
        return null;
    }

    /**
     * Ждём, пока загрузятся данные
     */
    if (!user) {
        return null;
    }

    /**
     * ✅ Роутинг по scopes (проверяем api:admin)
     */
    const isAdmin = scopes.includes('api:admin');

    if (isAdmin) {
        return <AdminDashboard user={user} scopes={scopes} onLogout={handleLogout} />;
    }

    return <UserDashboard user={user} scopes={scopes} onLogout={handleLogout} />;
}

export default App;
