import React from 'react';

export default function ReviewTab({ formData, persons, trackFiles, noAudioFiles }) {
    return (
        <div className="form-card">
            <div className="card-header">
                <h2 className="card-title">Проверка данных</h2>
                <p className="card-description">
                    Проверьте все данные перед отправкой
                </p>
            </div>
            <div className="card-body">
                <div className="review-section">
                    <h3>Основная информация</h3>
                    <p><strong>Название:</strong> {formData.releaseTitle || 'Не указано'}</p>
                    <p><strong>Исполнитель:</strong> {persons[0]?.name || 'Не указано'}</p>
                    <p><strong>Жанр:</strong> {formData.genre}</p>
                    <p><strong>Дата релиза:</strong> {formData.releaseDate || 'Не указана'}</p>
                </div>

                <div className="review-section">
                    <h3>Треки</h3>
                    <p><strong>Загружено треков:</strong> {trackFiles.length}</p>
                    {trackFiles.map((file, i) => (
                        <p key={i}>• {file.name}</p>
                    ))}
                    {noAudioFiles && <p>⚠️ Релиз без аудиофайлов</p>}
                </div>
            </div>
        </div>
    );
}
