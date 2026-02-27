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
                {/* Дата релиза и Дата старта */}
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
                        <label htmlFor="startDate" className="form-label">
                            Дата старта
                            <span className="info-icon" title="Дата начала продаж">ⓘ</span>
                        </label>
                        <input
                            id="startDate"
                            type="date"
                            name="startDate"
                            value={formData.startDate || ''}
                            onChange={handleChange}
                            className="input-field"
                        />
                    </div>
                </div>

                {/* Дата предзаказа и Год получения прав */}
                <div className="form-row">
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

                    <div className="input-group">
                        <label htmlFor="copyrightYear" className="form-label">
                            Год получения прав
                            <span className="info-icon" title="Год авторских прав">ⓘ</span>
                        </label>
                        <input
                            id="copyrightYear"
                            type="number"
                            name="copyrightYear"
                            value={formData.copyrightYear || new Date().getFullYear()}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="2026"
                            min="1900"
                            max={new Date().getFullYear()}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}