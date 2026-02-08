import React from 'react';

export default function ReleaseBooklet({handleBookletChange, bookletFile}) {
    return (
        /* СЕКЦИЯ 10: Сопроводительные материалы */
        <div className="form-card">
            <div className="card-header">
                <h2 className="card-title">Сопроводительные материалы</h2>
            </div>

            <div className="card-body">
                <h3 style={{
                    fontSize: '1.1rem',
                    color: 'var(--primary-blue)',
                    marginBottom: '0.75rem',
                    fontWeight: 600
                }}>
                    Digital Booklet
                </h3>
                <p style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '1.25rem',
                    lineHeight: 1.6
                }}>
                    iTunes предлагает «цифровой буклет» с покупкой полного релиза. Буклет содержит
                    PDF-версию буклета/буклета, который пользователь получит при покупке релиза
                </p>

                <div className="upload-info-box" style={{marginBottom: '1rem'}}>
                    <div className="info-row">
                        <span className="info-label">Формат:</span>
                        <span className="info-value">.pdf</span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Максимальный размер:</span>
                        <span className="info-value">10 МБ</span>
                    </div>
                </div>

                <label className="booklet-upload-area">
                    <input
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handleBookletChange}
                        hidden
                    />
                    <div className="booklet-icon">📄</div>
                    <span className="upload-title">
                                {bookletFile
                                    ? bookletFile.name
                                    : "Перенесите файлы сюда или нажмите, чтобы загрузить"
                                }
                            </span>
                    {bookletFile && (
                        <span className="upload-subtitle">
                                    Размер: {(bookletFile.size / 1024 / 1024).toFixed(2)} МБ
                                </span>
                    )}
                </label>
            </div>
        </div>
    );
}