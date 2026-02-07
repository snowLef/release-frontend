import React, { useState } from 'react';
import MyReleases from './MyReleases';
import ReleaseWizard from './ReleaseWizard';

export default function UserDashboard({ user, onLogout }) {
    const [activeTab, setActiveTab] = useState('list');

    console.log('🎨 UserDashboard рендер, activeTab:', activeTab);

    const handleReleaseCreated = () => {
        console.log('✅ Релиз создан, переключаем на list');
        setActiveTab('list');
    };

    return (
        <div className="container">
            <div className="top-bar">
                <div>
                    <h2>Кабинет Артиста</h2>
                    <span className="user-badge">{user.email}</span>
                </div>
                <button onClick={onLogout} className="btn-logout">Выйти</button>
            </div>

            <div className="tabs-nav">
                <button
                    className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
                    onClick={() => {
                        console.log('🔘 Клик на "Создать релиз"');
                        setActiveTab('create');
                    }}
                >
                    + Создать релиз
                </button>
                <button
                    className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
                    onClick={() => {
                        console.log('🔘 Клик на "Мои релизы"');
                        setActiveTab('list');
                    }}
                >
                    Мои релизы
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'create' ? (
                    <ReleaseWizard onSuccess={handleReleaseCreated} />
                ) : (
                    <MyReleases key={activeTab} />
                )}
            </div>
        </div>
    );
}
