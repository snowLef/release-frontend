import React from 'react';
import { useWizard } from '../../../contexts/WizardContext';

export default function ReleaseComment() {
    const { formData, handleChange } = useWizard();

    return (
        <div className="form-card">
            <div className="card-header">
                <h2 className="card-title">Комментарий</h2>
                <p className="card-description">
                    Укажите дополнительную информацию к релизу
                </p>
            </div>

            <div className="card-body">
                <div className="input-group">
                    <textarea
                        name="comment"
                        value={formData.comment}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Введите комментарий..."
                        rows={5}
                        style={{ resize: 'vertical', fontFamily: 'inherit', lineHeight: '1.6' }}
                    />
                </div>
            </div>
        </div>
    );
}
