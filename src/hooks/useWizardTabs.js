import { useState } from 'react';

export function useWizardTabs(initialTab = 'release') {
    const tabs = ['release', 'tracklist', 'platforms', 'review'];
    const [activeTab, setActiveTab] = useState(initialTab);
    const currentTabIndex = tabs.indexOf(activeTab);

    const nextTab = () => {
        if (currentTabIndex < tabs.length - 1) {
            setActiveTab(tabs[currentTabIndex + 1]);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const prevTab = () => {
        if (currentTabIndex > 0) {
            setActiveTab(tabs[currentTabIndex - 1]);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return {
        tabs,
        activeTab,
        currentTabIndex,
        setActiveTab,
        nextTab,
        prevTab
    };
}
