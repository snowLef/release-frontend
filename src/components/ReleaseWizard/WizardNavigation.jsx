import React from 'react';

export default function WizardNavigation({
                                             currentTabIndex,
                                             tabsLength,
                                             prevTab,
                                             nextTab,
                                             loading,
                                             termsAccepted
                                         }) {
    const isLastTab = currentTabIndex >= tabsLength - 1;
    const submitDisabled = loading || !termsAccepted;

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

            {!isLastTab ? (
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
                    disabled={submitDisabled}
                    title={!termsAccepted ? 'Примите пользовательское соглашение перед отправкой' : undefined}
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
