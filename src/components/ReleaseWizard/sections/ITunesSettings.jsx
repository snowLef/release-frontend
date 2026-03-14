import React from 'react';
import { useWizard } from '../../../contexts/WizardContext';

export default function ITunesSettings({ platformData }) {
    const { handlePlatformChange } = useWizard();
    const releasePriceCategories = [
        { value: '', label: 'Выберите категорию' },
        { value: 'mini_ep', label: 'Mini EP - 39,00 ₽', price: 39 },
        { value: 'ep', label: 'EP - 49,00 ₽', price: 49 },
        { value: 'mini_album_one', label: 'Mini Album One - 59,00 ₽', price: 59 },
        { value: 'budget_one', label: 'Budget One - 69,00 ₽', price: 69 },
        { value: 'budget_two', label: 'Budget Two - 76,00 ₽', price: 76 },
        { value: 'back', label: 'Back - 79,00 ₽', price: 79 },
        { value: 'mid_front', label: 'Mid/Front - 99,00 ₽', price: 99 },
        { value: 'front_plus', label: 'Front/Plus - 129,00 ₽', price: 129 },
        { value: 'mid', label: 'Mid - 89,00 ₽', price: 89 },
        { value: 'front_one', label: 'Front One - 109,00 ₽', price: 109 },
        { value: 'front_two', label: 'Front Two - 119,00 ₽', price: 119 },
        { value: 'mini_album_two', label: 'Mini Album Two - 59,00 ₽', price: 59 },
        { value: 'deluxe_one', label: 'Deluxe One - 139,00 ₽', price: 139 },
        { value: 'deluxe_two', label: 'Deluxe Two - 149,00 ₽', price: 149 },
        { value: 'deluxe_three', label: 'Deluxe Three - 179,00 ₽', price: 179 },
        { value: 'deluxe_four', label: 'Deluxe Four - 199,00 ₽', price: 199 },
    ];

    const trackPriceCategories = [
        { value: 'back', label: 'Back - 12,00 ₽', price: 12 },
        { value: 'mid', label: 'Mid - 18,00 ₽', price: 18 },
        { value: 'front', label: 'Front - 22,00 ₽', price: 22 },
    ];

    return (
        <div className="form-card">
            <div className="card-header">
                <h2 className="card-title">iTunes</h2>
            </div>

            <div className="card-body">
                {/* Доступен в iTunes */}
                <label className="checkbox-label" style={{ marginBottom: '1rem' }}>
                    <input
                        type="checkbox"
                        checked={platformData.available || false}
                        onChange={(e) => handlePlatformChange('itunes', 'available', e.target.checked)}
                    />
                    <span>Доступен в iTunes</span>
                </label>

                {/* Запрет предпрослушивания */}
                <label className="checkbox-label" style={{ marginBottom: '1.5rem' }}>
                    <input
                        type="checkbox"
                        checked={platformData.previewDisabled || false}
                        onChange={(e) => handlePlatformChange('itunes', 'previewDisabled', e.target.checked)}
                    />
                    <span>
                        Запрет предпрослушивания
                        <span
                            className="info-icon"
                            title="Отключает возможность предварительного прослушивания треков"
                            style={{ marginLeft: '0.5rem', cursor: 'help' }}
                        >
                            ⓘ
                        </span>
                    </span>
                </label>

                {/* Минимальная ценовая категория трека */}
                <label className="checkbox-label" style={{ marginTop: '1.5rem' }}>
                    <input
                        type="checkbox"
                        checked={platformData.minPriceCategory || false}
                        onChange={(e) => handlePlatformChange('itunes', 'minPriceCategory', e.target.checked)}
                    />
                    <span>
                        Минимальная ценовая категория трека
                        <span
                            className="info-icon"
                            title="Применить минимальную цену для всех треков"
                            style={{ marginLeft: '0.5rem', cursor: 'help' }}
                        >
                            ⓘ
                        </span>
                    </span>
                </label>

                {/* Apple Digital Masters */}
                <label className="checkbox-label" style={{ marginTop: '1rem' }}>
                    <input
                        type="checkbox"
                        checked={platformData.appleDigitalMasters || false}
                        onChange={(e) => handlePlatformChange('itunes', 'appleDigitalMasters', e.target.checked)}
                    />
                    <span>Apple Digital Masters (ADM)</span>
                </label>
                <p className="setting-description">
                    Высококачественный аудиоформат для iTunes и Apple Music
                </p>
            </div>
        </div>
    );
}
