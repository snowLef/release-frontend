import React, { useState, useEffect } from 'react'; // <--- ДОБАВЬ ЭТО
import { useLogto } from '@logto/react';
import { fetchReleases } from './api';

export default function MyReleases() {
    const { getAccessToken } = useLogto();
    const [releases, setReleases] = useState([]); // Теперь useState будет определен
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const token = await getAccessToken('https://ruhxnl.logto.app/api');
                const data = await fetchReleases(token);
                setReleases(data);
            } catch (e) {
                console.error("Ошибка загрузки:", e);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [getAccessToken]);

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