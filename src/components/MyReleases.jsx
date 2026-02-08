import React, { useState, useEffect, useRef } from 'react';
import { useLogto } from '@logto/react';
import { fetchReleases, cancelRelease } from '../api.js';

export default function MyReleases() {
    const { getAccessToken } = useLogto();
    const [releases, setReleases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedId, setExpandedId] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (!isInitialMount.current) return;

        let isMounted = true;

        const loadData = async () => {
            if (!getAccessToken) return;
            try {
                setLoading(true);
                const token = await getAccessToken('http://localhost:8080');
                const data = await fetchReleases(token);
                if (isMounted) {
                    setReleases(data);
                    isInitialMount.current = false;
                }
            } catch (e) {
                console.error("Ошибка:", e);
                if (isMounted) setError(e.message);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadData();
        return () => { isMounted = false; };
    }, []);

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleCancel = async (releaseId) => {
        if (!confirm('Вы уверены, что хотите отозвать заявку?')) return;

        try {
            setActionLoading(releaseId);
            const token = await getAccessToken('http://localhost:8080');
            await cancelRelease(token, releaseId);

            setReleases(releases.filter(r => r.id !== releaseId));
            alert('Заявка успешно отозвана');
        } catch (e) {
            alert('Ошибка: ' + e.message);
        } finally {
            setActionLoading(null);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Не указано';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    const getStatusText = (status) => {
        const statusMap = {
            'PENDING': 'На проверке',
            'REJECTED': 'Отклонено',
            'SENT_TO_ZVONKO': 'Принято',
            'CANCELLED': 'Отозвано'
        };
        return statusMap[status] || status;
    };

    if (loading) {
        return (
            <div style={{textAlign: 'center', padding: '3rem'}}>
                <div className="spinner" style={{
                    width: '40px',
                    height: '40px',
                    border: '4px solid var(--border)',
                    borderTopColor: 'var(--terracotta)',
                    margin: '0 auto 1rem'
                }}></div>
                <p>Загрузка ваших треков...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="form-card" style={{textAlign: 'center', padding: '3rem'}}>
                <p style={{color: 'var(--error)', marginBottom: '1rem'}}>
                    ❌ Ошибка загрузки: {error}
                </p>
                <button onClick={() => window.location.reload()} className="btn-primary">
                    Обновить страницу
                </button>
            </div>
        );
    }

    if (!releases || releases.length === 0) {
        return (
            <div className="form-card" style={{textAlign: 'center', padding: '3rem'}}>
                <p style={{fontSize: '4rem', margin: '0 0 1rem 0'}}>🎵</p>
                <h3 style={{marginBottom: '0.5rem'}}>У вас пока нет загруженных релизов</h3>
                <p style={{color: 'var(--text-muted)'}}>
                    Перейдите во вкладку "Создать релиз", чтобы начать!
                </p>
            </div>
        );
    }

    return (
        <div className="requests-list fade-in">
            {releases.map((release) => {
                const isExpanded = expandedId === release.id;
                const isProcessing = actionLoading === release.id;

                return (
                    <div key={release.id} className="request-card">
                        {/* Заголовок карточки */}
                        <div
                            className="request-header"
                            onClick={() => toggleExpand(release.id)}
                            style={{
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <div style={{ flex: 1 }}>
                                <div style={{
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    color: 'var(--text-primary)',
                                    marginBottom: '0.5rem'
                                }}>
                                    {release.artist?.trim() || 'Без имени'} — {release.title?.trim() || 'Без названия'}
                                </div>
                                <div style={{
                                    fontSize: '0.85rem',
                                    color: 'var(--text-secondary)',
                                    display: 'flex',
                                    gap: '1rem',
                                    alignItems: 'center'
                                }}>
                                    <span>{release.genre || 'Pop'}</span>
                                    {release.releaseDate && (
                                        <span>📅 {formatDate(release.releaseDate)}</span>
                                    )}
                                </div>
                            </div>

                            {/* Статус и стрелка справа */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                marginLeft: '1rem'
                            }}>
                                <span className={`status-badge status-${release.status.toLowerCase()}`}>
                                    {getStatusText(release.status)}
                                </span>
                                <span style={{
                                    fontSize: '1.2rem',
                                    transition: 'transform 0.3s',
                                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                    display: 'inline-block',
                                    color: 'var(--text-secondary)'
                                }}>
                                    ▼
                                </span>
                            </div>
                        </div>

                        {/* Раскрытая информация */}
                        {isExpanded && (
                            <div className="release-details">
                                {/* Детальная информация */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                    gap: '1.5rem',
                                    marginBottom: '1.5rem'
                                }}>
                                    <div>
                                        <div className="info-label">Дата релиза</div>
                                        <div className="info-value">
                                            {formatDate(release.releaseDate)}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="info-label">Создано</div>
                                        <div className="info-value">
                                            {formatDate(release.createdAt)}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="info-label">Жанр</div>
                                        <div className="info-value">{release.genre}</div>
                                    </div>
                                    <div>
                                        <div className="info-label">Файл</div>
                                        <div style={{
                                            fontSize: '0.8rem',
                                            wordBreak: 'break-all',
                                            fontFamily: 'monospace',
                                            color: 'var(--terracotta)'
                                        }}>
                                            {release.wavFileUrl || 'Нет'}
                                        </div>
                                    </div>
                                </div>

                                {/* Кнопки действий */}
                                {release.status === 'PENDING' && (
                                    <div style={{
                                        paddingTop: '1rem',
                                        borderTop: '2px solid var(--border)'
                                    }}>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCancel(release.id);
                                            }}
                                            disabled={isProcessing}
                                            className="btn-danger"
                                            style={{
                                                opacity: isProcessing ? 0.5 : 1
                                            }}
                                        >
                                            {isProcessing ? 'Отзыв...' : '🗑️ Отозвать заявку'}
                                        </button>
                                    </div>
                                )}

                                {release.status === 'REJECTED' && (
                                    <div style={{
                                        padding: '1rem',
                                        background: 'var(--status-rejected-bg)',
                                        borderRadius: '8px',
                                        color: 'var(--status-rejected)',
                                        fontSize: '0.9rem',
                                        border: '2px solid var(--status-rejected)'
                                    }}>
                                        ⚠️ Этот релиз был отклонен модератором
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
