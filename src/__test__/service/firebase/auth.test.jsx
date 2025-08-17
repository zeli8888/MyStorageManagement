// auth.test.js
import { describe, expect, test, vi, beforeEach } from 'vitest'
import {
    signInWithGoogle,
    signInWithGithub,
    signInWithMicrosoft,
    signInWithCredentials,
    firebaseSignOut,
    signUpWithCredentials,
    sendPasswordReset,
    onAuthStateChanged as myOnAuthStateChanged
} from '../../../service/firebase/auth'
import { firebaseAuth } from '../../../service/firebase/firebaseConfig'

// Mock Firebase auth module
vi.mock('firebase/auth', async (importOriginal) => {
    const actual = await importOriginal()
    return {
        ...actual,
        GoogleAuthProvider: vi.fn(),
        GithubAuthProvider: vi.fn(),
        OAuthProvider: vi.fn(() => ({
            setCustomParameters: vi.fn(),
            addScope: vi.fn()
        })),
        signInWithPopup: vi.fn(),
        setPersistence: vi.fn(),
        browserSessionPersistence: 'session',
        browserLocalPersistence: 'local',
        signInWithEmailAndPassword: vi.fn(),
        signOut: vi.fn(),
        createUserWithEmailAndPassword: vi.fn(),
        sendPasswordResetEmail: vi.fn(),
    }
})

vi.mock('../../../service/firebase/firebaseConfig', () => ({
    firebaseAuth: {
        onAuthStateChanged: vi.fn()
    }
}))

