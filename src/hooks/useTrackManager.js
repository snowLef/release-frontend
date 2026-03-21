import { useState } from 'react';
import toast from 'react-hot-toast';

let nextId = 1;
let nextPersonId = 100;
let nextLId = 200;
let nextCId = 300;

const createTrack = (id) => ({
    id,
    file: null,
    title: '',
    version: '',
    persons: [{ id: 1, name: '', role: 'Исполнитель' }],
    lyricists: [{ id: 1, name: '' }],
    composers: [{ id: 1, name: '' }],
    lyrics: '',
    copyrightShare: 0,
    relatedRightsShare: 100,
    ringtone: '',
    expanded: true,
});

const ALLOWED_TYPES = ['audio/wav', 'audio/x-wav', 'audio/flac', 'audio/x-flac'];
const ALLOWED_EXTS = ['.wav', '.flac'];
const MAX_SIZE = 1 * 1024 * 1024 * 1024; // 1 GB

export function useTrackManager(maxTracks) {
    const [tracks, setTracks] = useState([createTrack(nextId++)]);

    const addTrack = () => {
        if (tracks.length >= maxTracks) return;
        setTracks(prev => [...prev, createTrack(nextId++)]);
    };

    const removeTrack = (trackId) => {
        setTracks(prev => prev.length > 1 ? prev.filter(t => t.id !== trackId) : prev);
    };

    const updateTrack = (trackId, updater) => {
        setTracks(prev => prev.map(t => t.id === trackId ? { ...t, ...updater(t) } : t));
    };

    const updateTrackField = (trackId, field, value) => {
        updateTrack(trackId, () => ({ [field]: value }));
    };

    const updateTrackFile = (trackId, file) => {
        if (!file) return;
        const ext = '.' + file.name.split('.').pop().toLowerCase();
        if (!ALLOWED_EXTS.includes(ext) && !ALLOWED_TYPES.includes(file.type)) {
            toast.error('Допустимы только файлы WAV или FLAC');
            return;
        }
        if (file.size > MAX_SIZE) {
            toast.error('Размер файла превышает 1 ГБ');
            return;
        }
        updateTrack(trackId, () => ({ file }));
    };

    const toggleTrack = (trackId) => {
        updateTrack(trackId, t => ({ expanded: !t.expanded }));
    };

    // Persons
    const addPerson = (trackId) => {
        updateTrack(trackId, t => ({
            persons: [...t.persons, { id: nextPersonId++, name: '', role: 'Исполнитель' }],
        }));
    };
    const removePerson = (trackId, personId) => {
        updateTrack(trackId, t => ({
            persons: t.persons.length > 1 ? t.persons.filter(p => p.id !== personId) : t.persons,
        }));
    };
    const updatePerson = (trackId, personId, field, value) => {
        updateTrack(trackId, t => ({
            persons: t.persons.map(p => p.id === personId ? { ...p, [field]: value } : p),
        }));
    };

    // Lyricists
    const addLyricist = (trackId) => {
        updateTrack(trackId, t => ({
            lyricists: [...t.lyricists, { id: nextLId++, name: '' }],
        }));
    };
    const removeLyricist = (trackId, lId) => {
        updateTrack(trackId, t => ({
            lyricists: t.lyricists.length > 1 ? t.lyricists.filter(l => l.id !== lId) : t.lyricists,
        }));
    };
    const updateLyricist = (trackId, lId, value) => {
        updateTrack(trackId, t => ({
            lyricists: t.lyricists.map(l => l.id === lId ? { ...l, name: value } : l),
        }));
    };

    // Composers
    const addComposer = (trackId) => {
        updateTrack(trackId, t => ({
            composers: [...t.composers, { id: nextCId++, name: '' }],
        }));
    };
    const removeComposer = (trackId, cId) => {
        updateTrack(trackId, t => ({
            composers: t.composers.length > 1 ? t.composers.filter(c => c.id !== cId) : t.composers,
        }));
    };
    const updateComposer = (trackId, cId, value) => {
        updateTrack(trackId, t => ({
            composers: t.composers.map(c => c.id === cId ? { ...c, name: value } : c),
        }));
    };

    const resetTracks = () => {
        setTracks([createTrack(nextId++)]);
    };

    return {
        tracks,
        addTrack,
        removeTrack,
        updateTrackField,
        updateTrackFile,
        toggleTrack,
        addPerson, removePerson, updatePerson,
        addLyricist, removeLyricist, updateLyricist,
        addComposer, removeComposer, updateComposer,
        resetTracks,
    };
}
