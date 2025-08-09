import {
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithPopup,
    setPersistence,
    browserSessionPersistence,
    signInWithEmailAndPassword,
    signOut,
} from 'firebase/auth';
import { firebaseAuth } from './firebaseConfig';

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

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

// Auth state observer
export const onAuthStateChanged = (callback) => {
    return firebaseAuth.onAuthStateChanged(callback);
};