import { useState } from 'react';

export function useFileUpload() {
    const validateFile = (file, options) => {
        const { allowedExtensions, maxSize, allowedMimeTypes } = options;

        if (allowedExtensions && !allowedExtensions.some(ext =>
            file.name.toLowerCase().endsWith(ext)
        )) {
            throw new Error(`Допустимые форматы: ${allowedExtensions.join(', ')}`);
        }

        if (allowedMimeTypes && !allowedMimeTypes.includes(file.type)) {
            throw new Error(`Неверный тип файла`);
        }

        if (maxSize && file.size > maxSize) {
            const sizeMB = (maxSize / (1024 * 1024)).toFixed(0);
            throw new Error(`Размер файла не должен превышать ${sizeMB} МБ`);
        }
    };

    return { validateFile };
}

export function useCoverUpload() {
    const [coverImage, setCoverImage] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const { validateFile } = useFileUpload();

    const handleCoverChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            try {
                validateFile(file, {
                    allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png'],
                    maxSize: 20 * 1024 * 1024
                });

                setCoverImage(file);

                const reader = new FileReader();
                reader.onloadend = () => setCoverPreview(reader.result);
                reader.readAsDataURL(file);
            } catch (error) {
                alert(error.message);
            }
        }
    };

    return { coverImage, coverPreview, handleCoverChange, setCoverImage, setCoverPreview };
}

export function useVideoUpload() {
    const [videoFile, setVideoFile] = useState(null);
    const { validateFile } = useFileUpload();

    const handleVideoChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            try {
                validateFile(file, {
                    allowedExtensions: ['.mov'],
                    maxSize: 6 * 1024 * 1024 * 1024
                });
                setVideoFile(file);
            } catch (error) {
                alert(error.message);
            }
        }
    };

    return { videoFile, handleVideoChange, setVideoFile };
}

export function useBookletUpload() {
    const [bookletFile, setBookletFile] = useState(null);
    const { validateFile } = useFileUpload();

    const handleBookletChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            try {
                validateFile(file, {
                    allowedMimeTypes: ['application/pdf'],
                    maxSize: 10 * 1024 * 1024
                });
                setBookletFile(file);
            } catch (error) {
                alert(error.message);
            }
        }
    };

    return { bookletFile, handleBookletChange, setBookletFile };
}

export function useTrackFiles() {
    const [trackFiles, setTrackFiles] = useState([]);
    const [noAudioFiles, setNoAudioFiles] = useState(false);
    const { validateFile } = useFileUpload();

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            const validFiles = [];

            for (const file of newFiles) {
                try {
                    validateFile(file, {
                        allowedExtensions: ['.wav', '.flac'],
                        maxSize: 1 * 1024 * 1024 * 1024
                    });
                    validFiles.push(file);
                } catch (error) {
                    alert(`Файл ${file.name}: ${error.message}`);
                }
            }

            if (validFiles.length > 0) {
                setTrackFiles(prev => [...prev, ...validFiles]);
            }
        }
    };

    const removeTrack = (index) => {
        setTrackFiles(prev => prev.filter((_, i) => i !== index));
    };

    return {
        trackFiles,
        noAudioFiles,
        handleFileChange,
        removeTrack,
        setNoAudioFiles,
        setTrackFiles
    };
}
