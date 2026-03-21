import { useState, useRef } from 'react';
import toast from 'react-hot-toast';

export function useFileUpload() {
    const validateFile = (file, options) => {
        const { allowedExtensions, maxSize, allowedMimeTypes } = options;

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
    const validationIdRef = useRef(0);

    const validateCoverDimensions = (file) => {
        return new Promise((resolve, reject) => {
            const objectUrl = URL.createObjectURL(file);
            const img = new Image();
            img.onload = () => {
                URL.revokeObjectURL(objectUrl);
                if (img.width !== 3000 || img.height !== 3000) {
                    reject(new Error('Размер обложки должен быть 3000×3000 пикселей'));
                } else {
                    resolve();
                }
            };
            img.onerror = () => {
                URL.revokeObjectURL(objectUrl);
                reject(new Error('Не удалось загрузить изображение для проверки размеров'));
            };
            img.src = objectUrl;
        });
    };
    // DPI validation requires server-side or a metadata library

    const handleCoverChange = async (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const currentId = ++validationIdRef.current;

            try {
                validateFile(file, {
                    allowedMimeTypes: ['image/jpeg', 'image/png'],
                    maxSize: 20 * 1024 * 1024
                });

                await validateCoverDimensions(file);

                if (currentId !== validationIdRef.current) return;

                setCoverImage(file);

                const reader = new FileReader();
                reader.onloadend = () => setCoverPreview(reader.result);
                reader.onerror = () => toast.error('Ошибка при чтении файла');
                reader.readAsDataURL(file);
            } catch (error) {
                toast.error(error.message);
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
                    maxSize: 6 * 1024 * 1024 * 1024  // 6 ГБ
                });
                setVideoFile(file);
            } catch (error) {
                toast.error(error.message);
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
                toast.error(error.message);
            }
        }
    };

    return { bookletFile, handleBookletChange, setBookletFile };
}

export function useTrackFiles(maxTracks = 50) {
    const [trackFiles, setTrackFiles] = useState([]);
    const [noAudioFiles, setNoAudioFiles] = useState(false);
    const { validateFile } = useFileUpload();

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            // Сбрасываем значение инпута — позволяет повторно выбрать тот же файл
            e.target.value = null;

            const validFiles = [];
            for (const file of newFiles) {
                try {
                    validateFile(file, {
                        allowedExtensions: ['.wav', '.flac'],
                        maxSize: 1 * 1024 * 1024 * 1024  // 1 ГБ
                    });
                    validFiles.push(file);
                } catch (error) {
                    toast.error(`Файл ${file.name}: ${error.message}`);
                }
            }

            if (validFiles.length > 0) {
                const remaining = maxTracks - trackFiles.length;
                if (remaining <= 0) {
                    toast.error(`Достигнут лимит треков (${maxTracks})`);
                    return;
                }
                const toAdd = validFiles.slice(0, remaining);
                if (toAdd.length < validFiles.length) {
                    toast.error(`Достигнут лимит треков (${maxTracks}). Добавлено ${toAdd.length} из ${validFiles.length}`);
                }
                setTrackFiles(prev => [...prev, ...toAdd]);
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
