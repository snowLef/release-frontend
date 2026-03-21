import { createContext, useContext, useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import toast from 'react-hot-toast';
import { createRelease, API_BASE_URL, LOGTO_RESOURCE } from '../services/api.js';
import { useWizardTabs } from '../hooks/useWizardTabs';
import { useCoverUpload, useVideoUpload, useBookletUpload } from '../hooks/useFileUpload';
import { useTrackManager } from '../hooks/useTrackManager';
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
    comment: '',
};

const WizardContext = createContext(null);

export function WizardProvider({ children, onSuccess }) {
    const { getAccessToken } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const { platformsData, handlePlatformChange } = usePlatforms();
    const { tabs, activeTab, currentTabIndex, setActiveTab, nextTab, prevTab } = useWizardTabs();
    const { coverImage, coverPreview, handleCoverChange, setCoverImage, setCoverPreview } = useCoverUpload();
    const { videoFile, handleVideoChange, setVideoFile } = useVideoUpload();
    const { bookletFile, handleBookletChange, setBookletFile } = useBookletUpload();

    const TRACK_LIMITS = { Single: 1, EP: 5, Album: 50 };
    const maxTracks = TRACK_LIMITS[formData.releaseType] ?? 1;

    const {
        tracks, addTrack, removeTrack,
        updateTrackField, updateTrackFile, toggleTrack,
        addPerson, removePerson, updatePerson,
        addLyricist, removeLyricist, updateLyricist,
        addComposer, removeComposer, updateComposer,
        resetTracks,
    } = useTrackManager(maxTracks);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (!formData.releaseTitle.trim()) {
            toast.error('Пожалуйста, укажите название релиза');
            return false;
        }
        if (!formData.releaseDate) {
            toast.error('Пожалуйста, выберите дату релиза');
            return false;
        }
        if (tracks.some(t => !t.file)) {
            toast.error('Пожалуйста, загрузите аудиофайл для каждого трека');
            return false;
        }
        if (tracks.some(t => !t.title.trim())) {
            toast.error('Пожалуйста, укажите название для каждого трека');
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
        resetTracks();
        setCoverImage(null);
        setCoverPreview(null);
        setVideoFile(null);
        setBookletFile(null);
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
                artist: tracks[0]?.persons[0]?.name || '',
                platformsData,
            };
            await createRelease(token, completeFormData, tracks, coverImage, videoFile, bookletFile);
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
            tracks, maxTracks, addTrack, removeTrack,
            updateTrackField, updateTrackFile, toggleTrack,
            addPerson, removePerson, updatePerson,
            addLyricist, removeLyricist, updateLyricist,
            addComposer, removeComposer, updateComposer,
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
