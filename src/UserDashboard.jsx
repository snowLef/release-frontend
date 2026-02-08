import React, { useState } from 'react';
import MyReleases from './MyReleases';
import ReleaseWizard from './ReleaseWizard';
import Header from './Header';

export default function UserDashboard({ user, scopes, onLogout }) {
    const [activeTab, setActiveTab] = useState('list');

    const handleReleaseCreated = () => {
        setActiveTab('list');
    };

    return (
        <div className="container">
            <Header user={user} scopes={scopes} onLogout={onLogout} />

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

            <div className="tab-content" style={{paddingTop: '1rem'}}>
                {activeTab === 'create' ? (
                    <ReleaseWizard onSuccess={handleReleaseCreated} />
                ) : (
                    <MyReleases key={activeTab} />
                )}
            </div>
        </div>
    );
}
