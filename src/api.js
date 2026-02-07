// src/api.js
const API_URL = 'http://localhost:8080/api/releases';

/**
 * Отправка нового релиза
 * @param {string} token - JWT токен, полученный от Logto
 * @param {object} releaseData - данные из формы
 * @param {File} file - WAV файл
 */
export const createRelease = async (token, releaseData, file) => {
    const formData = new FormData();

    const jsonPart = JSON.stringify({
        artist: releaseData.artist,
        title: releaseData.releaseTitle,
        genre: releaseData.genre,
        releaseDate: releaseData.releaseDate,
        upc: releaseData.upc,
        explicit: releaseData.explicit === 'yes'
    });

    formData.append("data", new Blob([jsonPart], { type: "application/json" }));
    if (file) formData.append("file", file);

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });

    if (!response.ok) throw new Error('Ошибка при отправке');
    return response.json();
};

/**
 * Получение списка релизов
 */
export const fetchReleases = async (token) => {
    console.log('🌐 fetchReleases вызван с токеном:', token ? 'Есть' : 'Нет');

    const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    console.log('📡 Ответ сервера:', response.status, response.statusText);

    if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Ошибка от сервера:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Данные распарсены:', data);
    return data;
};

/**
 * Смена статуса (для Админа)
 */
export const updateReleaseStatus = async (token, id, status) => {
    const response = await fetch(`${API_URL}/${id}/status?status=${status}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error('Ошибка обновления статуса');
    return response.json();
}