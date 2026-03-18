import { useLogto } from '@logto/react';

const DEV_BYPASS = import.meta.env.DEV && import.meta.env.VITE_DEV_BYPASS_AUTH === 'true';

const devMock = {
    isAuthenticated: true,
    isLoading: false,
    signIn: () => Promise.resolve(),
    signOut: () => Promise.resolve(),
    getIdTokenClaims: () => Promise.resolve({ sub: 'dev-user', email: 'dev@localhost' }),
    getAccessToken: () => Promise.resolve('dev-token'),
};

export function useAuth() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return DEV_BYPASS ? devMock : useLogto();
}
