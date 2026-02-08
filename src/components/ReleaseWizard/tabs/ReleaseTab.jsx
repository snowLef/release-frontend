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

export default function ReleaseTab({
                                       formData,
                                       handleChange,
                                       coverPreview,
                                       handleCoverChange,
                                       persons,
                                       handlePersonChange,
                                       addPerson,
                                       removePerson,
                                       handleVideoChange,
                                       videoFile,
                                       handleBookletChange,
                                       bookletFile
                                   }) {
    return (
        <>
            <BasicInfoSection formData={formData} handleChange={handleChange} />
            <ReleaseCover coverPreview={coverPreview} handleChange={handleCoverChange} />
            <ReleasePersons
                persons={persons}
                handlePersonChange={handlePersonChange}
                addPerson={addPerson}
                removePerson={removePerson}
            />
            <ReleaseGenre formData={formData} handleChange={handleChange} />
            <ReleaseIdentification formData={formData} handleChange={handleChange} />
            <ReleaseLabel formData={formData} handleChange={handleChange} />
            <ReleaseDates formData={formData} handleChange={handleChange} />
            <ReleasePlatforms formData={formData} handleChange={handleChange} />
            <ReleaseVideo handleVideoChange={handleVideoChange} videoFile={videoFile} />
            <ReleaseBooklet handleBookletChange={handleBookletChange} bookletFile={bookletFile} />
        </>
    );
}
