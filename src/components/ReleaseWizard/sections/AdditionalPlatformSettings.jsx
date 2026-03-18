import React from 'react';
import { useWizard } from '../../../contexts/WizardContext';

export default function AdditionalPlatformSettings() {
    const { formData, handleChange, platformsData, handlePlatformChange } = useWizard();

    const handleCheckboxChange = (name, checked) => {
        handleChange({ target: { name, value: checked } });
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
                <div className="additional-settings">
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

                    <div>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={platformsData.tiktok.fullVersion || false}
                                onChange={(e) => handlePlatformChange('tiktok', 'fullVersion', e.target.checked)}
                            />
                            <span>Доступность полной версии трека в TikTok</span>
                        </label>
                        <p className="setting-description">
                            TikTok предоставляет пользователям возможность послушать полную версию трека.
                        </p>
                    </div>

                    <div>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={platformsData.youtubeMusic.available || false}
                                onChange={(e) => handlePlatformChange('youtubeMusic', 'available', e.target.checked)}
                            />
                            <span>Доступен в YouTube Music</span>
                        </label>
                    </div>

                    <div>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={platformsData.itunes.available || false}
                                onChange={(e) => handlePlatformChange('itunes', 'available', e.target.checked)}
                            />
                            <span>Доступен в iTunes</span>
                        </label>
                    </div>

                    <div>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={platformsData.itunes.previewDisabled || false}
                                onChange={(e) => handlePlatformChange('itunes', 'previewDisabled', e.target.checked)}
                            />
                            <span>Запрет предпрослушивания в iTunes</span>
                        </label>
                        <p className="setting-description">
                            Отключает возможность предварительного прослушивания треков в iTunes.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
