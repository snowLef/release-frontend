import React from 'react';
import { WizardProvider, useWizard } from '../../contexts/WizardContext';
import ReleaseTab from './tabs/ReleaseTab';
import TracklistTab from './tabs/TracklistTab';
import PlatformsTab from './tabs/PlatformsTab';
import ReviewTab from './tabs/ReviewTab';
import WizardNavigation from './WizardNavigation.jsx';

function WizardContent() {
    const { tabs, activeTab, setActiveTab, currentTabIndex, nextTab, prevTab, loading, handleSubmit } = useWizard();

    return (
        <div className="release-wizard-scroll">
            <div className="page-title-section">
                <h1 className="page-title">Работа с релизом</h1>
                <p className="page-subtitle">Заполните общую информацию по релизу</p>
            </div>

            <div className="wizard-tabs">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        type="button"
                        className={`wizard-tab ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab === 'release' && 'Релиз'}
                        {tab === 'tracklist' && 'Трек-лист'}
                        {tab === 'platforms' && 'Площадки'}
                        {tab === 'review' && 'Проверка'}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="release-form-long">
                {activeTab === 'release' && <ReleaseTab />}
                {activeTab === 'tracklist' && <TracklistTab />}
                {activeTab === 'platforms' && <PlatformsTab />}
                {activeTab === 'review' && <ReviewTab />}

                <WizardNavigation
                    currentTabIndex={currentTabIndex}
                    tabsLength={tabs.length}
                    prevTab={prevTab}
                    nextTab={nextTab}
                    loading={loading}
                />

                {activeTab === 'review' && (
                    <p className="submit-hint" style={{ textAlign: 'center', marginTop: '1rem' }}>
                        После отправки релиз будет проверен модератором в течение 24-48 часов
                    </p>
                )}
            </form>
        </div>
    );
}

export default function ReleaseWizard({ onSuccess }) {
    return (
        <WizardProvider onSuccess={onSuccess}>
            <WizardContent />
        </WizardProvider>
    );
}
