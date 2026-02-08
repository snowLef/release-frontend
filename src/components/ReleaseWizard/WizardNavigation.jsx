import React from 'react';

export default function WizardNavigation({
                                             currentTabIndex,
                                             tabsLength,
                                             prevTab,
                                             nextTab,
                                             loading
                                         }) {
    return (
        <div className="form-navigation">
            {currentTabIndex > 0 && (
                <button
                    type="button"
                    onClick={prevTab}
                    className="btn-secondary btn-nav"
                >
                    ← Назад
                </button>
            )}

            {currentTabIndex < tabsLength - 1 ? (
                <button
                    type="button"
                    onClick={nextTab}
                    className="btn-primary btn-nav"
                    style={{ marginLeft: 'auto' }}
                >
                    Далее →
                </button>
            ) : (
                <button
                    type="submit"
                    className="btn-primary btn-submit"
                    disabled={loading}
                    style={{ marginLeft: 'auto' }}
                >
                    {loading ? (
                        <>
                            <span className="spinner"></span>
                            Отправка...
                        </>
                    ) : (
                        <>
                            📤 Отправить на модерацию
                        </>
                    )}
                </button>
            )}
        </div>
    );
}
