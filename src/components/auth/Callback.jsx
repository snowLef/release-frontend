// src/Callback.jsx
import { useHandleSignInCallback } from '@logto/react';

const Callback = () => {
    const { isLoading } = useHandleSignInCallback(() => {
        // После успешного обмена кода на токен, просто уходим на главную
        window.location.href = '/';
    });

    return null;
};

export default Callback;