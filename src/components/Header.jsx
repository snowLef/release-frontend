import React, { useState, useRef, useEffect } from 'react';

export default function Header({ user, scopes = [], onLogout }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const isAdmin = scopes.includes('api:admin');

    // Закрываем dropdown при клике вне его
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Получаем первую букву email для аватара
    const getInitials = () => {
        return user.email ? user.email[0].toUpperCase() : '?';
    };

    return (
        <header className="app-header">
            <div className="header-container">
                {/* Левая часть - Логотип и название */}
                <div className="header-left">
                    <div className="logo-container">
                        <div className="logo-icon">🎵</div>
                        <div className="logo-text">
                            <span className="brand-name">bomjegrom</span>
                            {isAdmin && <span className="admin-badge">admin</span>}
                        </div>
                    </div>
                </div>

                {/* Правая часть - Пользователь */}
                <div className="header-right" ref={dropdownRef}>
                    <div
                        className="user-menu-trigger"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <div className="user-info">
                            <span className="user-name">{user.email}</span>
                            <span className="user-company">
                                {isAdmin ? 'Администратор' : 'Независимый артист'}
                            </span>
                        </div>
                        <div className="user-avatar">
                            {getInitials()}
                        </div>
                        <svg
                            className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                        >
                            <path
                                d="M5 7.5L10 12.5L15 7.5"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>

                    {/* Dropdown меню */}
                    {isDropdownOpen && (
                        <div className="user-dropdown">
                            <div className="dropdown-header">
                                <div className="dropdown-user-avatar">
                                    {getInitials()}
                                </div>
                                <div className="dropdown-user-info">
                                    <div className="dropdown-user-name">{user.email}</div>
                                    <div className="dropdown-user-id">ID: {user.id}</div>
                                </div>
                            </div>

                            <div className="dropdown-divider"></div>

                            <div className="dropdown-menu">
                                <button className="dropdown-item" onClick={() => {
                                    setIsDropdownOpen(false);
                                    // TODO: Добавить редактирование профиля
                                    alert('Редактирование профиля - в разработке');
                                }}>
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                        <path d="M12.75 2.25L15.75 5.25L5.25 15.75H2.25V12.75L12.75 2.25Z"
                                              stroke="currentColor"
                                              strokeWidth="1.5"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"/>
                                    </svg>
                                    <span>Редактировать профиль</span>
                                </button>

                                <button className="dropdown-item danger" onClick={() => {
                                    setIsDropdownOpen(false);
                                    onLogout();
                                }}>
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                        <path d="M6.75 15.75H3.75C3.35218 15.75 2.97064 15.592 2.68934 15.3107C2.40804 15.0294 2.25 14.6478 2.25 14.25V3.75C2.25 3.35218 2.40804 2.97064 2.68934 2.68934C2.97064 2.40804 3.35218 2.25 3.75 2.25H6.75M12 12.75L15.75 9M15.75 9L12 5.25M15.75 9H6.75"
                                              stroke="currentColor"
                                              strokeWidth="1.5"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"/>
                                    </svg>
                                    <span>Выйти</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
