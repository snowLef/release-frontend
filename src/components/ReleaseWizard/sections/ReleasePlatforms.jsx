import React from 'react';
import { useWizard } from '../../../contexts/WizardContext';

export default function ReleasePlatforms() {
    const { formData, handleChange } = useWizard();
    return (
        /* СЕКЦИЯ 8: Площадки и территории */
        <div className="form-card">
            <div className="card-header">
                <h2 className="card-title">Площадки и территории</h2>
                <p className="card-description">
                    Укажите основные площадки и территории распространения для релиза
                </p>
            </div>

            <div className="card-body">
                {/* Площадки */}
                <div className="input-group">
                    <label className="form-label">Площадки</label>
                    <div className="radio-column">
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="platforms"
                                value="all"
                                checked={formData.platforms === 'all'}
                                onChange={handleChange}
                            />
                            <span>На всех площадках</span>
                        </label>
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="platforms"
                                value="selected"
                                checked={formData.platforms === 'selected'}
                                onChange={handleChange}
                            />
                            <span>Только на некоторых площадках</span>
                        </label>
                    </div>
                </div>

                <div className="section-divider"></div>

                {/* Территории */}
                <div className="input-group">
                    <label className="form-label">Территории</label>
                    <div className="radio-column">
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="territories"
                                value="all"
                                checked={formData.territories === 'all'}
                                onChange={handleChange}
                            />
                            <span>Во всех странах</span>
                        </label>
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="territories"
                                value="selected"
                                checked={formData.territories === 'selected'}
                                onChange={handleChange}
                            />
                            <span>Только в определенных странах</span>
                        </label>
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="territories"
                                value="except"
                                checked={formData.territories === 'except'}
                                onChange={handleChange}
                            />
                            <span>Во всех, кроме</span>
                        </label>
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="territories"
                                value="cis"
                                checked={formData.territories === 'cis'}
                                onChange={handleChange}
                            />
                            <span>В СНГ</span>
                        </label>
                    </div>
                </div>

            </div>
        </div>
    );
}