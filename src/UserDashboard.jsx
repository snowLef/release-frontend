import React, { useState } from 'react';
import MyReleases from './MyReleases';
// Вставь сюда код ReleaseWizard или импортируй его, если вынес в отдельный файл.
// Для примера я предполагаю, что компонент ReleaseWizard принимает проп onSuccess
import ReleaseWizard from './ReleaseWizard';

export default function UserDashboard({ user, onLogout }) {
    const [activeTab, setActiveTab] = useState('list'); // 'list' или 'create'

    // Когда релиз создан, переключаем на вкладку списка
    const handleReleaseCreated = () => {
        setActiveTab('list');
    };

    return (
        <div className="container">
            {/* Верхняя панель */}
            <div className="top-bar">
                <div>
                    <h2>Кабинет Артиста</h2>
                    <span className="user-badge">{user.email}</span>
                </div>
                <button onClick={onLogout} className="btn-logout">Выйти</button>
            </div>

            {/* Навигация */}
            <div className="tabs-nav">
                <button
                    className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
                    onClick={() => setActiveTab('create')}
                >
                    + Создать релиз
                </button>
                <button
                    className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
                    onClick={() => setActiveTab('list')}
                >
                    Мои релизы
                </button>
            </div>

            {/* Контент */}
            <div className="tab-content">
                {activeTab === 'create' ? (
                    <ReleaseWizard onSuccess={handleReleaseCreated} /> // user не нужен
                ) : (
                    <MyReleases /> // user не нужен, MyReleases сам берет данные из токена
                )}
            </div>
        </div>
    );
}