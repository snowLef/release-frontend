// src/api.js
export const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE_URL}/api/releases`;

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
export const fetchReleases = async (token, page = 0, size = 20) => {
    console.log('🌐 fetchReleases вызван с токеном:', token ? 'Есть' : 'Нет');

    const response = await fetch(`${API_URL}?page=${page}&size=${size}`, {
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

// ✅ Получить все релизы (для админа) - используем общий эндпоинт
export async function fetchAllReleases(token, page = 0, size = 20) {
    const response = await fetch(`${API_URL}?page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
}

// ✅ Изменить статус релиза (для админа)
export async function updateReleaseStatus(token, releaseId, status) {
    const response = await fetch(`${API_URL}/${releaseId}/status?status=${status}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
        // ❌ Убрали body, т.к. бэкенд ожидает @RequestParam
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return await response.json();
}

// Создать платёж (ЮKassa)
export async function createPayment(token, releaseId, releaseTitle) {
    const response = await fetch(`${API_BASE_URL}/api/payments`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            amount: '999.00',
            description: `Публикация релиза: ${releaseTitle}`,
            releaseId,
            returnUrl: `${window.location.origin}/payment-return?releaseId=${releaseId}`
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return response.json();
}

// Синхронизировать статус платежа с YooKassa
export async function syncPayment(token, releaseId) {
    const response = await fetch(`${API_BASE_URL}/api/payments/sync/${releaseId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
}

// Отозвать заявку (для артиста)
export async function cancelRelease(token, releaseId) {
    const response = await fetch(`${API_URL}/${releaseId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    return true;
}
