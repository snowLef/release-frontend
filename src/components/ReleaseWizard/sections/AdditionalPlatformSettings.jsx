import React from 'react';

export default function AdditionalPlatformSettings({
                                                       formData,
                                                       handleChange,
                                                       platformsData,
                                                       handlePlatformChange
                                                   }) {
    const handleCheckboxChange = (name, checked) => {
        handleChange({
            target: { name, value: checked }
        });
    };

    return (
        <div className="form-card">
            <div className="card-header">
                <h2 className="card-title">Работа с площадками</h2>
                <p className="card-description">
                    Определите параметры отгрузки на разные площадки
                </p>
            </div>

            <div className="card-body">
                <div className="platforms-layout">
                    {/* Левая часть - дополнительные настройки */}
                    <div className="additional-settings">
                        <h3 className="settings-subtitle">Дополнительные настройки</h3>

                        <div>
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="earlyReleaseRussia"
                                    checked={formData.earlyReleaseRussia || false}
                                    onChange={(e) => handleCheckboxChange(e.target.name, e.target.checked)}
                                />
                                <span>Ранний старт в России</span>
                            </label>
                            <p className="setting-description">
                                Релиз откроется в России на день раньше всех остальных стран. Это позволит избежать раннего открытия релиза на других территориях из-за разницы в часовых поясах.
                            </p>
                        </div>

                        <div>
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="realtimeDelivery"
                                    checked={formData.realtimeDelivery || false}
                                    onChange={(e) => handleCheckboxChange(e.target.name, e.target.checked)}
                                />
                                <span>Доставка в реальном времени</span>
                            </label>
                            <p className="setting-description">
                                Релиз будет доставлен на площадки сразу после прохождения модерации.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
