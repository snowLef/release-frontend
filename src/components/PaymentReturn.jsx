import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { syncPayment, API_BASE_URL, LOGTO_RESOURCE } from '../services/api.js';

export default function PaymentReturn() {
    const releaseId = new URLSearchParams(window.location.search).get('releaseId');
    const { isAuthenticated, isLoading, getAccessToken } = useAuth();
    const [state, setState] = useState('loading'); // loading | succeeded | pending | failed
    const [countdown, setCountdown] = useState(4);

    useEffect(() => {
        if (isLoading) return;

        if (!isAuthenticated || !releaseId) {
            setState('failed');
            return;
        }

        const run = async () => {
            try {
                const token = await getAccessToken(LOGTO_RESOURCE);
                const data = await syncPayment(token, releaseId);
                setState(data.status === 'SUCCEEDED' ? 'succeeded' : 'pending');
            } catch {
                setState('failed');
            }
        };

        run();
    }, [isLoading, isAuthenticated]);

    useEffect(() => {
        if (state !== 'succeeded') return;
        if (countdown === 0) {
            window.location.href = '/';
            return;
        }
        const t = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(t);
    }, [state, countdown]);

    const content = {
        loading: {
            icon: <div className="spinner" style={{
                width: '48px', height: '48px',
                border: '4px solid var(--border)',
                borderTopColor: 'var(--terracotta)',
                borderRadius: '50%',
                margin: '0 auto 1.5rem',
                animation: 'spin 0.8s linear infinite'
            }} />,
            title: 'Проверяем оплату…',
            body: 'Запрашиваем статус у платёжной системы, подождите секунду.',
            footer: null,
        },
        succeeded: {
            icon: <p style={{ fontSize: '4rem', margin: '0 0 1rem 0' }}>✅</p>,
            title: 'Оплата прошла успешно!',
            body: 'Ваш релиз передан на публикацию. Мы уведомим вас о статусе.',
            footer: <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Перенаправление через {countdown} сек…
            </p>,
        },
        pending: {
            icon: <p style={{ fontSize: '4rem', margin: '0 0 1rem 0' }}>⏳</p>,
            title: 'Платёж обрабатывается',
            body: 'Платёжная система ещё не подтвердила оплату. Проверьте статус релиза через несколько минут.',
            footer: null,
        },
        failed: {
            icon: <p style={{ fontSize: '4rem', margin: '0 0 1rem 0' }}>❌</p>,
            title: 'Не удалось проверить платёж',
            body: 'Что-то пошло не так при проверке статуса. Если деньги списались — свяжитесь с поддержкой.',
            footer: null,
        },
    }[state];

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-main)'
        }}>
            <div className="form-card" style={{
                textAlign: 'center',
                padding: '3rem 4rem',
                maxWidth: '480px'
            }}>
                {content.icon}
                <h2 style={{
                    fontFamily: 'Playfair Display, serif',
                    color: 'var(--primary-blue)',
                    marginBottom: '0.75rem'
                }}>
                    {content.title}
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    {content.body}
                </p>
                {content.footer}
                {state !== 'loading' && (
                    <button className="btn-primary" onClick={() => { window.location.href = '/'; }}>
                        В мои релизы
                    </button>
                )}
            </div>
        </div>
    );
}
