import {
    GoogleAuthProvider,
    GithubAuthProvider,
    OAuthProvider,
    signInWithPopup,
    setPersistence,
    browserSessionPersistence,
    signInWithEmailAndPassword,
    signOut,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
} from 'firebase/auth';
import { firebaseAuth } from './firebaseConfig';

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const microsoftProvider = new OAuthProvider('microsoft.com');

microsoftProvider.setCustomParameters({
    prompt: 'select_account',
});

microsoftProvider.addScope('openid');
microsoftProvider.addScope('email');
microsoftProvider.addScope('profile');

// Sign in with Google functionality
export const signInWithGoogle = async () => {
    try {
        await setPersistence(firebaseAuth, browserSessionPersistence);
        const result = await signInWithPopup(firebaseAuth, googleProvider);
        return {
            success: true,
            user: result.user,
            error: null,
        };
    } catch (error) {
        return {
            success: false,
            user: null,
            error: error.message,
        };
    }
};

// Sign in with GitHub functionality
export const signInWithGithub = async () => {
    try {
        await setPersistence(firebaseAuth, browserSessionPersistence);
        const result = await signInWithPopup(firebaseAuth, githubProvider);
        return {
            success: true,
            user: result.user,
            error: null,
        };
    } catch (error) {
        return {
            success: false,
            user: null,
            error: error.message,
        };
    }
};

// Sign in with Microsoft functionality
export const signInWithMicrosoft = async () => {
    try {
        await setPersistence(firebaseAuth, browserSessionPersistence);
        const result = await signInWithPopup(firebaseAuth, microsoftProvider);
        return {
            success: true,
            user: result.user,
            error: null,
        };
    } catch (error) {
        return {
            success: false,
            user: null,
            error: error.message
        };
    }
};

// Sign in with email and password
export async function signInWithCredentials(email, password) {
    try {
        await setPersistence(firebaseAuth, browserSessionPersistence);
        const userCredential = await signInWithEmailAndPassword(
            firebaseAuth,
            email,
            password,
        );
        return {
            success: true,
            user: userCredential.user,
            error: null,
        };
    } catch (error) {
        return {
            success: false,
            user: null,
            error: error.message || 'Failed to sign in with email/password',
        };
    }
}

// Sign out functionality
export const firebaseSignOut = async () => {
    try {
        await signOut(firebaseAuth);
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error.message,
        };
    }
};

// Sign up with email and password
export async function signUpWithCredentials(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
        return { success: true, user: userCredential.user, error: null };
    } catch (error) {
        return { success: false, user: null, error: error instanceof Error ? error.message : "Registration failed" };
    }
}

// Send password reset email
export async function sendPasswordReset(email) {
    try {
        await sendPasswordResetEmail(firebaseAuth, email);
        return { success: true };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Password reset failed" };
    }
}

// Auth state observer
export const onAuthStateChanged = (callback) => {
    return firebaseAuth.onAuthStateChanged(callback);
};