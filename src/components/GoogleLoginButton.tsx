import { Button, styled } from '@mui/material';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import env from '../env';

const LoginButton = styled(Button)({
    fontFamily: 'var(--text-secondary-font)',
    color: 'var(--button-text)',
    backgroundColor: 'var(--button-bg)',
    padding: '5px 10px',
    letterSpacing: -0.2,
    '&:hover': {
        backgroundColor: 'var(--button-bg--hover)',
    },
});

export function GoogleLoginButton() {
    const login = useGoogleLogin({
        flow: 'auth-code',

        onSuccess: async (res) => {
            try {
                const { code } = res as { code: string };
                await axios.post(`${env.VITE_API_URL}/auth/google/callback`, { code }, { withCredentials: true });

                const me = await axios.get(`${env.VITE_API_URL}/auth/me`, {
                    withCredentials: true,
                });

                console.log('Logged in user', me.data.user);
            } catch (err) {
                console.error('Backend auth failed :(', err);
            }
        },
        onError: (error) => {
            console.error('Login failed', error);
        },
    });

    return <LoginButton onClick={() => login()}>Sign in</LoginButton>;
}
