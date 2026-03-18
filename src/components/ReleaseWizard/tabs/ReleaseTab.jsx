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
import ReleaseComment from '../sections/ReleaseComment.jsx';

export default function ReleaseTab() {
    return (
        <>
            <BasicInfoSection />
            <ReleasePersons />
            <ReleaseGenre />
            <ReleaseTracks />
            <ReleaseCover />
            <ReleaseLyrics />
            <ReleaseLabel />
            <ReleaseDates />
            <ReleasePlatforms />
            <AdditionalPlatformSettings />
            <ReleaseComment />
        </>
    );
}
