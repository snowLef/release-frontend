// src/Callback.jsx
import { useHandleSignInCallback } from '@logto/react';

const Callback = () => {
    const { isLoading } = useHandleSignInCallback(() => {
        // После успешного обмена кода на токен, просто уходим на главную
        window.location.href = '/';
    });

    if (isLoading) {
        return <div className="container"><h1>Завершение входа...</h1></div>;
    }

    return null;
};

export default Callback;