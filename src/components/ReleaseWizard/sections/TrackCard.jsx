import React from 'react';
import { useWizard } from '../../../contexts/WizardContext';

export default function TrackCard({ track, index, canRemove, onRemove }) {
    const {
        updateTrackField, updateTrackFile, toggleTrack,
        addPerson, removePerson, updatePerson,
        addLyricist, removeLyricist, updateLyricist,
        addComposer, removeComposer, updateComposer,
    } = useWizard();

    const handleFileDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer?.files?.[0];
        if (file) updateTrackFile(track.id, file);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) updateTrackFile(track.id, file);
        e.target.value = '';
    };

    return (
        <div style={{
            border: '1px solid var(--border, #ddd)',
            borderRadius: '8px',
            overflow: 'hidden',
            background: 'var(--color-background, #F5F1E8)',
        }}>
            {/* Header */}
            <div
                onClick={() => toggleTrack(track.id)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    cursor: 'pointer',
                    userSelect: 'none',
                    background: 'var(--card-header-bg, rgba(0,0,0,0.03))',
                }}
            >
                <span style={{ fontWeight: 600, minWidth: 'fit-content' }}>
                    Трек {index + 1}
                </span>
                {track.title && (
                    <span style={{ color: 'var(--text-secondary, #666)', fontSize: '0.9rem' }}>
                        — {track.title}
                    </span>
                )}
                {track.file && (
                    <span style={{
                        fontSize: '0.75rem',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: 'var(--color-accent, #D14532)',
                        color: '#fff',
                        marginLeft: '0.25rem',
                    }}>
                        {track.file.name.split('.').pop().toUpperCase()}
                    </span>
                )}
                <span style={{ marginLeft: 'auto', fontSize: '0.8rem' }}>
                    {track.expanded ? '▲' : '▼'}
                </span>
                {canRemove && (
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onRemove(); }}
                        className="btn-remove-person"
                        title="Удалить трек"
                        style={{ marginLeft: '0.25rem' }}
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* Body */}
            {track.expanded && (
                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* File upload */}
                    {!track.file ? (
                        <label
                            className="tracks-upload-area"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleFileDrop}
                            style={{ margin: 0 }}
                        >
                            <input
                                type="file"
                                accept=".wav,.flac,audio/wav,audio/flac"
                                onChange={handleFileSelect}
                                hidden
                            />
                            <div className="upload-icon-container">
                                <div className="icon-tracks">🎵</div>
                            </div>
                            <span className="upload-title">
                                Перенесите файл сюда или нажмите
                            </span>
                            <span className="upload-subtitle">
                                WAV / FLAC, до 1 ГБ
                            </span>
                        </label>
                    ) : (
                        <div className="track-item">
                            <div className="track-info">
                                <span className="track-icon">🎵</span>
                                <div className="track-details">
                                    <span className="track-name">{track.file.name}</span>
                                    <span className="track-size">
                                        {(track.file.size / 1024 / 1024).toFixed(2)} МБ
                                    </span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => updateTrackField(track.id, 'file', null)}
                                className="btn-remove-track"
                                title="Удалить файл"
                            >
                                ✕
                            </button>
                        </div>
                    )}

                    {/* Title */}
                    <div className="input-group">
                        <label className="form-label">
                            Название трека <span style={{ color: 'var(--color-error, #D14532)' }}>*</span>
                        </label>
                        <input
                            type="text"
                            value={track.title}
                            onChange={(e) => updateTrackField(track.id, 'title', e.target.value)}
                            className="input-field"
                            placeholder="Название трека"
                        />
                    </div>

                    {/* Version */}
                    <div className="input-group">
                        <label className="form-label">Версия трека</label>
                        <input
                            type="text"
                            value={track.version}
                            onChange={(e) => updateTrackField(track.id, 'version', e.target.value)}
                            className="input-field"
                            placeholder="Например: Remix, Acoustic, Live"
                        />
                    </div>

                    {/* --- Persons --- */}
                    <h3 style={{ margin: '0.5rem 0 0' }}>Персоны и роли</h3>
                    {track.persons.map((person) => (
                        <div key={person.id} className="person-row">
                            <div className="person-inputs">
                                <div className="input-group">
                                    <label className="form-label">Имя персоны</label>
                                    <input
                                        type="text"
                                        value={person.name}
                                        onChange={(e) => updatePerson(track.id, person.id, 'name', e.target.value)}
                                        className="input-field"
                                        placeholder="Введите имя"
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="form-label">Роль</label>
                                    <select
                                        value={person.role}
                                        onChange={(e) => updatePerson(track.id, person.id, 'role', e.target.value)}
                                        className="input-field form-select"
                                    >
                                        <option value="Исполнитель">Исполнитель</option>
                                        <option value="feat.">feat.</option>
                                        <option value="Remixer">Remixer</option>
                                    </select>
                                </div>
                            </div>
                            {track.persons.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removePerson(track.id, person.id)}
                                    className="btn-remove-person"
                                    title="Удалить"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => addPerson(track.id)}
                        className="btn-secondary"
                    >
                        + Добавить персону
                    </button>

                    {/* --- Lyricists --- */}
                    <h3 style={{ margin: '0.5rem 0 0' }}>Автор слов</h3>
                    {track.lyricists.map((l) => (
                        <div key={l.id} className="person-row">
                            <div className="person-inputs" style={{ flex: 1 }}>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        value={l.name}
                                        onChange={(e) => updateLyricist(track.id, l.id, e.target.value)}
                                        className="input-field"
                                        placeholder="Имя автора слов"
                                    />
                                </div>
                            </div>
                            {track.lyricists.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeLyricist(track.id, l.id)}
                                    className="btn-remove-person"
                                    title="Удалить"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => addLyricist(track.id)}
                        className="btn-secondary"
                    >
                        + Добавить автора слов
                    </button>

                    {/* --- Composers --- */}
                    <h3 style={{ margin: '0.5rem 0 0' }}>Автор музыки</h3>
                    {track.composers.map((c) => (
                        <div key={c.id} className="person-row">
                            <div className="person-inputs" style={{ flex: 1 }}>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        value={c.name}
                                        onChange={(e) => updateComposer(track.id, c.id, e.target.value)}
                                        className="input-field"
                                        placeholder="Имя автора музыки"
                                    />
                                </div>
                            </div>
                            {track.composers.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeComposer(track.id, c.id)}
                                    className="btn-remove-person"
                                    title="Удалить"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => addComposer(track.id)}
                        className="btn-secondary"
                    >
                        + Добавить автора музыки
                    </button>

                    {/* --- Lyrics --- */}
                    <h3 style={{ margin: '0.5rem 0 0' }}>Текст трека</h3>
                    <div className="input-group">
                        <textarea
                            value={track.lyrics}
                            onChange={(e) => updateTrackField(track.id, 'lyrics', e.target.value)}
                            className="input-field"
                            placeholder="Введите текст трека..."
                            rows={6}
                            style={{ resize: 'vertical', fontFamily: 'inherit', lineHeight: '1.6' }}
                        />
                    </div>

                    {/* --- Rights --- */}
                    <h3 style={{ margin: '0.5rem 0 0' }}>Права</h3>
                    <p style={{ color: 'var(--text-secondary, #666)', fontSize: '0.85rem', margin: 0 }}>
                        Укажите долю, если авторов несколько, укажите сумму долей. Авторское вознаграждение
                        выплачивается в соответствии с указанной долей и условиями договора
                    </p>
                    <div className="person-inputs">
                        <div className="input-group">
                            <label className="form-label">&#169; Авторские права</label>
                            <input
                                type="number"
                                min={0}
                                max={100}
                                value={track.copyrightShare}
                                onChange={(e) => updateTrackField(track.id, 'copyrightShare', Number(e.target.value))}
                                className="input-field"
                            />
                        </div>
                        <div className="input-group">
                            <label className="form-label">&#8471; Смежные права</label>
                            <input
                                type="number"
                                min={0}
                                max={100}
                                value={track.relatedRightsShare}
                                onChange={(e) => updateTrackField(track.id, 'relatedRightsShare', Number(e.target.value))}
                                className="input-field"
                            />
                        </div>
                    </div>

                    {/* --- Ringtone --- */}
                    <h3 style={{ margin: '0.5rem 0 0' }}>Рингтон</h3>
                    <div className="input-group">
                        <input
                            type="text"
                            value={track.ringtone}
                            onChange={(e) => updateTrackField(track.id, 'ringtone', e.target.value)}
                            className="input-field"
                            placeholder="Например: 0:30"
                        />
                        <p style={{ color: 'var(--text-secondary, #666)', fontSize: '0.8rem', margin: '0.25rem 0 0' }}>
                            Укажите время начала рингтона (например: 0:30)
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
