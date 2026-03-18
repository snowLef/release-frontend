import React from 'react';
import BasicInfoSection from '../sections/BasicInfoSection.jsx';
import ReleaseCover from '../sections/ReleaseCover.jsx';
import ReleasePersons from '../sections/ReleasePersons.jsx';
import ReleaseGenre from '../sections/ReleaseGenre.jsx';
import ReleaseLabel from '../sections/ReleaseLabel.jsx';
import ReleaseDates from '../sections/ReleaseDates.jsx';
import ReleasePlatforms from '../sections/ReleasePlatforms.jsx';
import ReleaseTracks from '../sections/ReleaseTracks.jsx';
import ReleaseLyrics from '../sections/ReleaseLyrics.jsx';
import AdditionalPlatformSettings from '../sections/AdditionalPlatformSettings.jsx';
import PlatformSettings from '../sections/PlatformSettings.jsx';
import ITunesSettings from '../sections/ITunesSettings.jsx';
import { useWizard } from '../../../contexts/WizardContext';
// import ReleaseVideo from '../sections/ReleaseVideo.jsx';
// import ReleaseBooklet from '../sections/ReleaseBooklet.jsx';

export default function ReleaseTab() {
    const { platformsData } = useWizard();

    return (
        <>
            <BasicInfoSection />
            <ReleasePersons />
            <ReleaseGenre />
            <ReleaseTracks />
            <ReleaseLyrics />
            <ReleaseCover />
            <ReleaseLabel />
            <ReleaseDates />
            <ReleasePlatforms />

            <AdditionalPlatformSettings />

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
                    showDate={false}
                    showTime={false}
                />
            )}

            {platformsData.itunes.enabled && (
                <ITunesSettings platformData={platformsData.itunes} />
            )}
        </>
    );
}
