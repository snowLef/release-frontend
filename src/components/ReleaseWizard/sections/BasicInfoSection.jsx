import React from 'react';

export default function BasicInfoSection({ formData, handleChange }) {
    return (
        /* СЕКЦИЯ 1: Основная информация */
        <div className="form-card">
            <div className="card-header">
                <h2 className="card-title">Основная информация</h2>
                <p className="card-description">
                    Заполните базовую информацию по вашему релизу
                </p>
            </div>

            <div className="card-body">
                {/* Язык метаданных */}
                <div className="input-group">
                    <label htmlFor="language" className="form-label">
                        Язык метаданных
                        <span className="info-icon" title="Язык, на котором указаны название и подзаголовок">ⓘ</span>
                    </label>
                    <select
                        id="language"
                        name="language"
                        value={formData.language}
                        onChange={handleChange}
                        className="input-field form-select"
                        required
                    >
                        <option value="ru">Русский</option>
                        <option value="en">English</option>
                        <option value="de">Deutsch</option>
                        <option value="fr">Français</option>
                        <option value="es">Español</option>
                    </select>
                </div>

                {/* Название релиза и Подзаголовок */}
                <div className="form-row">
                    <div className="input-group">
                        <label htmlFor="releaseTitle" className="form-label">
                            Название релиза
                            <span className="info-icon" title="Основное название релиза">ⓘ</span>
                        </label>
                        <input
                            id="releaseTitle"
                            type="text"
                            name="releaseTitle"
                            value={formData.releaseTitle}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="Введите название"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="subtitle" className="form-label">
                            Подзаголовок
                            <span className="info-icon" title="Дополнительная информация">ⓘ</span>
                        </label>
                        <input
                            id="subtitle"
                            type="text"
                            name="subtitle"
                            value={formData.subtitle}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="Введите подзаголовок"
                        />
                    </div>
                </div>

                {/* Тип релиза */}
                <div className="input-group">
                    <label className="form-label">
                        Тип релиза
                        <span className="info-icon" title="Выберите формат релиза">ⓘ</span>
                    </label>
                    <div className="radio-row">
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="releaseType"
                                value="Single"
                                checked={formData.releaseType === 'Single'}
                                onChange={handleChange}
                            />
                            <span>Single</span>
                        </label>
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="releaseType"
                                value="EP"
                                checked={formData.releaseType === 'EP'}
                                onChange={handleChange}
                            />
                            <span>EP</span>
                        </label>
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="releaseType"
                                value="Album"
                                checked={formData.releaseType === 'Album'}
                                onChange={handleChange}
                            />
                            <span>Album</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
