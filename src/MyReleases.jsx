import React, { useState, useEffect, useRef } from 'react'; // <--- ДОБАВЬ ЭТО
import { useLogto } from '@logto/react';
import { fetchReleases } from './api';

export default function MyReleases() {
    const { getAccessToken } = useLogto();
    const [releases, setReleases] = useState([]); // Теперь useState будет определен
    const [loading, setLoading] = useState(true);
    const isInitialMount = useRef(true);

    useEffect(() => {
        // Если это не первая загрузка — выходим (защита от маунта/анмаунта)
        if (!isInitialMount.current) return;

        let isMounted = true;

        const loadData = async () => {
            if (!getAccessToken) return; // Защита
            try {
                setLoading(true);
                const token = await getAccessToken('http://localhost:8080');
                const data = await fetchReleases(token);
                if (isMounted) {
                    setReleases(data);
                    isInitialMount.current = false; // Помечаем, что данные уже есть
                }
            } catch (e) {
                console.error("Ошибка:", e);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadData();
        return () => { isMounted = false; };
    }, []);

    if (loading) return <div className="text-center">Загрузка ваших треков...</div>;

    if (releases.length === 0) {
        return (
            <div style={{textAlign: 'center', padding: '3rem', color: '#888'}}>
                <p>У вас пока нет загруженных релизов.</p>
                <p>Перейдите во вкладку "Создать релиз", чтобы начать!</p>
            </div>
        );
    }

    return (
        <div className="requests-list fade-in">
            {releases.map((req) => (
                <div key={req.id} className="request-card">
                    <div className="request-header" style={{cursor: 'default'}}>
                        <div className="info-main">
                            <strong>{req.artist} — {req.title}</strong>
                        </div>
                        <div className="info-meta">
                            <span>{req.releaseDate}</span>
                            <span className={`status-badge status-${req.status.toLowerCase()}`}>
                {req.status === 'PENDING' && 'На проверке'}
                                {req.status === 'REJECTED' && 'Отклонено'}
                                {req.status === 'SENT_TO_ZVONKO' && 'Принято'}
              </span>
                        </div>
                    </div>
                    {/* Если отклонено, можно вывести причину (если добавим это поле в будущем) */}
                    {req.status === 'REJECTED' && (
                        <div style={{padding: '0 1.5rem 1rem', color: '#dc2626', fontSize: '0.9rem'}}>
                            Статус: Отклонено модератором.
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}