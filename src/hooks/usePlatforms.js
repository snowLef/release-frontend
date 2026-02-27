import { useState } from 'react';

export function usePlatforms() {
    const [platformsData, setPlatformsData] = useState({
        appleMusic: {
            enabled: true,
            available: false,
            startDate: '',
        },
        vkMusic: {
            enabled: true,
            available: false,
            startDate: ''
        },
        yandexMusic: {
            enabled: true,
            available: false,
            startDate: '',
            startTime: '00:00',
            upcomingRelease: false,
        },
        spotify: {
            enabled: true,
            available: false,
            startDate: '',
            startTime: '00:00',
        },
        tiktok: {
            enabled: true,
            available: false,
            startDate: '',
            startTime: '00:00',
            fullVersion: false,
        },
        youtubeMusic: {
            enabled: true,
            available: false,
            startDate: '',
        },
        itunes: {
            enabled: true,
            available: false,
            previewDisabled: false,
            startDate: '',
            releasePriceCategory: '',
            trackPriceCategory: 'mid',
            minPriceCategory: false,
            appleDigitalMasters: false,
        },
    });

    const handlePlatformChange = (platform, field, value) => {
        setPlatformsData(prev => ({
            ...prev,
            [platform]: {
                ...prev[platform],
                [field]: value,
            }
        }));
    };

    return { platformsData, handlePlatformChange, setPlatformsData };
}
