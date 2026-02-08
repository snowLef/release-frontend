import React, { useState } from 'react';
import MyReleases from '../MyReleases.jsx';
import ReleaseWizard from '../ReleaseWizard/ReleaseWizard.jsx';
import Header from '../common/Header.jsx';

export default function UserDashboard({ user, scopes, onLogout }) {
    const [activeTab, setActiveTab] = useState('list');

    const handleReleaseCreated = () => {
        setActiveTab('list');
    };

    return (
        <>
            {/* ✅ Header вне container */}
            <Header user={user} scopes={scopes} onLogout={onLogout} />

            <div className="container">
                {/* Навигация */}
                <div className="tabs-nav">
                    <button
                        className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
                        onClick={() => setActiveTab('create')}
                    >
                        ➕ Создать релиз
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
                        onClick={() => setActiveTab('list')}
                    >
                        📋 Мои релизы
                    </button>
                </div>

                {/* Контент */}
                <div className="tab-content">
                    {activeTab === 'create' ? (
                        <ReleaseWizard onSuccess={handleReleaseCreated} />
                    ) : (
                        <MyReleases key={activeTab} />
                    )}
                </div>
            </div>
        </>
    );
}
