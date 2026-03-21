import React from 'react';
import { useWizard } from '../../../contexts/WizardContext';
import TrackCard from './TrackCard';

export default function TrackSection() {
    const { tracks, addTrack, removeTrack, maxTracks, formData } = useWizard();
    const isMulti = formData.releaseType !== 'Single';
    const canAddMore = tracks.length < maxTracks;

    return (
        <div className="form-card">
            <div className="card-header">
                <h2 className="card-title">Треки</h2>
                <p className="card-description">
                    {isMulti
                        ? `Загрузите треки для вашего ${formData.releaseType}. Максимум ${maxTracks} треков.`
                        : 'Загрузите аудио файл трека в формате WAV или FLAC'}
                </p>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {tracks.map((track, index) => (
                    <TrackCard
                        key={track.id}
                        track={track}
                        index={index}
                        canRemove={isMulti && tracks.length > 1}
                        onRemove={() => removeTrack(track.id)}
                    />
                ))}
                {isMulti && canAddMore && (
                    <button
                        type="button"
                        onClick={addTrack}
                        className="btn-secondary"
                    >
                        + Добавить трек
                    </button>
                )}
            </div>
        </div>
    );
}
