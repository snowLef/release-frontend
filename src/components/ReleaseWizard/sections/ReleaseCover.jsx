import React from 'react';
import { useWizard } from '../../../contexts/WizardContext';

export default function ReleaseCover() {
    const { coverPreview, handleCoverChange } = useWizard();

    return (
        <div className="form-card">
            <div className="card-header">
                <h2 className="card-title">Обложка релиза</h2>
                <p className="card-description">
                    Загрузите обложку для вашего релиза (JPG или PNG, до 20 МБ). Размер: 3000×3000 пикселей, разрешение: не менее 72 dpi
                </p>
            </div>

            <div className="card-body">
                <div className="cover-upload-container">
                    <label htmlFor="cover-upload" className="cover-upload-label">
                        {coverPreview ? (
                            <img
                                src={coverPreview}
                                alt="Cover preview"
                                className="cover-preview-image"
                            />
                        ) : (
                            <div className="cover-placeholder">
                                <span className="upload-icon">📁</span>
                                <span>Нажмите для загрузки обложки</span>
                            </div>
                        )}
                    </label>
                    <input
                        id="cover-upload"
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={handleCoverChange}
                        style={{ display: 'none' }}
                    />
                </div>
            </div>
        </div>
    );
}
