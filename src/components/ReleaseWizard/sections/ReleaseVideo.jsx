import React from 'react';
import { useWizard } from '../../../contexts/WizardContext';

export default function ReleaseVideo() {
    const { videoFile, handleVideoChange } = useWizard();

    return (
        /* СЕКЦИЯ 9: Загрузка видео */
        <div className="form-card">
            <div className="card-header">
                <h2 className="card-title">Загрузка видео</h2>
                <p className="card-description">
                    Apple Music предлагает размещение видео внутри вашего релиза, видео будет доступно
                    на странице релиза с трек-листом
                </p>
            </div>

            <div className="card-body">
                <div className="upload-info-box">
                    <div className="info-row">
                        <span className="info-label">Формат:</span>
                        <span className="info-value">.mov</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Максимальный размер:</span>
                        <span className="info-value">не более 6 ГБ</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Разрешение:</span>
                        <span className="info-value">1920×1080 (FULL HD)</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Видеокодеки:</span>
                        <span className="info-value">H.264, MPEG-4, ProRes, HEVC</span>
                    </div>
                </div>

                <label className="video-upload-area">
                    <input
                        type="file"
                        accept=".mov,video/quicktime"
                        onChange={handleVideoChange}
                        hidden
                    />
                    <div className="upload-icon-container">
                        <div className="icon-video">
                            {videoFile ? '✓' : '🎬'}
                        </div>
                    </div>
                    <span className="upload-title">
                        {videoFile ? videoFile.name : "Загрузить файл"}
                    </span>
                    <span className="upload-subtitle">
                        {videoFile
                            ? `Размер: ${(videoFile.size / 1024 / 1024 / 1024).toFixed(2)} ГБ`
                            : "Перетащите файл сюда или нажмите для выбора"
                        }
                    </span>
                </label>
            </div>
        </div>
    );
}
