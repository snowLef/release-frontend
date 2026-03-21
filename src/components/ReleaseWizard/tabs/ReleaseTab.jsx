import React from 'react';
import BasicInfoSection from '../sections/BasicInfoSection.jsx';
import ReleaseCover from '../sections/ReleaseCover.jsx';
import ReleaseGenre from '../sections/ReleaseGenre.jsx';
import ReleaseLabel from '../sections/ReleaseLabel.jsx';
import ReleaseDates from '../sections/ReleaseDates.jsx';
import ReleasePlatforms from '../sections/ReleasePlatforms.jsx';
import TrackSection from '../sections/TrackSection.jsx';
import AdditionalPlatformSettings from '../sections/AdditionalPlatformSettings.jsx';
import ReleaseComment from '../sections/ReleaseComment.jsx';

export default function ReleaseTab() {
    return (
        <>
            <BasicInfoSection />
            <ReleaseCover />
            <ReleaseGenre />
            <ReleaseLabel />

            <TrackSection />

            <ReleaseDates />
            <ReleasePlatforms />
            <AdditionalPlatformSettings />
            <ReleaseComment />
        </>
    );
}
