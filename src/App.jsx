import { useLogto } from '@logto/react';
import { useState, useEffect } from 'react';

import Callback from './Callback';
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';

function App() {
    const [user, setUser] = useState(null);
    const [roles, setRoles] = useState([]);

    const {
        isAuthenticated,
        isLoading,
        signIn,
        signOut,
        getIdTokenClaims,
    } = useLogto();

    const handleLogout = () => {
        signOut('http://localhost:5173');
    };

    /**
     * Загружаем данные пользователя (ID Token)
     * roles, email, sub и т.д.
     */
    useEffect(() => {
        if (!isAuthenticated || isLoading) return;

        // Проверяем ДО вызова async функции
        if (user?.id) return; // Если пользователь уже загружен, выходим

        const loadUser = async () => {
            const claims = await getIdTokenClaims();

            setRoles(claims?.roles ?? []);
            setUser({
                id: claims.sub,
                email: claims.email,
            });

            console.log('ID Token claims:', claims);
        };

        loadUser();
    }, [isAuthenticated, isLoading, user, getIdTokenClaims]);

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
     * Ждём, пока загрузятся claims
     */
    if (!user) {
        return (
            <div className="container">
                <h2>Загрузка данных пользователя…</h2>
            </div>
        );
    }

    /**
     * Роутинг по ролям
     */
    if (roles.includes('admin')) {
        return <AdminDashboard user={user} onLogout={handleLogout} />;
    }

    return <UserDashboard user={user} onLogout={handleLogout} />;
}

export default App;
