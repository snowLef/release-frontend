import React, { useState } from 'react';
import { useLogto } from '@logto/react';
import { createRelease } from '../../services/api.js';

import { useWizardTabs } from '../../hooks/useWizardTabs';
import { useCoverUpload, useVideoUpload, useBookletUpload, useTrackFiles } from '../../hooks/useFileUpload';
import { usePersons } from '../../hooks/usePersons';

import ReleaseTab from './tabs/ReleaseTab';
import ReleaseTracks from './sections/ReleaseTracks.jsx';
import ReviewTab from './tabs/ReviewTab';
import WizardNavigation from './WizardNavigation.jsx';

const INITIAL_FORM_DATA = {
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
};

export default function ReleaseWizard({ onSuccess }) {
    const { getAccessToken } = useLogto();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);

    const { tabs, activeTab, currentTabIndex, setActiveTab, nextTab, prevTab } = useWizardTabs();
    const { coverImage, coverPreview, handleCoverChange, setCoverImage, setCoverPreview } = useCoverUpload();
    const { videoFile, handleVideoChange, setVideoFile } = useVideoUpload();
    const { bookletFile, handleBookletChange, setBookletFile } = useBookletUpload();
    const { trackFiles, noAudioFiles, handleFileChange, removeTrack, setNoAudioFiles, setTrackFiles } = useTrackFiles();
    const { persons, handlePersonChange, addPerson, removePerson, setPersons } = usePersons();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (!formData.releaseTitle.trim()) {
            alert('Пожалуйста, укажите название релиза');
            return false;
        }
        if (!formData.artist.trim()) {
            alert('Пожалуйста, укажите исполнителя');
            return false;
        }
        if (!formData.releaseDate) {
            alert('Пожалуйста, выберите дату релиза');
            return false;
        }
        if (!noAudioFiles && trackFiles.length === 0) {
            alert('Пожалуйста, загрузите аудио файлы или отметьте "Релиз без аудиофайлов"');
            return false;
        }
        return true;
    };

    const resetForm = () => {
        setFormData(INITIAL_FORM_DATA);
        setTrackFiles([]);
        setCoverImage(null);
        setCoverPreview(null);
        setVideoFile(null);
        setBookletFile(null);
        setPersons([{ id: 1, name: '', role: 'Исполнитель' }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm() || loading) return;

        try {
            setLoading(true);
            const token = await getAccessToken('http://localhost:8080');
            await createRelease(token, formData, trackFiles);

            resetForm();
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
            <div className="page-title-section">
                <h1 className="page-title">Работа с релизом</h1>
                <p className="page-subtitle">Заполните общую информацию по релизу</p>
            </div>

            <div className="wizard-tabs">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        type="button"
                        className={`wizard-tab ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab === 'release' && 'Релиз'}
                        {tab === 'tracklist' && 'Трек-лист'}
                        {tab === 'platforms' && 'Площадки'}
                        {tab === 'review' && 'Проверка'}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="release-form-long">
                {activeTab === 'release' && (
                    <ReleaseTab
                        formData={formData}
                        handleChange={handleChange}
                        coverPreview={coverPreview}
                        handleCoverChange={handleCoverChange}
                        persons={persons}
                        handlePersonChange={handlePersonChange}
                        addPerson={addPerson}
                        removePerson={removePerson}
                        handleVideoChange={handleVideoChange}
                        videoFile={videoFile}
                        handleBookletChange={handleBookletChange}
                        bookletFile={bookletFile}
                    />
                )}

                {activeTab === 'tracklist' && (
                    <ReleaseTracks
                        trackFiles={trackFiles}
                        removeTrack={removeTrack}
                        noAudioFiles={noAudioFiles}
                        handleFileChange={handleFileChange}
                        setNoAudioFiles={setNoAudioFiles}
                        setTrackFiles={setTrackFiles}
                    />
                )}

                {activeTab === 'platforms' && (
                    <>
                        {/* Площадки и территории */}
                    </>
                )}

                {activeTab === 'review' && (
                    <ReviewTab
                        formData={formData}
                        persons={persons}
                        trackFiles={trackFiles}
                        noAudioFiles={noAudioFiles}
                    />
                )}

                <WizardNavigation
                    currentTabIndex={currentTabIndex}
                    tabsLength={tabs.length}
                    prevTab={prevTab}
                    nextTab={nextTab}
                    loading={loading}
                />

                {activeTab === 'review' && (
                    <p className="submit-hint" style={{ textAlign: 'center', marginTop: '1rem' }}>
                        После отправки релиз будет проверен модератором в течение 24-48 часов
                    </p>
                )}
            </form>
        </div>
    );
}
