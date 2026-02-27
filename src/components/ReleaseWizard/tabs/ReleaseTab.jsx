import React from 'react';
import BasicInfoSection from '../sections/BasicInfoSection.jsx';
import ReleaseCover from '../sections/ReleaseCover.jsx';
import ReleasePersons from '../sections/ReleasePersons.jsx';
import ReleaseGenre from '../sections/ReleaseGenre.jsx';
import ReleaseIdentification from '../sections/ReleaseIdentification.jsx';
import ReleaseLabel from '../sections/ReleaseLabel.jsx';
import ReleaseDates from '../sections/ReleaseDates.jsx';
import ReleasePlatforms from '../sections/ReleasePlatforms.jsx';
import ReleaseVideo from '../sections/ReleaseVideo.jsx';
import ReleaseBooklet from '../sections/ReleaseBooklet.jsx';

export default function ReleaseTab() {
    return (
        <>
            <BasicInfoSection />
            <ReleaseCover />
            <ReleasePersons />
            <ReleaseGenre />
            <ReleaseIdentification />
            <ReleaseLabel />
            <ReleaseDates />
            <ReleasePlatforms />
            <ReleaseVideo />
            <ReleaseBooklet />
        </>
    );
}
