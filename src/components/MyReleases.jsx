import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import toast from 'react-hot-toast';
import { fetchReleases, cancelRelease, createPayment, API_BASE_URL, LOGTO_RESOURCE } from '../services/api.js';

export default function MyReleases() {
    const { getAccessToken } = useAuth();
    const [releases, setReleases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedId, setExpandedId] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);
    const PAGE_SIZE = 20;
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            if (!getAccessToken) return;
            try {
                setLoading(true);
                setError(null);
                const token = await getAccessToken(LOGTO_RESOURCE);
                const data = await fetchReleases(token, page, PAGE_SIZE);
                if (isMounted) {
                    setReleases(Array.isArray(data) ? data : (data.content ?? []));
                    setTotalPages(data.totalPages ?? 0);
                    setTotalElements(data.totalElements ?? 0);
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
    }, [page]);

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handlePay = async (release) => {
        try {
            setActionLoading(release.id);
            const token = await getAccessToken(LOGTO_RESOURCE);
            const { confirmation_url } = await createPayment(
                token,
                release.id,
                `${release.artist?.trim() || 'Артист'} — ${release.title?.trim() || 'Релиз'}`
            );
            window.location.href = confirmation_url;
        } catch (e) {
            toast.error('Ошибка оплаты: ' + e.message);
            setActionLoading(null);
        }
    };

    const handleCancel = async (releaseId) => {
        if (!confirm('Вы уверены, что хотите отозвать заявку?')) return;

        try {
            setActionLoading(releaseId);
            const token = await getAccessToken(LOGTO_RESOURCE);
            await cancelRelease(token, releaseId);

            setReleases(releases.filter(r => r.id !== releaseId));
            toast.success('Заявка успешно отозвана');
        } catch (e) {
            toast.error('Ошибка: ' + e.message);
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
        return null;
    }

    if (error) {
        return (
            <div className="form-card" style={{textAlign: 'center', padding: '3rem'}}>
                <button onClick={() => window.location.reload()} className="btn-primary">
                    Обновить страницу
                </button>
            </div>
        );
    }

    if (!releases || releases.length === 0) {
        return (
            <>
                <div className="page-title-section">
                    <h1 className="page-title no-icon">Мои релизы</h1>
                </div>
                <div className="form-card" style={{textAlign: 'center', padding: '3rem'}}>
                    <p style={{fontSize: '4rem', margin: '0 0 1rem 0'}}>🎵</p>
                    <h3 style={{marginBottom: '0.5rem'}}>У вас пока нет загруженных релизов</h3>
                    <p style={{color: 'var(--text-muted)'}}>
                        Нажмите «+ Создать релиз», чтобы начать!
                    </p>
                </div>
            </>
        );
    }

    return (
        <>
        <div className="page-title-section">
            <h1 className="page-title no-icon">Мои релизы</h1>
        </div>
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
                                {release.paymentStatus === 'SUCCEEDED' && (
                                    <span className="payment-badge-succeeded">✓ Оплачен</span>
                                )}
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
                                        borderTop: '2px solid var(--border)',
                                        display: 'flex',
                                        gap: '0.75rem',
                                        flexWrap: 'wrap'
                                    }}>
                                        {release.paymentStatus !== 'SUCCEEDED' && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handlePay(release);
                                                }}
                                                disabled={isProcessing}
                                                className="btn-primary"
                                                style={{ opacity: isProcessing ? 0.5 : 1 }}
                                            >
                                                {isProcessing ? 'Переход...' : '💳 Оплатить (999 ₽)'}
                                            </button>
                                        )}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCancel(release.id);
                                            }}
                                            disabled={isProcessing}
                                            className="btn-danger"
                                            style={{ opacity: isProcessing ? 0.5 : 1 }}
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

        {totalPages > 1 && (
            <div className="pagination">
                <button
                    className="pagination-btn"
                    onClick={() => setPage(p => p - 1)}
                    disabled={page === 0}
                >
                    ← Назад
                </button>
                <span className="pagination-info">
                    Страница {page + 1} из {totalPages}
                </span>
                <button
                    className="pagination-btn"
                    onClick={() => setPage(p => p + 1)}
                    disabled={page >= totalPages - 1}
                >
                    Вперёд →
                </button>
            </div>
        )}
        </>
    );
}
