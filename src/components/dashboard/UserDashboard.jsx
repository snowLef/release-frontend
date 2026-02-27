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
            <Header user={user} scopes={scopes} onLogout={onLogout} activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="container">
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
