import React, {useState} from 'react';
import {useLogto} from '@logto/react';
import {createRelease} from '../../api.js';

import BasicInfoSection from './BasicInfoSection.jsx';
import ReleaseCover from "./ReleaseCover.jsx";
import ReleasePersons from "./ReleasePersons.jsx";
import ReleaseGenre from "./ReleaseGenre.jsx";
import ReleaseIdentification from "./ReleaseIdentification.jsx";
import ReleaseLabel from "./ReleaseLabel.jsx";
import ReleaseDates from "./ReleaseDates.jsx";
import ReleasePlatforms from "./ReleasePlatforms.jsx";
import ReleaseVideo from "./ReleaseVideo.jsx";
import ReleaseBooklet from "./ReleaseBooklet.jsx";
import ReleaseTracks from "./ReleaseTracks.jsx";

export default function ReleaseWizard({onSuccess}) {
    const {getAccessToken} = useLogto();
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
            window.scrollTo({top: 0, behavior: 'smooth'});
        }
    };

    const prevTab = () => {
        if (currentTabIndex > 0) {
            setActiveTab(tabs[currentTabIndex - 1]);
            window.scrollTo({top: 0, behavior: 'smooth'});
        }
    };

    const [persons, setPersons] = useState([
        {id: 1, name: '', role: 'Исполнитель'}
    ]);

    const handlePersonChange = (id, field, value) => {
        setPersons(persons.map(person =>
            person.id === id ? {...person, [field]: value} : person
        ));
    };

    const addPerson = () => {
        const newId = Math.max(...persons.map(p => p.id), 0) + 1;
        setPersons([...persons, {id: newId, name: '', role: 'Исполнитель'}]);
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
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
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

                        <BasicInfoSection
                            formData={formData}
                            handleChange={handleChange}
                        />

                        <ReleaseCover
                            coverPreview={coverPreview}
                            handleChange={handleCoverChange}
                        />

                        <ReleasePersons
                            persons={persons}
                            handlePersonChange={handlePersonChange}
                            addPerson={addPerson}
                            removePerson={removePerson}
                        />

                        <ReleaseGenre
                            formData={formData}
                            handleChange={handleChange}
                        />

                        <ReleaseIdentification
                            formData={formData}
                            handleChange={handleChange}
                        />

                        <ReleaseLabel
                            formData={formData}
                            handleChange={handleChange}
                        />

                        <ReleaseDates
                            formData={formData}
                            handleChange={handleChange}
                        />

                        <ReleasePlatforms
                            formData={formData}
                            handleChange={handleChange}
                        />

                        <ReleaseVideo
                            handleVideoChange={handleVideoChange}
                            videoFile={videoFile}
                        />

                        <ReleaseBooklet
                            handleBookletChange={handleBookletChange}
                            bookletFile={bookletFile}
                        />
                    </>
                )}

                {/* ВКЛАДКА: ТРЕК-ЛИСТ */}
                {activeTab === 'tracklist' && (
                    <>
                        <ReleaseTracks
                            trackFiles={trackFiles}
                            removeTrack={removeTrack}
                            noAudioFiles={noAudioFiles}
                            handleFileChange={handleFileChange}
                            setNoAudioFiles={setNoAudioFiles}
                            setTrackFiles={setTrackFiles}
                        />
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
                            style={{marginLeft: 'auto'}}
                        >
                            Далее →
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="btn-primary btn-submit"
                            disabled={loading}
                            style={{marginLeft: 'auto'}}
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
                    <p className="submit-hint" style={{textAlign: 'center', marginTop: '1rem'}}>
                        После отправки релиз будет проверен модератором в течение 24-48 часов
                    </p>
                )}

            </form>
        </div>
    );
}
