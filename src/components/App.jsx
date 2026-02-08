import { useLogto } from '@logto/react';
import { useState, useEffect, useRef } from 'react';

import Callback from './Callback.jsx';
import UserDashboard from './UserDashboard.jsx';
import AdminDashboard from './AdminDashboard.jsx';

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
        signOut('http://localhost:5173');
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
                const accessToken = await getAccessToken('http://localhost:8080');

                // Декодируем Access Token чтобы получить scopes
                const tokenParts = accessToken.split('.');
                const payload = JSON.parse(atob(tokenParts[1]));

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

    /**
     * Инициализация SDK
     */
    if (isLoading) {
        return (
            <div className="container">
                <h2>Загрузка…</h2>
            </div>
        );
    }

    /**
     * Не авторизован
     */
    if (!isAuthenticated) {
        return (
            <div
                className="container"
                style={{ textAlign: 'center', marginTop: '100px' }}
            >
                <h1>Bomjegrom Production</h1>
                <button
                    className="btn-primary"
                    onClick={() => signIn('http://localhost:5173/callback')}
                >
                    Войти через Logto
                </button>
            </div>
        );
    }

    /**
     * Ждём, пока загрузятся данные
     */
    if (!user) {
        return (
            <div className="container">
                <h2>Загрузка данных пользователя…</h2>
            </div>
        );
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
