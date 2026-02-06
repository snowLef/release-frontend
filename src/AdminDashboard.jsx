// src/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { fetchReleases, updateReleaseStatus } from './api';
import './App.css';

export default function AdminDashboard({ user, onLogout }) {
    const [requests, setRequests] = useState([]);
    const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'history'
    const [expandedId, setExpandedId] = useState(null);

    // Загрузка данных
    useEffect(() => {
        const loadData = async () => {
            try {
                const token = user.token || "";
                const data = await fetchReleases(token);
                setRequests(data);
            } catch (e) {
                console.error(e);
            }
        };
        loadData();
    }, [user]);

    const handleStatusChange = async (id, newStatus) => {
        try {
            const token = user.token || "";
            await updateReleaseStatus(token, id, newStatus);
            // Обновляем локально
            setRequests(requests.map(req => req.id === id ? { ...req, status: newStatus } : req));
        } catch (e) { alert("Ошибка"); }
    };

    // Фильтрация для вкладок
    const pendingRequests = requests.filter(r => r.status === 'PENDING');
    const historyRequests = requests.filter(r => r.status !== 'PENDING');

    const displayedRequests = activeTab === 'pending' ? pendingRequests : historyRequests;

    return (
        <div className="container admin-container">
            <div className="top-bar">
                <div><h2>Админ-панель</h2><span className="user-badge">{user.name}</span></div>
                <button onClick={onLogout} className="btn-logout">Выйти</button>
            </div>

            {/* Вкладки */}
            <div className="tabs-nav">
                <button
                    className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pending')}
                >
                    Входящие
                    {pendingRequests.length > 0 && <span className="tab-count">{pendingRequests.length}</span>}
                </button>
                <button
                    className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                    onClick={() => setActiveTab('history')}
                >
                    История
                </button>
            </div>

            <div className="requests-list">
                {displayedRequests.length === 0 && <p style={{color:'#888', marginTop:'2rem'}}>Заявок в этой категории нет</p>}

                {displayedRequests.map((req) => (
                    <div key={req.id} className={`request-card status-${req.status.toLowerCase()}`}>
                        {/* Заголовок */}
                        <div className="request-header" onClick={() => setExpandedId(expandedId === req.id ? null : req.id)}>
                            <div className="info-main">
                                <span className="req-id">#{req.id}</span>
                                <strong>{req.artist} — {req.title}</strong>
                            </div>
                            <div className="info-meta">
                                <span className={`status-badge status-${req.status.toLowerCase()}`}>{req.status}</span>
                            </div>
                        </div>

                        {/* Детали */}
                        {expandedId === req.id && (
                            <div className="request-details fade-in">
                                <div className="details-grid">
                                    <div><small>Email:</small> <p>{req.userEmail}</p></div>
                                    <div><small>Файл:</small> <p className="link-blue">{req.wavFileUrl}</p></div>
                                    <div><small>Жанр:</small> <p>{req.genre}</p></div>
                                    <div><small>Дата:</small> <p>{req.releaseDate}</p></div>
                                </div>

                                {/* Кнопки действий только для Pending */}
                                {req.status === 'PENDING' && (
                                    <div className="admin-actions">
                                        <button className="btn-action btn-reject" onClick={() => handleStatusChange(req.id, 'REJECTED')}>Отклонить</button>
                                        <button className="btn-action btn-zvonko" onClick={() => handleStatusChange(req.id, 'SENT_TO_ZVONKO')}>В Zvonko</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}