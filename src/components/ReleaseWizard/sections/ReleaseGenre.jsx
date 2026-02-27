import React from 'react';
import { useWizard } from '../../../contexts/WizardContext';

export default function ReleaseGenre() {
    const { formData, handleChange } = useWizard();
    return (
        /* СЕКЦИЯ 4: Жанр и поджанр */
    <div className="form-card">
        <div className="card-header">
            <h2 className="card-title">Жанр и поджанр</h2>
            <p className="card-description">
                Укажите основной жанр и поджанр для релиза
            </p>
        </div>

        <div className="card-body">
            <div className="form-row">
                <div className="input-group">
                    <label htmlFor="genre" className="form-label">Жанр</label>
                    <select
                        id="genre"
                        name="genre"
                        value={formData.genre}
                        onChange={handleChange}
                        className="input-field form-select"
                        required
                    >
                        <option value="">Выберите жанр</option>
                        <option value="Pop">Поп</option>
                        <option value="Rock">Рок</option>
                        <option value="Hip-Hop">Хип-хоп</option>
                        <option value="Electronic">Электроника</option>
                        <option value="Jazz">Джаз</option>
                        <option value="Classical">Классика</option>
                        <option value="Folk">Фолк</option>
                        <option value="Blues">Блюз</option>
                        <option value="R&B">R&B</option>
                        <option value="Metal">Металл</option>
                    </select>
                </div>

                <div className="input-group">
                    <label htmlFor="subgenre" className="form-label">
                        Поджанр
                        {' '} {/* ✅ Добавляем пробел */}
                        <span className="optional-badge">опционально</span>
                    </label>
                    <select
                        id="subgenre"
                        name="subgenre"
                        value={formData.subgenre || ''}
                        onChange={handleChange}
                        className="input-field form-select"
                    >
                        <option value="">Выберите поджанр</option>
                        <option value="Indie">Инди</option>
                        <option value="Alternative">Альтернатива</option>
                        <option value="House">Хаус</option>
                        <option value="Techno">Техно</option>
                        <option value="Trap">Трэп</option>
                    </select>
                </div>
            </div>
        </div>
    </div>
    );
}