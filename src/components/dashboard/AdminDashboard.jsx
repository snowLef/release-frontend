import React, { useState, useEffect } from 'react';
import { useLogto } from '@logto/react';
import toast from 'react-hot-toast';
import { fetchAllReleases, updateReleaseStatus } from '../../services/api.js';
import Header from '../common/Header.jsx';

export default function AdminDashboard({ user, scopes, onLogout }) {
    const { getAccessToken } = useLogto();
    const [releases, setReleases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        loadReleases();
    }, []);

    const loadReleases = async () => {
        try {
            setLoading(true);
            const token = await getAccessToken('http://localhost:8080');
            const data = await fetchAllReleases(token);
            setReleases(data);
        } catch (e) {
            console.error('Ошибка загрузки:', e);
            toast.error('Ошибка загрузки релизов: ' + e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (releaseId, newStatus) => {
        const statusNames = {
            'SENT_TO_ZVONKO': 'Принято',
            'REJECTED': 'Отклонено',
            'PENDING': 'На проверке'
        };

        if (!confirm(`Изменить статус на "${statusNames[newStatus]}"?`)) return;

        try {
            setActionLoading(releaseId);
            const token = await getAccessToken('http://localhost:8080');
            await updateReleaseStatus(token, releaseId, newStatus);

            setReleases(releases.map(r =>
                r.id === releaseId ? { ...r, status: newStatus } : r
            ));

            toast.success(`Статус изменён на: ${statusNames[newStatus]}`);
        } catch (e) {
            toast.error('Ошибка: ' + e.message);
        } finally {
            setActionLoading(null);
        }
    };

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Не указано';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
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

    const filteredReleases = filter === 'ALL'
        ? releases
        : releases.filter(r => r.status === filter);

    if (loading) return <div className="text-center">Загрузка...</div>;

    return (
        <div className="container">
            <Header user={user} scopes={scopes} onLogout={onLogout} />

            <div style={{padding: '1rem 0'}}>
                <h3 style={{marginBottom: '1rem'}}>Всего релизов: {releases.length}</h3>

                {/* Фильтры */}
                <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginBottom: '1.5rem',
                    flexWrap: 'wrap'
                }}>
                    {['ALL', 'PENDING', 'SENT_TO_ZVONKO', 'REJECTED', 'CANCELLED'].map(status => {
                        const count = status === 'ALL'
                            ? releases.length
                            : releases.filter(r => r.status === status).length;

                        return (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                style={{
                                    padding: '0.6rem 1.2rem',
                                    borderRadius: '8px',
                                    border: filter === status ? '2px solid #dc2626' : '1px solid #d1d5db',
                                    cursor: 'pointer',
                                    background: filter === status ? '#dc2626' : 'white',
                                    color: filter === status ? 'white' : '#374151',
                                    fontWeight: filter === status ? '600' : '400',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {status === 'ALL' ? '📋 Все' : getStatusText(status)} ({count})
                            </button>
                        );
                    })}
                </div>

                {/* Подсказка */}
                <div style={{
                    padding: '1rem',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    color: '#991b1b'
                }}>
                    💡 <strong>Подсказка:</strong> Кликните на карточку релиза, чтобы раскрыть детали и увидеть кнопки управления статусом
                </div>
            </div>

            {/* ✅ СПИСОК РЕЛИЗОВ С КНОПКАМИ */}
            <div className="requests-list fade-in">
                {filteredReleases.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem',
                        background: '#f9fafb',
                        borderRadius: '8px',
                        color: '#888'
                    }}>
                        <p style={{fontSize: '1.2rem', marginBottom: '0.5rem'}}>📭</p>
                        <p>Нет релизов с выбранным статусом</p>
                    </div>
                ) : (
                    filteredReleases.map((release) => {
                        const isExpanded = expandedId === release.id;
                        const isProcessing = actionLoading === release.id;

                        return (
                            <div
                                key={release.id}
                                className="request-card"
                                style={{
                                    marginBottom: '1rem',
                                    border: isExpanded ? '2px solid #dc2626' : '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    background: '#fff',
                                    boxShadow: isExpanded ? '0 4px 12px rgba(220, 38, 38, 0.2)' : 'none',
                                    overflow: 'hidden',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {/* Заголовок карточки - кликабельный */}
                                <div
                                    className="request-header"
                                    onClick={() => toggleExpand(release.id)}
                                    style={{
                                        cursor: 'pointer',
                                        padding: '1rem 1.5rem',
                                        background: isExpanded ? '#fef2f2' : 'transparent',
                                        transition: 'background 0.2s',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <div className="info-main">
                                        <strong style={{fontSize: '1.05rem'}}>
                                            {release.artist?.trim() || 'Без имени'} — {release.title?.trim() || 'Без названия'}
                                        </strong>
                                        <div style={{
                                            marginTop: '0.3rem',
                                            fontSize: '0.8rem',
                                            color: '#666'
                                        }}>
                                            <span style={{marginRight: '1rem'}}>🎵 {release.genre}</span>
                                            <span>👤 ID: {release.userId}</span>
                                        </div>
                                    </div>
                                    <div className="info-meta" style={{
                                        alignItems: 'center',
                                        display: 'flex',
                                        gap: '0.75rem'
                                    }}>
                                        <span className={`status-badge status-${release.status.toLowerCase()}`}>
                                            {getStatusText(release.status)}
                                        </span>
                                        <span style={{
                                            fontSize: '1.5rem',
                                            transition: 'transform 0.3s',
                                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                            display: 'inline-block'
                                        }}>
                                            ▼
                                        </span>
                                    </div>
                                </div>

                                {/* Раскрытая секция с деталями и кнопками */}
                                {isExpanded && (
                                    <div style={{
                                        padding: '1.5rem',
                                        borderTop: '2px solid #e5e7eb',
                                        background: '#fafafa',
                                        animation: 'slideDown 0.3s ease-out'
                                    }}>
                                        {/* Детали релиза */}
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                            gap: '1rem',
                                            marginBottom: '1.5rem',
                                            padding: '1rem',
                                            background: 'white',
                                            borderRadius: '8px'
                                        }}>
                                            <div>
                                                <div style={{
                                                    fontSize: '0.75rem',
                                                    color: '#888',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em'
                                                }}>User ID</div>
                                                <div style={{
                                                    fontWeight: '600',
                                                    fontSize: '0.95rem',
                                                    marginTop: '0.3rem',
                                                    fontFamily: 'monospace'
                                                }}>
                                                    {release.userId}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{
                                                    fontSize: '0.75rem',
                                                    color: '#888',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em'
                                                }}>Дата релиза</div>
                                                <div style={{fontWeight: '600', marginTop: '0.3rem'}}>
                                                    {release.releaseDate || 'Не указано'}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{
                                                    fontSize: '0.75rem',
                                                    color: '#888',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em'
                                                }}>Создано</div>
                                                <div style={{
                                                    fontWeight: '600',
                                                    marginTop: '0.3rem',
                                                    fontSize: '0.9rem'
                                                }}>
                                                    {formatDate(release.createdAt)}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{
                                                    fontSize: '0.75rem',
                                                    color: '#888',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em'
                                                }}>Файл WAV</div>
                                                <div style={{
                                                    fontWeight: '600',
                                                    fontSize: '0.8rem',
                                                    marginTop: '0.3rem',
                                                    wordBreak: 'break-all',
                                                    fontFamily: 'monospace',
                                                    color: '#3b82f6'
                                                }}>
                                                    {release.wavFileUrl || 'Нет'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* ✅ КНОПКИ УПРАВЛЕНИЯ СТАТУСАМИ */}
                                        <div style={{
                                            padding: '1rem',
                                            background: 'white',
                                            borderRadius: '8px',
                                            border: '2px dashed #d1d5db'
                                        }}>
                                            <div style={{
                                                fontSize: '0.85rem',
                                                fontWeight: '600',
                                                color: '#374151',
                                                marginBottom: '0.75rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em'
                                            }}>
                                                ⚙️ Управление статусом
                                            </div>
                                            <div style={{
                                                display: 'flex',
                                                gap: '0.75rem',
                                                flexWrap: 'wrap'
                                            }}>
                                                {/* Кнопка ПРИНЯТЬ */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleStatusChange(release.id, 'SENT_TO_ZVONKO');
                                                    }}
                                                    disabled={isProcessing || release.status === 'SENT_TO_ZVONKO'}
                                                    style={{
                                                        padding: '0.75rem 1.5rem',
                                                        background: release.status === 'SENT_TO_ZVONKO' ? '#d1fae5' : '#10b981',
                                                        color: release.status === 'SENT_TO_ZVONKO' ? '#065f46' : 'white',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        cursor: isProcessing || release.status === 'SENT_TO_ZVONKO' ? 'not-allowed' : 'pointer',
                                                        opacity: (isProcessing || release.status === 'SENT_TO_ZVONKO') ? 0.6 : 1,
                                                        fontWeight: '600',
                                                        fontSize: '0.95rem',
                                                        transition: 'all 0.2s',
                                                        boxShadow: release.status !== 'SENT_TO_ZVONKO' ? '0 2px 4px rgba(16, 185, 129, 0.3)' : 'none'
                                                    }}
                                                >
                                                    {release.status === 'SENT_TO_ZVONKO' ? '✅ Принято' : '✅ Принять'}
                                                </button>

                                                {/* Кнопка ОТКЛОНИТЬ */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleStatusChange(release.id, 'REJECTED');
                                                    }}
                                                    disabled={isProcessing || release.status === 'REJECTED'}
                                                    style={{
                                                        padding: '0.75rem 1.5rem',
                                                        background: release.status === 'REJECTED' ? '#fee2e2' : '#dc2626',
                                                        color: release.status === 'REJECTED' ? '#991b1b' : 'white',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        cursor: isProcessing || release.status === 'REJECTED' ? 'not-allowed' : 'pointer',
                                                        opacity: (isProcessing || release.status === 'REJECTED') ? 0.6 : 1,
                                                        fontWeight: '600',
                                                        fontSize: '0.95rem',
                                                        transition: 'all 0.2s',
                                                        boxShadow: release.status !== 'REJECTED' ? '0 2px 4px rgba(220, 38, 38, 0.3)' : 'none'
                                                    }}
                                                >
                                                    {release.status === 'REJECTED' ? '❌ Отклонено' : '❌ Отклонить'}
                                                </button>

                                                {/* Кнопка ВЕРНУТЬ НА ПРОВЕРКУ */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleStatusChange(release.id, 'PENDING');
                                                    }}
                                                    disabled={isProcessing || release.status === 'PENDING'}
                                                    style={{
                                                        padding: '0.75rem 1.5rem',
                                                        background: release.status === 'PENDING' ? '#fef3c7' : '#f59e0b',
                                                        color: release.status === 'PENDING' ? '#92400e' : 'white',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        cursor: isProcessing || release.status === 'PENDING' ? 'not-allowed' : 'pointer',
                                                        opacity: (isProcessing || release.status === 'PENDING') ? 0.6 : 1,
                                                        fontWeight: '600',
                                                        fontSize: '0.95rem',
                                                        transition: 'all 0.2s',
                                                        boxShadow: release.status !== 'PENDING' ? '0 2px 4px rgba(245, 158, 11, 0.3)' : 'none'
                                                    }}
                                                >
                                                    {release.status === 'PENDING' ? '🔄 На проверке' : '🔄 На проверку'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
