import React from 'react';

export default function ReleaseLabel({formData, handleChange}) {
    return (
        /* СЕКЦИЯ 6: Название лейбла */
        <div className="form-card">
            <div className="card-header">
                <h2 className="card-title">Название лейбла</h2>
                <p className="card-description">
                    Укажите наименование лейбла, данная информация будет отображена на площадках
                </p>
            </div>

            <div className="card-body">
                <div className="input-group">
                    <label htmlFor="label" className="form-label">Название лейбла</label>
                    <select
                        id="label"
                        name="label"
                        value={formData.label || ''}
                        onChange={handleChange}
                        className="input-field form-select"
                    >
                        <option value="">Выберите название лейбла</option>
                        <option value="independent">Независимый артист</option>
                        <option value="custom">Мой лейбл</option>
                    </select>
                    <span className="field-hint">
                                Если вашего лейбла нет в списке, выберите "Мой лейбл" и свяжитесь с поддержкой
                            </span>
                </div>
            </div>
        </div>
    );
}