describe('Authentication Service', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('Third-party authentication', () => {
        const mockUser = { uid: '123', email: 'test@example.com' }

        const testProviderAuth = (authFunction, providerName) => {
            test(`successful ${providerName} login returns user data`, async () => {
                const { signInWithPopup, setPersistence } = await import('firebase/auth')
                signInWithPopup.mockResolvedValue({ user: mockUser })
                setPersistence.mockResolvedValue()

                const result = await authFunction(true)

                expect(setPersistence).toHaveBeenCalledWith(firebaseAuth, 'local')
                expect(result.success).toBe(true)
                expect(result.user).toEqual(mockUser)
                expect(result.error).toBeNull()
            })

            test(`failed ${providerName} login returns error`, async () => {
                const { signInWithPopup, setPersistence } = await import('firebase/auth')
                const errorMessage = 'Login failed'
                signInWithPopup.mockRejectedValue(new Error(errorMessage))
                setPersistence.mockResolvedValue()

                const result = await authFunction(false)

                expect(setPersistence).toHaveBeenCalledWith(firebaseAuth, 'session')
                expect(result.success).toBe(false)
                expect(result.user).toBeNull()
                expect(result.error).toBe(errorMessage)
            })
        }

        testProviderAuth(signInWithGoogle, 'Google')
        testProviderAuth(signInWithGithub, 'GitHub')
        testProviderAuth(signInWithMicrosoft, 'Microsoft')
    })

    describe('Email/Password authentication', () => {
        const mockUser = { uid: '456', email: 'user@example.com' }

        test('successful email login returns user data', async () => {
            const { signInWithEmailAndPassword, setPersistence } = await import('firebase/auth')
            signInWithEmailAndPassword.mockResolvedValue({ user: mockUser })
            setPersistence.mockResolvedValue()

            const result = await signInWithCredentials(true, 'user@example.com', 'password')

            expect(setPersistence).toHaveBeenCalledWith(firebaseAuth, 'local')
            expect(result.success).toBe(true)
            expect(result.user).toEqual(mockUser)
        })

        test('failed email login returns error', async () => {
            const { signInWithEmailAndPassword, setPersistence } = await import('firebase/auth')
            const errorMessage = 'Invalid credentials'
            signInWithEmailAndPassword.mockRejectedValue(new Error(errorMessage))
            setPersistence.mockResolvedValue()

            const result = await signInWithCredentials(false, 'wrong@example.com', 'wrong')

            expect(setPersistence).toHaveBeenCalledWith(firebaseAuth, 'session')
            expect(result.success).toBe(false)
            expect(result.error).toContain(errorMessage)
        })

        test('failed email login returns error without message', async () => {
            const { signInWithEmailAndPassword, setPersistence } = await import('firebase/auth')
            signInWithEmailAndPassword.mockRejectedValue(new Error())
            setPersistence.mockResolvedValue()

            const result = await signInWithCredentials(false, 'wrong@example.com', 'wrong')

            expect(setPersistence).toHaveBeenCalledWith(firebaseAuth, 'session')
            expect(result.success).toBe(false)
            expect(result.error).toContain('Failed to sign in with email/password')
        })
    })

    describe('Sign Out', () => {
        test('successful sign out returns success status', async () => {
            const { signOut } = await import('firebase/auth')
            signOut.mockResolvedValue()

            const result = await firebaseSignOut()
            expect(signOut).toHaveBeenCalled()
            expect(result.success).toBe(true)
        })

        test('failed sign out returns error', async () => {
            const { signOut } = await import('firebase/auth')
            const errorMessage = 'Sign out failed'
            signOut.mockRejectedValue(new Error(errorMessage))

            const result = await firebaseSignOut()
            expect(result.success).toBe(false)
            expect(result.error).toBe(errorMessage)
        })
    })

    describe('Password Reset', () => {
        test('successful password reset returns success', async () => {
            const { sendPasswordResetEmail } = await import('firebase/auth')
            sendPasswordResetEmail.mockResolvedValue()

            const result = await sendPasswordReset('user@example.com')
            expect(sendPasswordResetEmail).toHaveBeenCalledWith(firebaseAuth, 'user@example.com')
            expect(result.success).toBe(true)
        })

        test('failed password reset returns error', async () => {
            const { sendPasswordResetEmail } = await import('firebase/auth')
            const errorMessage = 'Reset failed'
            sendPasswordResetEmail.mockRejectedValue(new Error(errorMessage))

            const result = await sendPasswordReset('invalid@example.com')
            expect(result.success).toBe(false)
            expect(result.error).toContain(errorMessage)
        })

        test('failed password reset returns error without message', async () => {
            const { sendPasswordResetEmail } = await import('firebase/auth')
            sendPasswordResetEmail.mockRejectedValue(new Error())

            const result = await sendPasswordReset('invalid@example.com')
            expect(result.success).toBe(false)
            expect(result.error).toContain('Password reset failed')
        })
    })

    describe('User Registration', () => {
        const mockUser = { uid: '789', email: 'new@example.com' }

        test('successful registration returns user data', async () => {
            const { createUserWithEmailAndPassword, setPersistence } = await import('firebase/auth')
            createUserWithEmailAndPassword.mockResolvedValue({ user: mockUser })
            setPersistence.mockResolvedValue()

            const result = await signUpWithCredentials(true, 'new@example.com', 'password')
            expect(setPersistence).toHaveBeenCalledWith(firebaseAuth, 'local')
            expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(firebaseAuth, 'new@example.com', 'password')
            expect(result.success).toBe(true)
            expect(result.user).toEqual(mockUser)
        })

        test('failed registration returns error', async () => {
            const { createUserWithEmailAndPassword, setPersistence } = await import('firebase/auth')
            const errorMessage = 'Email already exists'
            createUserWithEmailAndPassword.mockRejectedValue(new Error(errorMessage))
            setPersistence.mockResolvedValue()

            const result = await signUpWithCredentials(false, 'existing@example.com', 'weak')
            expect(setPersistence).toHaveBeenCalledWith(firebaseAuth, 'session')
            expect(result.success).toBe(false)
            expect(result.error).toContain(errorMessage)
        })

        test('failed registration returns error without message', async () => {
            const { createUserWithEmailAndPassword, setPersistence } = await import('firebase/auth')
            createUserWithEmailAndPassword.mockRejectedValue(new Error())
            setPersistence.mockResolvedValue()

            const result = await signUpWithCredentials(false, 'existing@example.com', 'weak')
            expect(setPersistence).toHaveBeenCalledWith(firebaseAuth, 'session')
            expect(result.error).toContain('Registration failed')
            expect(result.success).toBe(false)
        })
    })

    describe('Firebase state monitor', () => {
        test('onAuthStateChanged', async () => {
            const callback = vi.fn()

            myOnAuthStateChanged(callback)
            expect(firebaseAuth.onAuthStateChanged).toHaveBeenCalledWith(callback);
        })
    })
})
