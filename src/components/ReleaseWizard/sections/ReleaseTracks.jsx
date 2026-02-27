import React from 'react';
import { useWizard } from '../../../contexts/WizardContext';

export default function ReleaseTracks() {
    const { trackFiles, removeTrack, noAudioFiles, handleFileChange, setNoAudioFiles, setTrackFiles } = useWizard();

    return (
        /* СЕКЦИЯ: Загрузка треков */
        <div className="form-card">
            <div className="card-header">
                <h2 className="card-title">Загрузка треков</h2>
                <p className="card-description">
                    Загрузите аудио файлы в формате WAV или FLAC
                </p>
            </div>

            <div className="card-body">
                <div className="upload-info-box">
                    <div className="info-row">
                        <span className="info-label">Формат:</span>
                        <span className="info-value">.wav, .flac</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Макс. размер файла:</span>
                        <span className="info-value">1 ГБ</span>
                    </div>
                </div>

                {trackFiles.length > 0 && (
                    <div className="tracks-list">
                        {trackFiles.map((file, index) => (
                            <div key={index} className="track-item">
                                <div className="track-info">
                                    <span className="track-icon">🎵</span>
                                    <div className="track-details">
                                        <span className="track-name">{file.name}</span>
                                        <span className="track-size">
                                            {(file.size / 1024 / 1024).toFixed(2)} МБ
                                        </span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeTrack(index)}
                                    className="btn-remove-track"
                                    title="Удалить"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <label className={`tracks-upload-area ${noAudioFiles ? 'disabled' : ''}`}>
                    <input
                        type="file"
                        accept=".wav,.flac,audio/wav,audio/flac"
                        onChange={handleFileChange}
                        multiple
                        hidden
                        disabled={noAudioFiles}
                    />
                    <div className="upload-icon-container">
                        <div className="icon-tracks">📁</div>
                    </div>
                    <span className="upload-title">
                        {trackFiles.length > 0
                            ? "Добавить еще треки"
                            : "Перенесите файлы сюда или нажмите, чтобы загрузить"
                        }
                    </span>
                    <span className="upload-subtitle">
                        Формат: .wav, .flac • Максимальный размер: 1 ГБ
                    </span>
                </label>

                <div className="no-audio-checkbox">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={noAudioFiles}
                            onChange={(e) => {
                                setNoAudioFiles(e.target.checked);
                                if (e.target.checked) {
                                    setTrackFiles([]);
                                }
                            }}
                            className="checkbox-input"
                        />
                        <span className="checkbox-text">
                            Загрузка релиза без аудиофайлов
                        </span>
                    </label>
                    <p className="checkbox-hint">
                        Отметьте, если вы хотите создать релиз без загрузки аудио
                    </p>
                </div>
            </div>
        </div>
    );
}
