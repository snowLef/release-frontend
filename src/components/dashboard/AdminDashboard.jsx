import React, { useState, useEffect } from 'react';
import { useLogto } from '@logto/react';
import toast from 'react-hot-toast';
import { fetchAllReleases, updateReleaseStatus, API_BASE_URL, LOGTO_RESOURCE } from '../../services/api.js';
import Header from '../common/Header.jsx';

export default function AdminDashboard({ user, scopes, onLogout }) {
    const { getAccessToken } = useLogto();
    const [releases, setReleases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);
    const [filter, setFilter] = useState('ALL');
    const PAGE_SIZE = 20;
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    useEffect(() => {
        loadReleases();
    }, [page]);

    const loadReleases = async () => {
        try {
            setLoading(true);
            const token = await getAccessToken(LOGTO_RESOURCE);
            const data = await fetchAllReleases(token, page, PAGE_SIZE);
            setReleases(data.content);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
        } catch (e) {
            console.error('Ошибка загрузки:', e);
            toast.error('Ошибка загрузки релизов: ' + e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (status) => {
        setFilter(status);
        setPage(0);
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
            const token = await getAccessToken(LOGTO_RESOURCE);
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

            <div className="admin-stats">
                <h3>Всего релизов: {totalElements}</h3>

                {/* Фильтры */}
                <div className="filter-buttons">
                    {['ALL', 'PENDING', 'SENT_TO_ZVONKO', 'REJECTED', 'CANCELLED'].map(status => (
                        <button
                            key={status}
                            onClick={() => handleFilterChange(status)}
                            className={`filter-btn${filter === status ? ' active' : ''}`}
                        >
                            {status === 'ALL' ? '📋 Все' : getStatusText(status)}
                        </button>
                    ))}
                </div>

                {/* Подсказка */}
                <div className="admin-hint">
                    💡 <strong>Подсказка:</strong> Кликните на карточку релиза, чтобы раскрыть детали и увидеть кнопки управления статусом
                </div>
            </div>

            {/* СПИСОК РЕЛИЗОВ С КНОПКАМИ */}
            <div className="requests-list fade-in" key={page}>
                {filteredReleases.length === 0 ? (
                    <div className="empty-state">
                        <p className="empty-state-icon">📭</p>
                        <p>Нет релизов с выбранным статусом</p>
                    </div>
                ) : (
                    filteredReleases.map((release) => {
                        const isExpanded = expandedId === release.id;
                        const isProcessing = actionLoading === release.id;

                        return (
                            <div
                                key={release.id}
                                className={`request-card${isExpanded ? ' expanded' : ''}`}
                            >
                                {/* Заголовок карточки - кликабельный */}
                                <div
                                    className={`request-header${isExpanded ? ' expanded' : ''}`}
                                    onClick={() => toggleExpand(release.id)}
                                >
                                    <div className="info-main">
                                        <strong className="release-title">
                                            {release.artist?.trim() || 'Без имени'} — {release.title?.trim() || 'Без названия'}
                                        </strong>
                                        <div className="release-meta">
                                            <span>🎵 {release.genre}</span>
                                            <span>👤 ID: {release.userId}</span>
                                        </div>
                                    </div>
                                    <div className="info-meta">
                                        <span className={`status-badge status-${release.status.toLowerCase()}`}>
                                            {getStatusText(release.status)}
                                        </span>
                                        <span className={`chevron${isExpanded ? ' open' : ''}`}>▼</span>
                                    </div>
                                </div>

                                {/* Раскрытая секция с деталями и кнопками */}
                                {isExpanded && (
                                    <div className="release-details">
                                        {/* Детали релиза */}
                                        <div className="release-details-grid">
                                            <div>
                                                <div className="detail-label">User ID</div>
                                                <div className="detail-value detail-value--mono">
                                                    {release.userId}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="detail-label">Дата релиза</div>
                                                <div className="detail-value">
                                                    {release.releaseDate || 'Не указано'}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="detail-label">Создано</div>
                                                <div className="detail-value detail-value--sm">
                                                    {formatDate(release.createdAt)}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="detail-label">Файл WAV</div>
                                                <div className="detail-value detail-value--link">
                                                    {release.wavFileUrl || 'Нет'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* КНОПКИ УПРАВЛЕНИЯ СТАТУСАМИ */}
                                        <div className="status-controls">
                                            <div className="status-controls-label">
                                                ⚙️ Управление статусом
                                            </div>
                                            <div className="status-buttons">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleStatusChange(release.id, 'SENT_TO_ZVONKO');
                                                    }}
                                                    disabled={isProcessing || release.status === 'SENT_TO_ZVONKO'}
                                                    className={`btn-status-action btn-accept${release.status === 'SENT_TO_ZVONKO' ? ' active' : ''}`}
                                                >
                                                    {release.status === 'SENT_TO_ZVONKO' ? '✅ Принято' : '✅ Принять'}
                                                </button>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleStatusChange(release.id, 'REJECTED');
                                                    }}
                                                    disabled={isProcessing || release.status === 'REJECTED'}
                                                    className={`btn-status-action btn-reject${release.status === 'REJECTED' ? ' active' : ''}`}
                                                >
                                                    {release.status === 'REJECTED' ? '❌ Отклонено' : '❌ Отклонить'}
                                                </button>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleStatusChange(release.id, 'PENDING');
                                                    }}
                                                    disabled={isProcessing || release.status === 'PENDING'}
                                                    className={`btn-status-action btn-pending-status${release.status === 'PENDING' ? ' active' : ''}`}
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
        </div>
    );
}
