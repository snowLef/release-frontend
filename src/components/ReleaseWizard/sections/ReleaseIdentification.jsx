import React from 'react';
import { useWizard } from '../../../contexts/WizardContext';

export default function ReleaseIdentification() {
    const { formData, handleChange } = useWizard();
    return (
        /* СЕКЦИЯ 5: Идентификация */
        <div className="form-card">
            <div className="card-header">
                <h2 className="card-title">Идентификация</h2>
                <p className="card-description">
                    Укажите код, он необходим для точности в идентификации релиза на площадках и
                    отчетности, если у вас есть UPC, код будет сгенерирован автоматически
                </p>
            </div>

            <div className="card-body">
                <div className="form-row">
                    <div className="input-group">
                        <label htmlFor="upc" className="form-label">
                            UPC
                            <span className="info-icon" title="Universal Product Code">ⓘ</span>
                        </label>
                        <input
                            id="upc"
                            type="text"
                            name="upc"
                            value={formData.upc}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="Введите UPC"
                            maxLength="12"
                            pattern="[0-9]{12}"
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="partnerCode" className="form-label">
                            Код партнера
                            <span className="info-icon" title="Код партнера для идентификации">ⓘ</span>
                        </label>
                        <input
                            id="partnerCode"
                            type="text"
                            name="partnerCode"
                            value={formData.partnerCode || ''}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="Введите код партнера"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}