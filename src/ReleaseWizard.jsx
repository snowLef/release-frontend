import React, { useState } from 'react'; // Проверь этот импорт!
import { useLogto } from '@logto/react';
import { createRelease } from './api';
import './App.css';

export default function ReleaseWizard({ onSuccess }) {
    const { getAccessToken } = useLogto();

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [trackFile, setTrackFile] = useState(null);
    const [formData, setFormData] = useState({
        genre: 'Pop',
        artist: '',
        releaseTitle: '',
        releaseDate: '',
        upc: '',
        explicit: 'no'
    });

// Обработчики
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setTrackFile(e.target.files[0]);
        }
    };

    const handleNext = () => setCurrentStep(prev => prev + 1);
    const handleBack = () => setCurrentStep(prev => prev - 1);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        if (!trackFile) return alert('Пожалуйста, выберите файл');

        console.log('handleSubmit вызван'); // Добавьте это

        if (loading) return; // Добавьте защиту от двойного клика

        try {
            setLoading(true);
            const token = await getAccessToken('http://localhost:8080');
            await createRelease(token, formData, trackFile);
            alert('Готово!');
            if (onSuccess) onSuccess();
        } catch (e) {
            alert('Ошибка: ' + e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="release-wizard-container">
            <header className="header">
                <div className="steps">
                    <span className={`step ${currentStep >= 1 ? 'active' : ''}`}>Шаг 1</span>
                    <span className={`step ${currentStep >= 2 ? 'active' : ''}`}>Шаг 2</span>
                    <span className={`step ${currentStep >= 3 ? 'active' : ''}`}>Шаг 3</span>
                </div>
                <h1>{currentStep === 1 ? 'Информация' : currentStep === 2 ? 'Аудио' : 'Детали'}</h1>
            </header>

            <form className="release-form">
                {/* === ШАГ 1 === */}
                {currentStep === 1 && (
                    <div className="step-content fade-in">
                        <section className="form-section">
                            <h3>Основное</h3>
                            <div className="row">
                                <select name="genre" value={formData.genre} onChange={handleChange} className="input-field">
                                    <option value="Pop">Поп</option>
                                    <option value="Rock">Рок</option>
                                    <option value="Hip-Hop">Хип-хоп</option>
                                    <option value="Electronic">Электроника</option>
                                </select>
                            </div>
                            <div className="row">
                                <div className="input-group">
                                    <label>Исполнитель</label>
                                    <input name="artist" value={formData.artist} onChange={handleChange} className="input-field" placeholder="Имя артиста" />
                                </div>
                                <div className="input-group">
                                    <label>Название релиза</label>
                                    <input name="releaseTitle" value={formData.releaseTitle} onChange={handleChange} className="input-field" placeholder="Название трека" />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Дата релиза</label>
                                <input type="date" name="releaseDate" value={formData.releaseDate} onChange={handleChange} className="input-field" />
                            </div>
                        </section>
                        <button type="button" onClick={handleNext} className="btn-primary">Далее</button>
                    </div>
                )}

                {/* === ШАГ 2 === */}
                {currentStep === 2 && (
                    <div className="step-content fade-in">
                        <section className="form-section">
                            <h3>Файл трека (WAV)</h3>
                            <label className="wav-upload-area">
                                <input type="file" accept=".wav" onChange={handleFileChange} hidden />
                                <div className="icon-wav">🎵</div>
                                <span className="upload-title">
                    {trackFile ? `Выбран: ${trackFile.name}` : "Нажмите, чтобы загрузить WAV"}
                </span>
                            </label>
                        </section>
                        <div className="buttons-row">
                            <button type="button" onClick={handleBack} className="btn-secondary">Назад</button>
                            <button type="button" onClick={handleNext} className="btn-primary">Далее</button>
                        </div>
                    </div>
                )}

                {/* === ШАГ 3 === */}
                {currentStep === 3 && (
                    <div className="step-content fade-in">
                        <section className="form-section">
                            <h3>Детали</h3>
                            <div className="input-group">
                                <label>UPC (опционально)</label>
                                <input name="upc" value={formData.upc} onChange={handleChange} className="input-field" placeholder="12 цифр" />
                            </div>
                            <div className="input-group">
                                <label>Ненормативная лексика</label>
                                <div className="radio-row">
                                    <label className="radio-label">
                                        <input type="radio" name="explicit" value="no"
                                               checked={formData.explicit === 'no'} onChange={handleChange} />
                                        <span>Нет</span>
                                    </label>
                                    <label className="radio-label">
                                        <input type="radio" name="explicit" value="yes"
                                               checked={formData.explicit === 'yes'} onChange={handleChange} />
                                        <span>Да</span>
                                    </label>
                                </div>
                            </div>
                        </section>
                        <div className="buttons-row">
                            <button type="button" onClick={handleBack} className="btn-secondary">Назад</button>
                            <button type="button" onClick={handleSubmit} disabled={loading} className="btn-primary">
                                {loading ? 'Отправка...' : 'Отправить на модерацию'}
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}