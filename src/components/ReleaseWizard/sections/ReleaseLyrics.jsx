import React from 'react';
import { useWizard } from '../../../contexts/WizardContext';

export default function ReleaseLyrics() {
    const { formData, handleChange } = useWizard();

    return (
        <div className="form-card">
            <div className="card-header">
                <h2 className="card-title">Текст трека</h2>
                <p className="card-description">
                    Введите или вставьте текст трека. Используется для отображения на стриминговых платформах
                </p>
            </div>

            <div className="card-body">
                <div className="input-group">
                    <textarea
                        name="lyrics"
                        value={formData.lyrics}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Введите текст трека..."
                        rows={12}
                        style={{ resize: 'vertical', fontFamily: 'inherit', lineHeight: '1.6' }}
                    />
                </div>
            </div>
        </div>
    );
}
