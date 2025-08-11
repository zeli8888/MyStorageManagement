import * as React from 'react';
import { SignInPage } from '@toolpad/core/SignInPage';
import { Navigate, useNavigate, Link } from 'react-router';
import SessionContext from './UserProvider';
import LinearProgress from '@mui/material/LinearProgress';
import {
    signInWithGoogle,
    signInWithGithub,
    signInWithCredentials,
} from '../service/firebase/auth';
export default function LoginComponent() {
    const { session, setSession, loading } = React.useContext(SessionContext);
    const navigate = useNavigate();

    if (loading) {
        return <LinearProgress />;
    }

    if (session) {
        return <Navigate to="/" />;
    }

    return (
        <SignInPage
            sx={{
                '& .MuiContainer-root': {
                    height: 'auto !important',
                    minHeight: '100%'
                }
            }}
            providers={[
                { id: 'google', name: 'Google' },
                { id: 'github', name: 'GitHub' },
                { id: 'credentials', name: 'Email and Password' },
            ]}
            signIn={async (provider, formData, callbackUrl) => {
                let result;
                try {
                    if (provider.id === 'google') {
                        result = await signInWithGoogle();
                    }
                    if (provider.id === 'github') {
                        result = await signInWithGithub();
                    }
                    if (provider.id === 'credentials') {
                        const email = formData?.get('email');
                        const password = formData?.get('password');

                        if (!email || !password) {
                            return { error: 'Email and password are required' };
                        }

                        result = await signInWithCredentials(email, password);
                    }

                    if (result?.success && result?.user) {
                        // Convert Firebase user to Session format
                        const userSession = {
                            user: {
                                name: result.user.displayName || '',
                                email: result.user.email || '',
                                image: result.user.photoURL || '',
                            },
                        };
                        setSession(userSession);
                        navigate(callbackUrl || '/', { replace: true });
                        return {};
                    }
                    return { error: result?.error || 'Failed to sign in' };
                } catch (error) {
                    return {
                        error: error instanceof Error ? error.message : 'An error occurred',
                    };
                }
            }}
            slots={{
                signUpLink: () => <Link to="/register">Create Account</Link>,
                forgotPasswordLink: () => <Link to="/reset-password">Forgot Password?</Link>,
            }}
        />
    );
}