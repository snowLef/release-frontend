import { createContext, useContext, useState } from 'react';
import { useLogto } from '@logto/react';
import toast from 'react-hot-toast';
import { createRelease, API_BASE_URL, LOGTO_RESOURCE } from '../services/api.js';
import { useWizardTabs } from '../hooks/useWizardTabs';
import { useCoverUpload, useVideoUpload, useBookletUpload, useTrackFiles } from '../hooks/useFileUpload';
import { usePersons } from '../hooks/usePersons';
import { usePlatforms } from '../hooks/usePlatforms.js';

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
    excludedCountries: [],
    lyricist: '',
    composer: '',
};

const WizardContext = createContext(null);

export function WizardProvider({ children, onSuccess }) {
    const { getAccessToken } = useLogto();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const { platformsData, handlePlatformChange } = usePlatforms();
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
            toast.error('Пожалуйста, укажите название релиза');
            return false;
        }
        if (!persons[0]?.name?.trim()) {
            toast.error('Пожалуйста, укажите исполнителя');
            return false;
        }
        if (!formData.lyricist.trim()) {
            toast.error('Пожалуйста, укажите автора слов');
            return false;
        }
        if (!formData.composer.trim()) {
            toast.error('Пожалуйста, укажите автора музыки');
            return false;
        }
        if (!formData.releaseDate) {
            toast.error('Пожалуйста, выберите дату релиза');
            return false;
        }
        if (!noAudioFiles && trackFiles.length === 0) {
            toast.error('Пожалуйста, загрузите аудио файлы или отметьте "Релиз без аудиофайлов"');
            return false;
        }
        if (!coverImage) {
            toast.error('Пожалуйста, загрузите обложку релиза');
            return false;
        }
        if (!termsAccepted) {
            toast.error('Необходимо принять пользовательское соглашение');
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
        setTermsAccepted(false);
        setShowTermsModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm() || loading) return;
        try {
            setLoading(true);
            const token = await getAccessToken(LOGTO_RESOURCE);
            const completeFormData = {
                ...formData,
                artist: persons[0]?.name || '',
                persons,
                platformsData,
            };
            await createRelease(token, completeFormData, trackFiles, coverImage, videoFile, bookletFile);
            resetForm();
            toast.success('Релиз успешно отправлен на модерацию!');
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Ошибка отправки:', error);
            toast.error('Ошибка: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <WizardContext.Provider value={{
            loading,
            formData, handleChange,
            platformsData, handlePlatformChange,
            tabs, activeTab, currentTabIndex, setActiveTab, nextTab, prevTab,
            coverPreview, handleCoverChange,
            videoFile, handleVideoChange,
            bookletFile, handleBookletChange,
            trackFiles, noAudioFiles, handleFileChange, removeTrack, setNoAudioFiles, setTrackFiles,
            persons, handlePersonChange, addPerson, removePerson,
            handleSubmit,
            termsAccepted, setTermsAccepted,
            showTermsModal, setShowTermsModal,
        }}>
            {children}
        </WizardContext.Provider>
    );
}

export function useWizard() {
    return useContext(WizardContext);
}
