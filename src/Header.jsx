import React from 'react';

export default function Header({ user, scopes = [], onLogout }) {
    const isAdmin = scopes.includes('api:admin');

    return (
        <div
            className="top-bar"
            style={{
                background: 'var(--bg-secondary)', // ✅ Темный фон вместо синего
                color: 'var(--text-primary)',
                padding: '1.5rem',
                borderRadius: 'var(--border-radius)',
                border: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem'
            }}
        >
            <div style={{ flex: 1 }}>
                <h2 style={{
                    margin: 0,
                    marginBottom: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '1.5rem',
                    color: 'var(--text-primary)'
                }}>
                    {isAdmin ? '🔐 Кабинет Админа' : '🎵 Кабинет Артиста'}
                </h2>
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center',
                    flexWrap: 'wrap'
                }}>
                    <span style={{
                        background: 'var(--accent-dim)',
                        color: 'var(--accent)',
                        padding: '0.35rem 0.85rem',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                    }}>
                        <span>👤</span> {isAdmin ? 'Администратор' : 'Артист'}
                    </span>
                    <span style={{
                        background: 'var(--bg-card)',
                        padding: '0.35rem 0.85rem',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        color: 'var(--text-secondary)',
                        fontFamily: 'monospace'
                    }}>
                        ID: {user.id}
                    </span>
                    {scopes.length > 0 && (
                        <span style={{
                            background: 'var(--bg-card)',
                            padding: '0.35rem 0.85rem',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                            fontFamily: 'monospace'
                        }}>
                            🔑 Scopes: {scopes.join(', ')}
                        </span>
                    )}
                </div>
            </div>
            <button
                onClick={onLogout}
                className="btn-logout"
                style={{
                    background: 'transparent',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border)',
                    padding: '0.7rem 1.3rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    transition: 'all 0.2s',
                    fontSize: '0.9rem',
                    whiteSpace: 'nowrap'
                }}
            >
                🚪 Выйти
            </button>
        </div>
    );
}
