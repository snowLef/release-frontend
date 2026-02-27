import React from 'react';
import { useWizard } from '../../../contexts/WizardContext';

export default function PlatformSettings({
                                             title,
                                             description,
                                             platformKey,
                                             platformData,
                                             showAvailableCheckbox = true,
                                             showTime = false,
                                             showUpcoming = false,
                                             showFullVersion = false
                                         }) {
    const { handlePlatformChange } = useWizard();
    return (
        <div className="form-card">
            <div className="card-header">
                <h2 className="card-title">{title}</h2>
                {description && (
                    <p className="card-description">{description}</p>
                )}
            </div>

            <div className="card-body">
                {/* Основной чекбокс доступности */}
                {showAvailableCheckbox && (
                    <label className="checkbox-label" style={{ marginBottom: '1.5rem' }}>
                        <input
                            type="checkbox"
                            checked={platformData.available}
                            onChange={(e) => handlePlatformChange(platformKey, 'available', e.target.checked)}
                        />
                        <span>Доступен в {title}</span>
                    </label>
                )}

                {/* Дата и время */}
                <div className="form-row">
                    <div className="input-group">
                        <label htmlFor={`${platformKey}-date`} className="form-label">
                            Дата старта
                        </label>
                        <input
                            id={`${platformKey}-date`}
                            type="date"
                            value={platformData.startDate || ''}
                            onChange={(e) => handlePlatformChange(platformKey, 'startDate', e.target.value)}
                            className="input-field"
                        />
                    </div>

                    {/* Час старта - условный рендер */}
                    {showTime && (
                        <div className="input-group">
                            <label htmlFor={`${platformKey}-time`} className="form-label">
                                Час старта
                            </label>
                            <input
                                id={`${platformKey}-time`}
                                type="time"
                                value={platformData.startTime || '00:00'}
                                onChange={(e) => handlePlatformChange(platformKey, 'startTime', e.target.value)}
                                className="input-field"
                            />
                        </div>
                    )}
                </div>

                {/* Скоро новый релиз (Яндекс) */}
                {showUpcoming && (
                    <>
                        <label className="checkbox-label" style={{ marginTop: '1.5rem' }}>
                            <input
                                type="checkbox"
                                checked={platformData.upcomingRelease || false}
                                onChange={(e) => handlePlatformChange(platformKey, 'upcomingRelease', e.target.checked)}
                            />
                            <span>Скоро новый релиз</span>
                        </label>
                        <p className="setting-description">
                            Функция, с помощью которой слушатель сохраняет в свою коллекцию релиз до его открытия на Яндекс Музыке. Вы можете подогреть аудиторию к выходу сингла или альбома, а также привлечь новых поклонников.
                        </p>
                    </>
                )}

                {/* Доступность полной версии (TikTok) */}
                {showFullVersion && (
                    <>
                        <label className="checkbox-label" style={{ marginTop: '1.5rem' }}>
                            <input
                                type="checkbox"
                                checked={platformData.fullVersion || false}
                                onChange={(e) => handlePlatformChange(platformKey, 'fullVersion', e.target.checked)}
                            />
                            <span>Доступность полной версии трека</span>
                        </label>
                        <p className="setting-description">
                            TikTok предоставляет пользователям возможность послушать полную версию трека
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
