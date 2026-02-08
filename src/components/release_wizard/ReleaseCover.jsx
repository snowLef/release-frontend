import React from 'react';

export default function ReleaseCover({coverPreview, handleCoverChange}) {
    return (
        /* СЕКЦИЯ 2: Обложка релиза */
        <div className="form-card">
            <div className="card-header">
                <h2 className="card-title">Обложка релиза</h2>
                <p className="card-description">
                    Загрузите обложку для вашего релиза
                </p>
            </div>

            <div className="card-body">
                {/* Требования к обложке */}
                <div className="upload-info-box">
                    <div className="info-row">
                        <span className="info-label">Формат:</span>
                        <span className="info-value">.jpg, .png</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Минимальный размер:</span>
                        <span className="info-value">1400×1400px</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Максимальный размер:</span>
                        <span className="info-value">6000×6000px</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Разрешение:</span>
                        <span className="info-value">не менее 72 dpi</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Макс. размер файла:</span>
                        <span className="info-value">20 МБ</span>
                    </div>
                </div>

                {/* Зона загрузки обложки */}
                <label className="cover-upload-area">
                    <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={handleCoverChange}
                        hidden
                    />

                    {coverPreview ? (
                        <div className="cover-preview">
                            <img src={coverPreview} alt="Cover preview"/>
                            <div className="cover-overlay">
                                <span>Нажмите для замены</span>
                            </div>
                        </div>
                    ) : (
                        <div className="cover-placeholder">
                            <div className="cover-icon">🎨</div>
                            <span className="upload-title">Загрузить обложку</span>
                            <span className="upload-subtitle">
                                        Перетащите файл или нажмите для выбора
                                    </span>
                        </div>
                    )}
                </label>
            </div>
        </div>
    );
}