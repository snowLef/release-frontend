import React from 'react';
import { WizardProvider, useWizard } from '../../contexts/WizardContext';
import ReleaseTab from './tabs/ReleaseTab';
import ReviewTab from './tabs/ReviewTab';
import WizardNavigation from './WizardNavigation.jsx';

function WizardContent() {
    const { tabs, activeTab, setActiveTab, currentTabIndex, nextTab, prevTab, loading, handleSubmit, termsAccepted } = useWizard();

    const tabLabels = {
        release: 'Релиз',
        review: 'Проверка',
    };

    return (
        <div className="release-wizard-scroll">
            <div className="wizard-layout">
                <aside className="wizard-sidebar">
                    <nav className="wizard-tabs">
                        {tabs.map((tab, index) => (
                            <button
                                key={tab}
                                type="button"
                                className={`wizard-tab ${activeTab === tab ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                <span className="wizard-tab-num">{index + 1}</span>
                                {tabLabels[tab]}
                            </button>
                        ))}
                    </nav>
                </aside>

                <div className="wizard-main">
                    <div className="page-title-section">
                        <h1 className="page-title">Новый релиз</h1>
                    </div>
                    <form onSubmit={handleSubmit} className="release-form-long">
                        {activeTab === 'release' && <ReleaseTab />}
                        {activeTab === 'review' && <ReviewTab />}

                        <WizardNavigation
                            currentTabIndex={currentTabIndex}
                            tabsLength={tabs.length}
                            prevTab={prevTab}
                            nextTab={nextTab}
                            loading={loading}
                            termsAccepted={termsAccepted}
                        />

                        {activeTab === 'review' && (
                            <p className="submit-hint" style={{ textAlign: 'center', marginTop: '1rem' }}>
                                После отправки релиз будет проверен модератором в течение 24-48 часов
                            </p>
                        )}
                    </form>
                </div>
            </div>
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
