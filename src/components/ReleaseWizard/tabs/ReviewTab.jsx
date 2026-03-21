import React from 'react';
import { useWizard } from '../../../contexts/WizardContext';
import TermsModal from '../TermsModal';

const LANGUAGE_LABELS = {
    ru: 'Русский',
    en: 'English',
    de: 'Deutsch',
    fr: 'Français',
    es: 'Español',
};

const PLATFORM_LABELS = {
    appleMusic: 'Apple Music',
    vkMusic: 'ВК Музыка',
    yandexMusic: 'Яндекс Музыка',
    spotify: 'Spotify',
    tiktok: 'TikTok',
    youtubeMusic: 'YouTube Music',
    itunes: 'iTunes',
};

const TERRITORIES_LABELS = {
    all: 'Весь мир',
    selected: 'Выбранные страны',
    except: 'Весь мир, кроме указанных',
    cis: 'СНГ',
};

const PRICE_LABELS = {
    budget: 'Бюджетная',
    mid: 'Средняя',
    standard: 'Стандартная',
    back: 'Back',
    front: 'Front',
};

function ReviewRow({ label, value }) {
    if (!value && value !== 0) return null;
    return (
        <p>
            <strong>{label}:</strong> {value}
        </p>
    );
}

export default function ReviewTab() {
    const {
        formData,
        tracks,
        coverPreview,
        platformsData,
        termsAccepted,
        setTermsAccepted,
        showTermsModal,
        setShowTermsModal,
    } = useWizard();

    const enabledPlatforms = Object.entries(platformsData).filter(([, p]) => p.enabled);

    return (
        <div className="form-card">
            <div className="card-header">
                <h2 className="card-title">Проверка данных</h2>
                <p className="card-description">
                    Проверьте все данные перед отправкой релиза на модерацию
                </p>
            </div>

            <div className="card-body">

                {/* Основная информация */}
                <div className="review-section">
                    <h3>Основная информация</h3>
                    <ReviewRow label="Название" value={formData.releaseTitle || 'Не указано'} />
                    {formData.subtitle && <ReviewRow label="Подзаголовок" value={formData.subtitle} />}
                    <ReviewRow label="Тип релиза" value={formData.releaseType} />
                    <ReviewRow label="Язык" value={LANGUAGE_LABELS[formData.language] || formData.language} />
                    <ReviewRow label="Явный контент" value={formData.explicit === 'yes' ? 'Да' : 'Нет'} />
                    <ReviewRow label="Год авторских прав" value={formData.copyrightYear} />
                </div>

                {/* Обложка */}
                {coverPreview && (
                    <div className="review-section">
                        <h3>Обложка</h3>
                        <img
                            src={coverPreview}
                            alt="Обложка релиза"
                            style={{
                                width: 120,
                                height: 120,
                                objectFit: 'cover',
                                borderRadius: 8,
                                border: '2px solid var(--border)',
                                marginTop: '0.5rem',
                            }}
                        />
                    </div>
                )}

                {/* Жанр */}
                <div className="review-section">
                    <h3>Жанр</h3>
                    <ReviewRow label="Жанр" value={formData.genre} />
                    {formData.subgenre && <ReviewRow label="Поджанр" value={formData.subgenre} />}
                </div>

                {/* Лейбл */}
                <div className="review-section">
                    <h3>Лейбл</h3>
                    <ReviewRow
                        label="Лейбл"
                        value={
                            !formData.label || formData.label === 'independent'
                                ? 'Независимый'
                                : formData.label
                        }
                    />
                </div>

                {/* Треки */}
                <div className="review-section">
                    <h3>Треки ({tracks.length})</h3>
                    {tracks.map((track, i) => (
                        <div key={track.id} style={{
                            marginBottom: '1rem',
                            paddingLeft: '0.5rem',
                            borderLeft: '3px solid var(--color-accent, #D14532)',
                        }}>
                            <p style={{ fontWeight: 600 }}>
                                {i + 1}. {track.title || 'Без названия'}
                                {track.version && <span style={{ fontWeight: 400, color: 'var(--text-secondary)' }}> ({track.version})</span>}
                            </p>
                            {track.file && (
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    Файл: {track.file.name} ({(track.file.size / 1024 / 1024).toFixed(2)} МБ)
                                </p>
                            )}
                            {!track.file && (
                                <p style={{ color: 'var(--error, #D14532)', fontSize: '0.9rem' }}>
                                    Файл не загружен
                                </p>
                            )}
                            {track.persons.some(p => p.name) && (
                                <p style={{ fontSize: '0.9rem' }}>
                                    <strong>Исполнители:</strong>{' '}
                                    {track.persons.filter(p => p.name).map(p => `${p.name} (${p.role})`).join(', ')}
                                </p>
                            )}
                            {track.lyricists.some(l => l.name) && (
                                <p style={{ fontSize: '0.9rem' }}>
                                    <strong>Авторы слов:</strong>{' '}
                                    {track.lyricists.filter(l => l.name).map(l => l.name).join(', ')}
                                </p>
                            )}
                            {track.composers.some(c => c.name) && (
                                <p style={{ fontSize: '0.9rem' }}>
                                    <strong>Авторы музыки:</strong>{' '}
                                    {track.composers.filter(c => c.name).map(c => c.name).join(', ')}
                                </p>
                            )}
                            {track.lyrics && (
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    Текст: {track.lyrics.length > 80 ? track.lyrics.slice(0, 80) + '...' : track.lyrics}
                                </p>
                            )}
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                Права: &copy; {track.copyrightShare}% / &#8471; {track.relatedRightsShare}%
                            </p>
                            {track.ringtone && (
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    Рингтон: {track.ringtone}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Даты */}
                <div className="review-section">
                    <h3>Даты</h3>
                    <ReviewRow label="Дата релиза" value={formData.releaseDate || 'Не указана'} />
                    {formData.preorderDate && (
                        <ReviewRow label="Дата предзаказа" value={formData.preorderDate} />
                    )}
                </div>

                {/* Дистрибуция */}
                <div className="review-section">
                    <h3>Дистрибуция</h3>
                    <ReviewRow
                        label="Платформы"
                        value={formData.platforms === 'all' ? 'Все платформы' : 'Выбранные платформы'}
                    />
                    <ReviewRow
                        label="Территории"
                        value={TERRITORIES_LABELS[formData.territories] || formData.territories}
                    />
                    {formData.excludedCountries?.length > 0 && (
                        <ReviewRow
                            label="Исключённые страны"
                            value={formData.excludedCountries.join(', ')}
                        />
                    )}
                    {formData.earlyReleaseRussia && (
                        <p><strong>Ранний старт в России:</strong> Да</p>
                    )}
                    {formData.realtimeDelivery && (
                        <p><strong>Доставка в реальном времени:</strong> Да</p>
                    )}
                </div>

                {/* Идентификация */}
                {(formData.upc || formData.partnerCode) && (
                    <div className="review-section">
                        <h3>Идентификация</h3>
                        {formData.upc && <ReviewRow label="UPC" value={formData.upc} />}
                        {formData.partnerCode && <ReviewRow label="Партнёрский код" value={formData.partnerCode} />}
                    </div>
                )}

                {/* Площадки */}
                <div className="review-section">
                    <h3>Площадки</h3>
                    {enabledPlatforms.map(([key, platform]) => {
                        const lines = [];

                        if (platform.startDate) lines.push(`Дата старта: ${platform.startDate}`);
                        if (platform.startTime && platform.startTime !== '00:00') lines.push(`Время: ${platform.startTime}`);
                        if (platform.upcomingRelease) lines.push('Предстоящий релиз');
                        if (platform.fullVersion) lines.push('Полная версия треков');

                        // iTunes specifics
                        if (key === 'itunes') {
                            if (platform.releasePriceCategory)
                                lines.push(`Цена релиза: ${PRICE_LABELS[platform.releasePriceCategory] || platform.releasePriceCategory}`);
                            if (platform.trackPriceCategory)
                                lines.push(`Цена трека: ${PRICE_LABELS[platform.trackPriceCategory] || platform.trackPriceCategory}`);
                            if (platform.minPriceCategory) lines.push('Минимальная цена');
                            if (platform.appleDigitalMasters) lines.push('Apple Digital Masters');
                            if (platform.previewDisabled) lines.push('Превью отключено');
                        }

                        return (
                            <div key={key} style={{ marginBottom: '0.75rem' }}>
                                <p>
                                    <strong>{PLATFORM_LABELS[key] || key}</strong>
                                    {lines.length === 0 && (
                                        <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}> — стандартные настройки</span>
                                    )}
                                </p>
                                {lines.map((line, i) => (
                                    <p key={i} style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', paddingLeft: '1rem' }}>
                                        • {line}
                                    </p>
                                ))}
                            </div>
                        );
                    })}
                </div>

                {/* Пользовательское соглашение */}
                <div className="terms-agreement-section">
                    {!termsAccepted ? (
                        <button
                            type="button"
                            className="terms-agreement__btn-open"
                            onClick={() => setShowTermsModal(true)}
                        >
                            Прочитать и принять соглашение
                        </button>
                    ) : (
                        <span className="terms-agreement__accepted">
                            ✓ Соглашение принято
                        </span>
                    )}
                </div>
            </div>

            <TermsModal
                isOpen={showTermsModal}
                onAccept={() => {
                    setTermsAccepted(true);
                    setShowTermsModal(false);
                }}
                onCancel={() => setShowTermsModal(false)}
            />
        </div>
    );
}
