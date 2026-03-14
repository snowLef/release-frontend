import React from 'react';
import { useWizard } from '../../../contexts/WizardContext';

export default function ReleaseDates() {
    const { formData, handleChange } = useWizard();
    return (
        /* СЕКЦИЯ 7: Даты */
        <div className="form-card">
            <div className="card-header">
                <h2 className="card-title">Даты</h2>
                <p className="card-description">
                    Укажите основные даты для релиза
                </p>
            </div>

            <div className="card-body">
                <div className="form-row">
                    <div className="input-group">
                        <label htmlFor="releaseDate" className="form-label">
                            Дата релиза
                            <span className="info-icon" title="Дата публикации на площадках">ⓘ</span>
                        </label>
                        <input
                            id="releaseDate"
                            type="date"
                            name="releaseDate"
                            value={formData.releaseDate}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="preorderDate" className="form-label">
                            Дата предзаказа
                            <span className="info-icon" title="Дата начала предзаказа">ⓘ</span>
                        </label>
                        <input
                            id="preorderDate"
                            type="date"
                            name="preorderDate"
                            value={formData.preorderDate || ''}
                            onChange={handleChange}
                            className="input-field"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}