import { useState } from 'react';

export function useFileUpload() {
    const validateFile = (file, options) => {
        const { allowedExtensions, maxSize, allowedMimeTypes } = options;

        console.log('Validating file:', {
            name: file.name,
            type: file.type,
            size: file.size,
            options
        });

        if (allowedExtensions && !allowedExtensions.some(ext =>
            file.name.toLowerCase().endsWith(ext)
        )) {
            throw new Error(`Допустимые форматы: ${allowedExtensions.join(', ')}`);
        }

        if (allowedMimeTypes && !allowedMimeTypes.includes(file.type)) {
            throw new Error(`Неверный тип файла. Допустимые форматы: ${allowedMimeTypes.join(', ')}`);
        }

        if (maxSize && file.size > maxSize) {
            const sizeMB = (maxSize / (1024 * 1024)).toFixed(0);
            const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
            throw new Error(`Размер файла (${fileSizeMB} МБ) превышает максимально допустимый (${sizeMB} МБ)`);
        }
    };

    return { validateFile };
}

export function useCoverUpload() {
    const [coverImage, setCoverImage] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const { validateFile } = useFileUpload();

    const handleCoverChange = (e) => {
        console.log('Cover upload triggered', e.target.files);

        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            try {
                validateFile(file, {
                    allowedMimeTypes: ['image/jpeg', 'image/png'],
                    maxSize: 20 * 1024 * 1024  // ← ИСПРАВЛЕНО: 20 МБ
                });

                console.log('Validation passed, setting cover image');
                setCoverImage(file);

                const reader = new FileReader();
                reader.onloadend = () => {
                    console.log('Preview loaded');
                    setCoverPreview(reader.result);
                };
                reader.onerror = (error) => {
                    console.error('FileReader error:', error);
                    alert('Ошибка при чтении файла');
                };
                reader.readAsDataURL(file);
            } catch (error) {
                console.error('Validation error:', error);
                alert(error.message);
            }
        } else {
            console.log('No file selected');
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
                    maxSize: 6 * 1024 * 1024 * 1024  // 6 ГБ
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
                    maxSize: 10 * 1024 * 1024  // 10 МБ
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
                        maxSize: 1 * 1024 * 1024 * 1024  // 1 ГБ
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
