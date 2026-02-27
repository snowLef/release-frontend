import React from 'react';
import { useWizard } from '../../../contexts/WizardContext';
import AdditionalPlatformSettings from '../sections/AdditionalPlatformSettings';
import PlatformSettings from '../sections/PlatformSettings';
import ITunesSettings from '../sections/ITunesSettings.jsx';

export default function PlatformsTab() {
    const { platformsData } = useWizard();

    return (
        <>
            <AdditionalPlatformSettings />

            {platformsData.appleMusic.enabled && (
                <PlatformSettings
                    title="Apple Music"
                    platformKey="appleMusic"
                    platformData={platformsData.appleMusic}
                    showAvailableCheckbox={true}
                    showTime={false}
                />
            )}

            {platformsData.vkMusic.enabled && (
                <PlatformSettings
                    title="VK Музыка, Одноклассники"
                    description="Определите параметры доставки на площадки VK"
                    platformKey="vkMusic"
                    platformData={platformsData.vkMusic}
                    showAvailableCheckbox={false}
                    showTime={true}
                />
            )}

            {platformsData.yandexMusic.enabled && (
                <PlatformSettings
                    title="Яндекс Музыка"
                    platformKey="yandexMusic"
                    platformData={platformsData.yandexMusic}
                    showAvailableCheckbox={false}
                    showTime={true}
                    showUpcoming
                />
            )}

            {platformsData.spotify.enabled && (
                <PlatformSettings
                    title="Spotify"
                    platformKey="spotify"
                    platformData={platformsData.spotify}
                    showAvailableCheckbox={false}
                    showTime={true}
                />
            )}

            {platformsData.tiktok.enabled && (
                <PlatformSettings
                    title="TikTok"
                    platformKey="tiktok"
                    platformData={platformsData.tiktok}
                    showAvailableCheckbox={false}
                    showTime={true}
                    showFullVersion
                />
            )}

            {platformsData.youtubeMusic.enabled && (
                <PlatformSettings
                    title="YouTube Music"
                    platformKey="youtubeMusic"
                    platformData={platformsData.youtubeMusic}
                    showAvailableCheckbox={true}
                    showTime={false}
                />
            )}

            {platformsData.itunes.enabled && (
                <ITunesSettings platformData={platformsData.itunes} />
            )}
        </>
    );
}
