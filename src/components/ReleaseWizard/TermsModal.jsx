import React, { useState, useRef, useEffect } from 'react';

// TODO: replace with legal text from lawyers
const AGREEMENT_SECTIONS = [
    {
        title: '1. Права на контент',
        text: 'Загружая материалы на платформу Bomjegrom Production, вы подтверждаете, что являетесь правообладателем или имеете все необходимые права, лицензии и разрешения на использование и распространение предоставленного контента, включая, но не ограничиваясь: музыкальные композиции, тексты песен, обложки, видеоматериалы и иные сопутствующие материалы. Вы гарантируете, что размещение данных материалов не нарушает авторские права, смежные права, права на товарные знаки или иные права интеллектуальной собственности третьих лиц.',
    },
    {
        title: '2. Достоверность предоставленных данных',
        text: 'Вы обязуетесь предоставлять точную и достоверную информацию при заполнении формы релиза, включая имена исполнителей, названия треков, метаданные, даты релиза и прочие сведения. Платформа не несёт ответственности за последствия, возникшие в результате предоставления ложной, неточной или вводящей в заблуждение информации. В случае обнаружения недостоверных данных администрация оставляет за собой право отклонить или удалить релиз без предварительного уведомления.',
    },
    {
        title: '3. Правила сервиса и модерация',
        text: 'Все загруженные релизы проходят модерацию перед публикацией на цифровых площадках. Администрация оставляет за собой право отклонить релиз, если он нарушает правила сервиса, содержит запрещённый контент, не соответствует техническим требованиям площадок или нарушает действующее законодательство Российской Федерации. Решение о публикации принимается модератором и является окончательным. Повторная подача релиза возможна после устранения замечаний.',
    },
    {
        title: '4. Ответственность за нарушения',
        text: 'Пользователь несёт полную ответственность за любые претензии третьих лиц, связанные с нарушением их прав при размещении контента через платформу. В случае поступления обоснованных жалоб на нарушение авторских или смежных прав администрация вправе немедленно приостановить распространение спорного контента, заблокировать аккаунт пользователя и передать информацию о нарушении в компетентные органы. Пользователь обязуется возместить все убытки, понесённые платформой в связи с такими нарушениями.',
    },
    {
        title: '5. Обработка персональных данных',
        text: 'Отправляя релиз, вы даёте согласие на обработку предоставленных персональных данных в целях оказания услуг по дистрибуции музыкального контента. Данные обрабатываются в соответствии с Федеральным законом от 27.07.2006 N 152-ФЗ «О персональных данных» и используются исключительно для выполнения обязательств перед пользователем, взаимодействия с цифровыми площадками и обеспечения работы сервиса. Передача данных третьим лицам осуществляется только в объёме, необходимом для размещения релиза на выбранных платформах.',
    },
];

export default function TermsModal({ isOpen, onAccept, onCancel }) {
    const [hasScrolled, setHasScrolled] = useState(false);
    const [checked, setChecked] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;

        setHasScrolled(false);
        setChecked(false);

        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const el = scrollRef.current;
        if (el && el.scrollHeight <= el.clientHeight) {
            setHasScrolled(true);
        }
    }, [isOpen]);

    const handleScroll = () => {
        const el = scrollRef.current;
        if (!el || hasScrolled) return;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 5) {
            setHasScrolled(true);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="terms-modal__overlay" onClick={onCancel}>
            <div className="terms-modal__card" onClick={(e) => e.stopPropagation()}>
                <div className="terms-modal__header">
                    <h3 className="terms-modal__title">Пользовательское соглашение</h3>
                </div>

                <div
                    className="terms-modal__scroll-body"
                    ref={scrollRef}
                    onScroll={handleScroll}
                >
                    {AGREEMENT_SECTIONS.map((section, index) => (
                        <React.Fragment key={index}>
                            <h4>{section.title}</h4>
                            <p>{section.text}</p>
                        </React.Fragment>
                    ))}
                </div>

                <div className={`terms-modal__scroll-hint ${hasScrolled ? 'terms-modal__scroll-hint--hidden' : ''}`}>
                    Прокрутите текст до конца, чтобы продолжить
                </div>

                <div className="terms-modal__footer">
                    <label className="terms-modal__checkbox-row">
                        <input
                            type="checkbox"
                            checked={checked}
                            disabled={!hasScrolled}
                            onChange={(e) => setChecked(e.target.checked)}
                        />
                        <span className={`terms-modal__checkbox-label ${!hasScrolled ? 'terms-modal__checkbox-label--disabled' : ''}`}>
                            Я являюсь правообладателем, ознакомлен с правилами сервиса и несу полную ответственность за предоставленные данные.
                        </span>
                    </label>

                    <div className="terms-modal__actions">
                        <button
                            type="button"
                            className="terms-modal__btn-cancel"
                            onClick={onCancel}
                        >
                            Отмена
                        </button>
                        <button
                            type="button"
                            className="terms-modal__btn-accept"
                            disabled={!hasScrolled || !checked}
                            onClick={onAccept}
                        >
                            Принять соглашение
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
