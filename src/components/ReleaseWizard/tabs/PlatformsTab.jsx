import React from 'react';
import AdditionalPlatformSettings from '../sections/AdditionalPlatformSettings';
import PlatformSettings from '../sections/PlatformSettings';
import ITunesSettings from "../sections/ITunesSettings.jsx";

export default function PlatformsTab({ formData, handleChange, platformsData, handlePlatformChange }) {
    return (
        <>
            <AdditionalPlatformSettings
                formData={formData}
                handleChange={handleChange}
                platformsData={platformsData}
                handlePlatformChange={handlePlatformChange}
            />

            {/* Apple Music - без чекбокса и без времени */}
            {platformsData.appleMusic.enabled && (
                <PlatformSettings
                    title="Apple Music"
                    platformKey="appleMusic"
                    platformData={platformsData.appleMusic}
                    handlePlatformChange={handlePlatformChange}
                    showAvailableCheckbox={true}
                    showTime={false}  // ← без часа старта
                />
            )}

            {/* VK Music - без чекбокса, с временем */}
            {platformsData.vkMusic.enabled && (
                <PlatformSettings
                    title="VK Музыка, Одноклассники"
                    description="Определите параметры доставки на площадки VK"
                    platformKey="vkMusic"
                    platformData={platformsData.vkMusic}
                    handlePlatformChange={handlePlatformChange}
                    showAvailableCheckbox={false}
                    showTime={true}  // ← с часом старта
                />
            )}

            {/* Yandex Music - без чекбокса, с временем и upcoming */}
            {platformsData.yandexMusic.enabled && (
                <PlatformSettings
                    title="Яндекс Музыка"
                    platformKey="yandexMusic"
                    platformData={platformsData.yandexMusic}
                    handlePlatformChange={handlePlatformChange}
                    showAvailableCheckbox={false}
                    showTime={true}  // ← с часом старта
                    showUpcoming
                />
            )}

            {/* Spotify - с чекбоксом и временем */}
            {platformsData.spotify.enabled && (
                <PlatformSettings
                    title="Spotify"
                    platformKey="spotify"
                    platformData={platformsData.spotify}
                    handlePlatformChange={handlePlatformChange}
                    showAvailableCheckbox={false}
                    showTime={true}  // ← с часом старта
                />
            )}

            {/* TikTok - с чекбоксом, временем и fullVersion */}
            {platformsData.tiktok.enabled && (
                <PlatformSettings
                    title="TikTok"
                    platformKey="tiktok"
                    platformData={platformsData.tiktok}
                    handlePlatformChange={handlePlatformChange}
                    showAvailableCheckbox={false}
                    showTime={true}  // ← с часом старта
                    showFullVersion
                />
            )}

            {/* YouTube Music - с чекбоксом и временем */}
            {platformsData.youtubeMusic.enabled && (
                <PlatformSettings
                    title="YouTube Music"
                    platformKey="youtubeMusic"
                    platformData={platformsData.youtubeMusic}
                    handlePlatformChange={handlePlatformChange}
                    showAvailableCheckbox={true}
                    showTime={false}  // ← с часом старта
                />
            )}

            {/* iTunes - специальный компонент */}
            {platformsData.itunes.enabled && (
                <ITunesSettings
                    platformData={platformsData.itunes}
                    handlePlatformChange={handlePlatformChange}
                />
            )}
        </>
    );
}
