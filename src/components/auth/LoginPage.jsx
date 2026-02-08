// src/LoginPage.jsx
import React, { useState } from 'react';
import '../../styles/App.css'; // Используем те же стили

export default function LoginPage({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // // Эмуляция входа
    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     if(email && password) {
    //         // Здесь в будущем будет запрос к Supabase/Firebase
    //         onLogin({ name: 'Artist', email });
    //     }
    // };

    const handleSubmit = (e) => {
        e.preventDefault();
        if(email && password) {
            // ПРОСТАЯ ЛОГИКА ДЛЯ ТЕСТА:
            // Если в email есть "admin", то роль = admin. Иначе = user.
            const role = email.toLowerCase().includes('admin') ? 'admin' : 'user';

            // Передаем объект пользователя наверх
            onLogin({
                name: role === 'admin' ? 'Администратор' : 'Артист',
                email,
                role
            });
        }
    };

    const handleSocialLogin = (provider) => {
        alert(`Логика входа через ${provider} (требует настройки Backend)`);
        // Для демо пускаем сразу
        onLogin({ name: 'Social User', email: 'social@test.com' });
    };

    return (
        <div className="login-container fade-in">
            <div className="login-card">
                <h1>Вход в кабинет</h1>
                <p className="subtitle">Управляйте своими релизами в одном месте</p>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            className="input-field"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Пароль</label>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary">Войти</button>
                </form>

                <div className="divider">
                    <span>или через соцсети</span>
                </div>

                <div className="social-buttons">
                    <button
                        className="social-btn vk"
                        onClick={() => handleSocialLogin('VK')}
                    >
                        VK ID
                    </button>
                    <button
                        className="social-btn telegram"
                        onClick={() => handleSocialLogin('Telegram')}
                    >
                        Telegram
                    </button>
                    <button
                        className="social-btn apple"
                        onClick={() => handleSocialLogin('Apple')}
                    >
                        Apple
                    </button>
                </div>
            </div>
        </div>
    );
}