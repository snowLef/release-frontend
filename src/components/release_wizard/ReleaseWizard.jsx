import React, { useState } from 'react';
import { useLogto } from '@logto/react';
import { createRelease } from '../../api.js';

export default function ReleaseWizard({ onSuccess }) {
    const { getAccessToken } = useLogto();
    const [activeTab, setActiveTab] = useState('release');
    const [loading, setLoading] = useState(false);
    const [trackFiles, setTrackFiles] = useState([]);
    const [noAudioFiles, setNoAudioFiles] = useState(false);
    const [coverImage, setCoverImage] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [bookletFile, setBookletFile] = useState(null);

    const [formData, setFormData] = useState({
        language: 'ru',
        releaseTitle: '',
        subtitle: '',
        releaseType: 'Single',
        genre: 'Pop',
        subgenre: '',
        artist: '',
        releaseDate: '',
        upc: '',
        partnerCode: '',
        label: '',
        startDate: '',
        preorderDate: '',
        copyrightYear: new Date().getFullYear(),
        explicit: 'no',
        platforms: 'all',
        territories: 'all',
        excludedCountries: []
    });

    const tabs = ['release', 'tracklist', 'platforms', 'review'];
    const currentTabIndex = tabs.indexOf(activeTab);

    const nextTab = () => {
        if (currentTabIndex < tabs.length - 1) {
            setActiveTab(tabs[currentTabIndex + 1]);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const prevTab = () => {
        if (currentTabIndex > 0) {
            setActiveTab(tabs[currentTabIndex - 1]);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const [persons, setPersons] = useState([
        { id: 1, name: '', role: 'Исполнитель' }
    ]);

    const handlePersonChange = (id, field, value) => {
        setPersons(persons.map(person =>
            person.id === id ? { ...person, [field]: value } : person
        ));
    };

    const addPerson = () => {
        const newId = Math.max(...persons.map(p => p.id), 0) + 1;
        setPersons([...persons, { id: newId, name: '', role: 'Исполнитель' }]);
    };

    const removePerson = (id) => {
        if (persons.length > 1) {
            setPersons(persons.filter(person => person.id !== id));
        }
    };

    const handleVideoChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Проверка формата
            if (!file.name.toLowerCase().endsWith('.mov')) {
                alert('Пожалуйста, загрузите файл в формате MOV');
                return;
            }

            // Проверка размера (6 ГБ)
            if (file.size > 6 * 1024 * 1024 * 1024) {
                alert('Размер файла не должен превышать 6 ГБ');
                return;
            }

            setVideoFile(file);
        }
    };

    const handleBookletChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Проверка формата
            if (!file.type.includes('pdf')) {
                alert('Пожалуйста, загрузите файл в формате PDF');
                return;
            }

            // Проверка размера (10 МБ)
            if (file.size > 10 * 1024 * 1024) {
                alert('Размер файла не должен превышать 10 МБ');
                return;
            }

            setBookletFile(file);
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);

            // Проверка каждого файла
            const validFiles = [];
            for (const file of newFiles) {
                // Проверка формата
                if (!file.name.toLowerCase().endsWith('.wav') &&
                    !file.name.toLowerCase().endsWith('.flac')) {
                    alert(`Файл ${file.name}: неверный формат. Допустимы только WAV и FLAC`);
                    continue;
                }

                // Проверка размера (1 ГБ)
                if (file.size > 1 * 1024 * 1024 * 1024) {
                    alert(`Файл ${file.name}: размер превышает 1 ГБ`);
                    continue;
                }

                validFiles.push(file);
            }

            if (validFiles.length > 0) {
                setTrackFiles(prev => [...prev, ...validFiles]);
            }
        }
    };

    const removeTrack = (index) => {
        setTrackFiles(prev => prev.filter((_, i) => i !== index));
    };


    const handleCoverChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Проверка формата
            const validFormats = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!validFormats.includes(file.type)) {
                alert('Пожалуйста, загрузите изображение в формате JPG или PNG');
                return;
            }

            // Проверка размера (20 МБ)
            if (file.size > 20 * 1024 * 1024) {
                alert('Размер файла не должен превышать 20 МБ');
                return;
            }

            setCoverImage(file);

            // Создаем preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Валидация
        if (!formData.releaseTitle.trim()) {
            alert('Пожалуйста, укажите название релиза');
            return;
        }

        if (!formData.artist.trim()) {
            alert('Пожалуйста, укажите исполнителя');
            return;
        }

        if (!formData.releaseDate) {
            alert('Пожалуйста, выберите дату релиза');
            return;
        }

        if (!noAudioFiles && trackFiles.length === 0) {
            alert('Пожалуйста, загрузите аудио файлы или отметьте "Релиз без аудиофайлов"');
            return;
        }

        if (loading) return;

        try {
            setLoading(true);
            const token = await getAccessToken('http://localhost:8080');
            await createRelease(token, formData, trackFile);

            // Очистка формы
            setFormData({
                language: 'ru',
                releaseTitle: '',
                subtitle: '',
                releaseType: 'Single',
                genre: 'Pop',
                artist: '',
                releaseDate: '',
                upc: '',
                explicit: 'no'
            });
            setTrackFile(null);
            setCoverImage(null);
            setCoverPreview(null);

            alert('✅ Релиз успешно отправлен на модерацию!');
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Ошибка отправки:', error);
            alert('❌ Ошибка: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="release-wizard-scroll">
            {/* Заголовок страницы */}
            <div className="page-title-section">
                <h1 className="page-title">Работа с релизом</h1>
                <p className="page-subtitle">
                    Заполните общую информацию по релизу
                </p>
            </div>

            {/* ВКЛАДКИ */}
            <div className="wizard-tabs">
                <button
                    type="button"
                    className={`wizard-tab ${activeTab === 'release' ? 'active' : ''}`}
                    onClick={() => setActiveTab('release')}
                >
                    Релиз
                </button>
                <button
                    type="button"
                    className={`wizard-tab ${activeTab === 'tracklist' ? 'active' : ''}`}
                    onClick={() => setActiveTab('tracklist')}
                >
                    Трек-лист
                </button>
                <button
                    type="button"
                    className={`wizard-tab ${activeTab === 'platforms' ? 'active' : ''}`}
                    onClick={() => setActiveTab('platforms')}
                >
                    Площадки
                </button>
                <button
                    type="button"
                    className={`wizard-tab ${activeTab === 'review' ? 'active' : ''}`}
                    onClick={() => setActiveTab('review')}
                >
                    Проверка
                </button>
            </div>

            <form onSubmit={handleSubmit} className="release-form-long">
                {/* ВКЛАДКА: РЕЛИЗ */}
                {activeTab === 'release' && (
                    <>

                {/* СЕКЦИЯ 1: Основная информация */}
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

                {/* СЕКЦИЯ 2: Обложка релиза */}
                <div className="form-card">
                    <div className="card-header">
                        <h2 className="card-title">Обложка релиза</h2>
                        <p className="card-description">
                            Загрузите обложку для вашего релиза
                        </p>
                    </div>

                    <div className="card-body">
                        {/* Требования к обложке */}
                        <div className="upload-info-box">
                            <div className="info-row">
                                <span className="info-label">Формат:</span>
                                <span className="info-value">.jpg, .png</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Минимальный размер:</span>
                                <span className="info-value">1400×1400px</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Максимальный размер:</span>
                                <span className="info-value">6000×6000px</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Разрешение:</span>
                                <span className="info-value">не менее 72 dpi</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Макс. размер файла:</span>
                                <span className="info-value">20 МБ</span>
                            </div>
                        </div>

                        {/* Зона загрузки обложки */}
                        <label className="cover-upload-area">
                            <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png"
                                onChange={handleCoverChange}
                                hidden
                            />

                            {coverPreview ? (
                                <div className="cover-preview">
                                    <img src={coverPreview} alt="Cover preview" />
                                    <div className="cover-overlay">
                                        <span>Нажмите для замены</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="cover-placeholder">
                                    <div className="cover-icon">🎨</div>
                                    <span className="upload-title">Загрузить обложку</span>
                                    <span className="upload-subtitle">
                                        Перетащите файл или нажмите для выбора
                                    </span>
                                </div>
                            )}
                        </label>
                    </div>
                </div>

                {/* СЕКЦИЯ 3: Персоны и роли */}
                <div className="form-card">
                    <div className="card-header">
                        <h2 className="card-title">Персоны и роли</h2>
                        <p className="card-description">
                            Для Исполнителей, Сокисполнителей (feat.), Remixer необходимо указать псевдоним артиста, группы или проекта
                        </p>
                    </div>

                    <div className="card-body">
                        {persons.map((person, index) => (
                            <div key={person.id} className="person-row">
                                <div className="person-inputs">
                                    <div className="input-group">
                                        <label className="form-label">Имя персоны</label>
                                        <input
                                            type="text"
                                            value={person.name}
                                            onChange={(e) => handlePersonChange(person.id, 'name', e.target.value)}
                                            className="input-field"
                                            placeholder="Введите имя"
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label className="form-label">Роль персоны</label>
                                        <select
                                            value={person.role}
                                            onChange={(e) => handlePersonChange(person.id, 'role', e.target.value)}
                                            className="input-field form-select"
                                        >
                                            <option value="Исполнитель">Исполнитель</option>
                                            <option value="feat.">feat.</option>
                                            <option value="Remixer">Remixer</option>
                                        </select>
                                    </div>
                                </div>

                                {persons.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removePerson(person.id)}
                                        className="btn-remove-person"
                                        title="Удалить"
                                    >
                                        🗑️
                                    </button>
                                )}
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addPerson}
                            className="btn-secondary"
                            style={{ marginTop: '1rem' }}
                        >
                            ➕ Добавить
                        </button>
                    </div>
                </div>

                {/* СЕКЦИЯ 4: Жанр и поджанр */}
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

                {/* СЕКЦИЯ 5: Идентификация */}
                <div className="form-card">
                    <div className="card-header">
                        <h2 className="card-title">Идентификация</h2>
                        <p className="card-description">
                            Укажите код, он необходим для точности в идентификации релиза на площадках и отчетности, если у вас есть UPC, код будет сгенерирован автоматически
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

                {/* СЕКЦИЯ 6: Название лейбла */}
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

                {/* СЕКЦИЯ 7: Даты */}
                <div className="form-card">
                    <div className="card-header">
                        <h2 className="card-title">Даты</h2>
                        <p className="card-description">
                            Укажите основные даты для релиза
                        </p>
                    </div>

                    <div className="card-body">
                        {/* Дата релиза и Дата старта */}
                        <div className="form-row">
                            <div className="input-group">
                                <label htmlFor="releaseDate" className="form-label">
                                    Дата релиза
                                    <span className="info-icon" title="Дата публикации на площадках">ⓘ</span>
                                </label>
                                <input
                                    id="releaseDate"
                                    type="date"
                                    name="releaseDate"
                                    value={formData.releaseDate}
                                    onChange={handleChange}
                                    className="input-field"
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="startDate" className="form-label">
                                    Дата старта
                                    <span className="info-icon" title="Дата начала продаж">ⓘ</span>
                                </label>
                                <input
                                    id="startDate"
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate || ''}
                                    onChange={handleChange}
                                    className="input-field"
                                />
                            </div>
                        </div>

                        {/* Дата предзаказа и Год получения прав */}
                        <div className="form-row">
                            <div className="input-group">
                                <label htmlFor="preorderDate" className="form-label">
                                    Дата предзаказа
                                    <span className="info-icon" title="Дата начала предзаказа">ⓘ</span>
                                </label>
                                <input
                                    id="preorderDate"
                                    type="date"
                                    name="preorderDate"
                                    value={formData.preorderDate || ''}
                                    onChange={handleChange}
                                    className="input-field"
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="copyrightYear" className="form-label">
                                    Год получения прав
                                    <span className="info-icon" title="Год авторских прав">ⓘ</span>
                                </label>
                                <input
                                    id="copyrightYear"
                                    type="number"
                                    name="copyrightYear"
                                    value={formData.copyrightYear || new Date().getFullYear()}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="2026"
                                    min="1900"
                                    max={new Date().getFullYear()}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* СЕКЦИЯ 8: Площадки и территории */}
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

                        <button type="button" className="btn-template">
                            Сохранить как шаблон
                        </button>
                    </div>
                </div>

                {/* СЕКЦИЯ 9: Загрузка видео */}
                <div className="form-card">
                    <div className="card-header">
                        <h2 className="card-title">Загрузка видео</h2>
                        <p className="card-description">
                            Apple Music предлагает размещение видео внутри вашего релиза, видео будет доступно на странице релиза с трек-листом
                        </p>
                    </div>

                    <div className="card-body">
                        <div className="upload-info-box">
                            <div className="info-row">
                                <span className="info-label">Формат:</span>
                                <span className="info-value">.mov</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Максимальный размер:</span>
                                <span className="info-value">не более 6 ГБ</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Разрешение:</span>
                                <span className="info-value">1920×1080 (FULL HD)</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Видеокодеки:</span>
                                <span className="info-value">H.264, MPEG-4, ProRes, HEVC</span>
                            </div>
                        </div>

                        <label className="video-upload-area">
                            <input
                                type="file"
                                accept=".mov,video/quicktime"
                                onChange={handleVideoChange}
                                hidden
                            />
                            <div className="upload-icon-container">
                                <div className="icon-video">
                                    {videoFile ? '✓' : '🎬'}
                                </div>
                            </div>
                            <span className="upload-title">
                                {videoFile ? videoFile.name : "Загрузить файл"}
                            </span>
                            <span className="upload-subtitle">
                                {videoFile
                                    ? `Размер: ${(videoFile.size / 1024 / 1024 / 1024).toFixed(2)} ГБ`
                                    : "Перетащите файл сюда или нажмите для выбора"
                                }
                            </span>
                        </label>
                    </div>
                </div>

                {/* СЕКЦИЯ 10: Сопроводительные материалы */}
                <div className="form-card">
                    <div className="card-header">
                        <h2 className="card-title">Сопроводительные материалы</h2>
                    </div>

                    <div className="card-body">
                        <h3 style={{
                            fontSize: '1.1rem',
                            color: 'var(--primary-blue)',
                            marginBottom: '0.75rem',
                            fontWeight: 600
                        }}>
                            Digital Booklet
                        </h3>
                        <p style={{
                            fontSize: '0.9rem',
                            color: 'var(--text-secondary)',
                            marginBottom: '1.25rem',
                            lineHeight: 1.6
                        }}>
                            iTunes предлагает «цифровой буклет» с покупкой полного релиза. Буклет содержит PDF-версию буклета/буклета, который пользователь получит при покупке релиза
                        </p>

                        <div className="upload-info-box" style={{ marginBottom: '1rem' }}>
                            <div className="info-row">
                                <span className="info-label">Формат:</span>
                                <span className="info-value">.pdf</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Максимальный размер:</span>
                                <span className="info-value">10 МБ</span>
                            </div>
                        </div>

                        <label className="booklet-upload-area">
                            <input
                                type="file"
                                accept=".pdf,application/pdf"
                                onChange={handleBookletChange}
                                hidden
                            />
                            <div className="booklet-icon">📄</div>
                            <span className="upload-title">
                                {bookletFile
                                    ? bookletFile.name
                                    : "Перенесите файлы сюда или нажмите, чтобы загрузить"
                                }
                            </span>
                            {bookletFile && (
                                <span className="upload-subtitle">
                                    Размер: {(bookletFile.size / 1024 / 1024).toFixed(2)} МБ
                                </span>
                            )}
                        </label>
                    </div>
                </div>
                    </>
                )}

                {/* ВКЛАДКА: ТРЕК-ЛИСТ */}
                {activeTab === 'tracklist' && (
                    <>
                {/* СЕКЦИЯ: Загрузка треков */}
                <div className="form-card">
                    <div className="card-header">
                        <h2 className="card-title">Загрузка треков</h2>
                        <p className="card-description">
                            Загрузите аудио файлы в формате WAV или FLAC
                        </p>
                    </div>

                    <div className="card-body">
                        <div className="upload-info-box">
                            <div className="info-row">
                                <span className="info-label">Формат:</span>
                                <span className="info-value">.wav, .flac</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Макс. размер файла:</span>
                                <span className="info-value">1 ГБ</span>
                            </div>
                        </div>

                        {/* Список загруженных треков */}
                        {trackFiles.length > 0 && (
                            <div className="tracks-list">
                                {trackFiles.map((file, index) => (
                                    <div key={index} className="track-item">
                                        <div className="track-info">
                                            <span className="track-icon">🎵</span>
                                            <div className="track-details">
                                                <span className="track-name">{file.name}</span>
                                                <span className="track-size">
                                                    {(file.size / 1024 / 1024).toFixed(2)} МБ
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeTrack(index)}
                                            className="btn-remove-track"
                                            title="Удалить"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Зона загрузки */}
                        <label className={`tracks-upload-area ${noAudioFiles ? 'disabled' : ''}`}>
                            <input
                                type="file"
                                accept=".wav,.flac,audio/wav,audio/flac"
                                onChange={handleFileChange}
                                multiple
                                hidden
                                disabled={noAudioFiles}
                            />
                            <div className="upload-icon-container">
                                <div className="icon-tracks">📁</div>
                            </div>
                            <span className="upload-title">
                                {trackFiles.length > 0
                                    ? "Добавить еще треки"
                                    : "Перенесите файлы сюда или нажмите, чтобы загрузить"
                                }
                            </span>
                            <span className="upload-subtitle">
                                Формат: .wav, .flac • Максимальный размер: 1 ГБ
                            </span>
                        </label>

                        {/* Чекбокс "Релиз без аудиофайлов" */}
                        <div className="no-audio-checkbox">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={noAudioFiles}
                                    onChange={(e) => {
                                        setNoAudioFiles(e.target.checked);
                                        if (e.target.checked) {
                                            setTrackFiles([]);
                                        }
                                    }}
                                    className="checkbox-input"
                                />
                                <span className="checkbox-text">
                                    Загрузка релиза без аудиофайлов
                                </span>
                            </label>
                            <p className="checkbox-hint">
                                Отметьте, если вы хотите создать релиз без загрузки аудио
                            </p>
                        </div>
                    </div>
                </div>
                    </>
                )}


                {/* ВКЛАДКА: ПЛОЩАДКИ */}
                {activeTab === 'platforms' && (
                    <>
                        {/* Площадки и территории */}
                    </>
                )}

                {/* ВКЛАДКА: ПРОВЕРКА */}
                {activeTab === 'review' && (
                    <div className="form-card">
                        <div className="card-header">
                            <h2 className="card-title">Проверка данных</h2>
                            <p className="card-description">
                                Проверьте все данные перед отправкой
                            </p>
                        </div>
                        <div className="card-body">
                            <div className="review-section">
                                <h3>Основная информация</h3>
                                <p><strong>Название:</strong> {formData.releaseTitle || 'Не указано'}</p>
                                <p><strong>Исполнитель:</strong> {persons[0]?.name || 'Не указано'}</p>
                                <p><strong>Жанр:</strong> {formData.genre}</p>
                                <p><strong>Дата релиза:</strong> {formData.releaseDate || 'Не указана'}</p>
                            </div>

                            <div className="review-section">
                                <h3>Треки</h3>
                                <p><strong>Загружено треков:</strong> {trackFiles.length}</p>
                                {trackFiles.map((file, i) => (
                                    <p key={i}>• {file.name}</p>
                                ))}
                                {noAudioFiles && <p>⚠️ Релиз без аудиофайлов</p>}
                            </div>
                        </div>
                    </div>
                )}

                {/* Навигация между вкладками */}
                <div className="form-navigation">
                    {currentTabIndex > 0 && (
                        <button
                            type="button"
                            onClick={prevTab}
                            className="btn-secondary btn-nav"
                        >
                            ← Назад
                        </button>
                    )}

                    {currentTabIndex < tabs.length - 1 ? (
                        <button
                            type="button"
                            onClick={nextTab}
                            className="btn-primary btn-nav"
                            style={{ marginLeft: 'auto' }}
                        >
                            Далее →
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="btn-primary btn-submit"
                            disabled={loading}
                            style={{ marginLeft: 'auto' }}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Отправка...
                                </>
                            ) : (
                                <>
                                    📤 Отправить на модерацию
                                </>
                            )}
                        </button>
                    )}
                </div>

                {activeTab === 'review' && (
                    <p className="submit-hint" style={{ textAlign: 'center', marginTop: '1rem' }}>
                        После отправки релиз будет проверен модератором в течение 24-48 часов
                    </p>
                )}

            </form>
        </div>
    );
}
