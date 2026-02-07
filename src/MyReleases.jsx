import React, { useState, useEffect, useRef } from 'react';
import { useLogto } from '@logto/react';
import { fetchReleases } from './api';

export default function MyReleases() {
    const { getAccessToken } = useLogto();
    const [releases, setReleases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // ✅ Добавили состояние для ошибок
    const isInitialMount = useRef(true);

    useEffect(() => {
        console.log('🔄 MyReleases useEffect запущен');
        console.log('isInitialMount.current:', isInitialMount.current);

        if (!isInitialMount.current) {
            console.log('⛔ Выход: уже загружали данные');
            return;
        }

        let isMounted = true;

        const loadData = async () => {
            console.log('🚀 Начинаем загрузку релизов...');

            if (!getAccessToken) {
                console.log('⛔ getAccessToken недоступен');
                return;
            }

            try {
                setLoading(true);
                console.log('🔑 Получаем токен...');
                const token = await getAccessToken('http://localhost:8080');
                console.log('✅ Токен получен:', token ? 'Есть' : 'Нет');

                console.log('📡 Запрашиваем релизы...');
                const data = await fetchReleases(token);
                console.log('📦 Получены данные:', data);
                console.log('📊 Количество релизов:', data?.length);

                if (isMounted) {
                    setReleases(data);
                    isInitialMount.current = false;
                    console.log('✅ Релизы установлены в state');
                }
            } catch (e) {
                console.error("❌ Ошибка загрузки:", e);
                console.error("Детали ошибки:", e.message, e.response);
                if (isMounted) {
                    setError(e.message);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                    console.log('✅ Загрузка завершена');
                }
            }
        };

        loadData();
        return () => {
            console.log('🧹 Cleanup MyReleases');
            isMounted = false;
        };
    }, []); // ✅ Пустой массив зависимостей

    console.log('🎨 Рендер MyReleases:', { loading, releasesCount: releases.length, error });

    if (loading) {
        return <div className="text-center">Загрузка ваших треков...</div>;
    }

    // ✅ Показываем ошибку, если есть
    if (error) {
        return (
            <div style={{textAlign: 'center', padding: '3rem', color: '#dc2626'}}>
                <p>❌ Ошибка загрузки: {error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="btn-primary"
                    style={{marginTop: '1rem'}}
                >
                    Обновить страницу
                </button>
            </div>
        );
    }

    if (!releases || releases.length === 0) {
        return (
            <div style={{textAlign: 'center', padding: '3rem', color: '#888'}}>
                <p>У вас пока нет загруженных релизов.</p>
                <p>Перейдите во вкладку "Создать релиз", чтобы начать!</p>
            </div>
        );
    }

    // Остальной код рендера релизов...
    return (
        <div className="requests-list fade-in">
            {releases.map((release) => (
                <div key={release.id} className="request-card">
                    <div className="request-header" style={{cursor: 'default'}}>
                        <div className="info-main">
                            <strong>
                                {release.artist?.trim() || 'Без имени'} — {release.title?.trim() || 'Без названия'}
                            </strong>
                        </div>
                        <div className="info-meta">
                            <span>{release.releaseDate || 'Дата не указана'}</span>
                            <span className={`status-badge status-${release.status.toLowerCase()}`}>
                                {release.status === 'PENDING' && 'На проверке'}
                                {release.status === 'REJECTED' && 'Отклонено'}
                                {release.status === 'SENT_TO_ZVONKO' && 'Принято'}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
