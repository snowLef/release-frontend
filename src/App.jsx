import { useLogto } from '@logto/react';
import Callback from './Callback';
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard'; // Не забудьте импорт!
import { useState, useEffect } from 'react';

function App() {
    const [user, setUser] = useState(null);
    const [roles, setRoles] = useState([]);
    // Достаем метод signOut из хука
    const { isAuthenticated, isLoading, signIn, signOut, getIdTokenClaims } = useLogto();

    const handleLogout = () => {
        // signOut принимает URL, на который нужно вернуть пользователя после выхода
        // Этот URL должен быть добавлен в "Post Logout Redirect URIs" в консоли Logto!
        signOut('http://localhost:5173');
    };

    useEffect(() => {
        if (isAuthenticated) {
            // Мы уже знаем, что getIdTokenClaims работает!
            getIdTokenClaims().then(claims => {
                setRoles(claims?.roles || []);
                // Используем данные из claims вместо fetchUserInfo, чтобы не плодить запросы
                setUser({
                    email: claims.email,
                    id: claims.sub
                });
            }).catch(e => console.error("Ошибка claims:", e));
        }
    }, [isAuthenticated, getIdTokenClaims]);

    useEffect(() => {
        const loadUserData = async () => {
            if (isAuthenticated) {
                const claims = await getIdTokenClaims();
                console.log("Мои Claims из ID Token:", claims); // СМОТРИ СЮДА В КОНСОЛИ
                setRoles(claims?.roles || []);
                // ...
            }
        };
        loadUserData();
    }, [isAuthenticated]);

    // 1. Обработка Callback
    if (window.location.pathname === '/callback') {
        return <Callback />;
    }

    // 2. Первоначальная загрузка SDK
    if (isLoading) {
        return <div className="container"><h2>Загрузка...</h2></div>;
    }

    // 3. Если не авторизован
    if (!isAuthenticated) {
        return (
            <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>
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

    // 4. Ждем, пока загрузится объект user (теперь он обновится в useEffect)
    if (!user && isAuthenticated) {
        return <div className="container"><h2>Загрузка данных...</h2></div>;
    }

    // 5. Логика отображения дашбордов в зависимости от ролей
    if (roles.includes('admin')) {
        return <AdminDashboard user={user} onLogout={() => window.location.assign('/')} />;
    }

    if (roles.includes('admin')) {
        return <AdminDashboard user={user} onLogout={handleLogout} />;
    }

    // По умолчанию - обычный пользователь
    return <UserDashboard user={user} onLogout={handleLogout} />;
}

export default App;