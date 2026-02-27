import React from "react";
import ReleaseTracks from "../sections/ReleaseTracks.jsx";

export default function TracklistTab({
                                         trackFiles,
                                         removeTrack,
                                         noAudioFiles,
                                         handleFileChange,
                                         setNoAudioFiles,
                                         setTrackFiles
                                   }) {
    return (
        <>
            <ReleaseTracks
                trackFiles={trackFiles}
                removeTrack={removeTrack}
                noAudioFiles={noAudioFiles}
                handleFileChange={handleFileChange}
                setNoAudioFiles={setNoAudioFiles}
                setTrackFiles={setTrackFiles}
            />
        </>
    );
}