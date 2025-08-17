import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginComponent from '../../component/LoginComponent';
import { SessionContext } from '../../component/SessionProvider';
import {
    signInWithGoogle,
    signInWithGithub,
    signInWithMicrosoft,
    signInWithCredentials,
} from '../../service/firebase/auth';
import '@testing-library/jest-dom/vitest'
import { act } from 'react';

// Mock external dependencies
vi.mock('@toolpad/core/SignInPage', () => ({
    SignInPage: ({ providers, signIn, slots }) => (
        <div data-testid="signin-page">
            {providers.map((p) => {
                if (p.id === 'credentials') {
                    return (
                        <form
                            key={p.id}
                            data-testid="credentials-form"
                            onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                signIn(p, formData, '/');
                            }}
                        >
                            <input name="email" data-testid="email-input" />
                            <input name="password" data-testid="password-input" />
                            <button type="submit">{p.name}</button>
                        </form>
                    );
                }
                return (
                    <button
                        key={p.id}
                        data-testid={`provider-${p.id}`}
                        onClick={() => signIn(p, null, null)} // callback url null test
                    >
                        {p.name}
                    </button>
                );
            })}
            {slots.signUpLink()}
            {slots.forgotPasswordLink()}
            {slots.rememberMe()}
        </div>
    ),
}));

vi.mock('../../service/firebase/auth', () => ({
    signInWithGoogle: vi.fn(),
    signInWithGithub: vi.fn(),
    signInWithMicrosoft: vi.fn(),
    signInWithCredentials: vi.fn(),
}));

vi.mock('react-router', async (importOriginal) => ({
    ...(await importOriginal()),
    Navigate: ({ to }) => <div data-testid="navigate" data-to={to} />,
}));

const mockSessionContext = {
    session: null,
    setSession: vi.fn(),
    loading: false,
    rememberMe: false,
    setRememberMe: vi.fn(),
};

describe('LoginComponent', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    afterEach(cleanup)

    // Snapshot test for default render
    it('renders correctly and matches snapshot', () => {
        const { asFragment } = render(
            <MemoryRouter>
                <SessionContext.Provider value={mockSessionContext}>
                    <LoginComponent />
                </SessionContext.Provider>
            </MemoryRouter>
        );
        expect(asFragment()).toMatchSnapshot();
    });

    // Test loading state
    it('shows loading spinner when loading', () => {
        render(
            <MemoryRouter>
                <SessionContext.Provider
                    value={{ ...mockSessionContext, loading: true }}
                >
                    <LoginComponent />
                </SessionContext.Provider>
            </MemoryRouter>
        );
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    // Test redirection when session exists
    it('redirects to home when session exists', () => {
        render(
            <MemoryRouter>
                <SessionContext.Provider
                    value={{ ...mockSessionContext, session: { user: {} } }}
                >
                    <LoginComponent />
                </SessionContext.Provider>
            </MemoryRouter>
        );
        expect(screen.getByTestId('navigate')).toBeInTheDocument();
    });

    // Test provider sign-in buttons
    it('has all provider buttons', () => {
        render(
            <MemoryRouter>
                <SessionContext.Provider value={mockSessionContext}>
                    <LoginComponent />
                </SessionContext.Provider>
            </MemoryRouter>
        );
        expect(screen.getByText('Google')).toBeInTheDocument();
        expect(screen.getByText('GitHub')).toBeInTheDocument();
        expect(screen.getByText('Microsoft')).toBeInTheDocument();
        expect(screen.getByText('Email and Password')).toBeInTheDocument();
    });

    // Test helper links
    it('contains sign up and password reset links', () => {
        render(
            <MemoryRouter>
                <SessionContext.Provider value={mockSessionContext}>
                    <LoginComponent />
                </SessionContext.Provider>
            </MemoryRouter>
        );
        expect(screen.getByText('Create Account')).toBeInTheDocument();
        expect(screen.getByText('Forgot Password?')).toBeInTheDocument();
    });

    // Test successful Google sign-in
    it('handles Google sign-in successfully', async () => {
        signInWithGoogle.mockResolvedValue({
            success: true,
            user: {
                displayName: 'Test User',
                email: 'test@example.com',
                photoURL: 'photo.jpg'
            }
        });

        render(
            <MemoryRouter>
                <SessionContext.Provider value={mockSessionContext}>
                    <LoginComponent />
                </SessionContext.Provider>
            </MemoryRouter>
        );

        await act(async () => {
            fireEvent.click(screen.getByText('Google'));
        })

        await vi.waitFor(() => {
            expect(signInWithGoogle).toHaveBeenCalledWith(false);
            expect(mockSessionContext.setSession).toHaveBeenCalledWith({
                user: {
                    name: 'Test User',
                    email: 'test@example.com',
                    image: 'photo.jpg'
                }
            });
        });
    });

    // Test successful Github sign-in
    it('handles Github sign-in successfully', async () => {
        signInWithGithub.mockResolvedValue({
            success: true,
            user: {
                displayName: null,
                email: null,
                photoURL: null
            }
        });

        render(
            <MemoryRouter>
                <SessionContext.Provider value={mockSessionContext}>
                    <LoginComponent />
                </SessionContext.Provider>
            </MemoryRouter>
        );

        await act(async () => {
            fireEvent.click(screen.getByText('GitHub'));
        })

        await vi.waitFor(() => {
            expect(signInWithGithub).toHaveBeenCalledWith(false);
            expect(mockSessionContext.setSession).toHaveBeenCalledWith({
                user: {
                    name: '',
                    email: '',
                    image: ''
                }
            });
        });
    });

    // Test failed GitHub sign-in with error
    it('handles GitHub sign-in failure', async () => {
        signInWithGithub.mockRejectedValue(new Error('Authentication failed'));

        render(
            <MemoryRouter>
                <SessionContext.Provider value={mockSessionContext}>
                    <LoginComponent />
                </SessionContext.Provider>
            </MemoryRouter>
        );

        await act(async () => {
            fireEvent.click(screen.getByText('GitHub'));
        })

        await vi.waitFor(() => {
            expect(signInWithGithub).toHaveBeenCalledWith(false);
            expect(mockSessionContext.setSession).not.toHaveBeenCalled();
        });
    });

    // Test failed GitHub sign-in with standard error message
    it('handles GitHub sign-in failure with standard error message', async () => {
        signInWithGithub.mockResolvedValue({
            success: false,
            error: 'test error message'
        });

        render(
            <MemoryRouter>
                <SessionContext.Provider value={mockSessionContext}>
                    <LoginComponent />
                </SessionContext.Provider>
            </MemoryRouter>
        );

        await act(async () => {
            fireEvent.click(screen.getByText('GitHub'));
        })

        await vi.waitFor(() => {
            expect(signInWithGithub).toHaveBeenCalledWith(false);
            expect(mockSessionContext.setSession).not.toHaveBeenCalled();
        });
    });

    // Test successful email/password sign-in
    it('handles email/password sign-in successfully', async () => {
        signInWithCredentials.mockResolvedValue({
            success: true,
            user: {
                displayName: 'Test User',
                email: 'test@example.com',
                photoURL: 'photo.jpg'
            }
        });

        render(
            <MemoryRouter>
                <SessionContext.Provider value={mockSessionContext}>
                    <LoginComponent />
                </SessionContext.Provider>
            </MemoryRouter>
        );

        await act(async () => {
            fireEvent.change(screen.getByTestId('email-input'), {
                target: { value: 'test@example.com' }
            });
            fireEvent.change(screen.getByTestId('password-input'), {
                target: { value: 'password123' }
            });
            fireEvent.submit(screen.getByTestId('credentials-form'));
        })

        await vi.waitFor(() => {
            expect(signInWithCredentials).toHaveBeenCalledWith(
                false,
                'test@example.com',
                'password123'
            );
            expect(mockSessionContext.setSession).toHaveBeenCalledWith({
                user: {
                    name: 'Test User',
                    email: 'test@example.com',
                    image: 'photo.jpg'
                }
            });
        });
    });

    it('shows error when email/password is missing', async () => {

        render(
            <MemoryRouter>
                <SessionContext.Provider value={mockSessionContext}>
                    <LoginComponent />
                </SessionContext.Provider>
            </MemoryRouter>
        );

        act(() => {
            fireEvent.submit(screen.getByTestId('credentials-form'));
        })

        await vi.waitFor(() => {
            expect(signInWithCredentials).not.toHaveBeenCalled();
        });
    });

    // Test remember me functionality
    it('passes rememberMe preference to auth providers', async () => {
        const customContext = {
            ...mockSessionContext,
            rememberMe: true
        };

        render(
            <MemoryRouter>
                <SessionContext.Provider value={customContext}>
                    <LoginComponent />
                </SessionContext.Provider>
            </MemoryRouter>
        );

        act(() => {
            fireEvent.click(screen.getByText('Microsoft'));
        })

        await vi.waitFor(() => {
            expect(signInWithMicrosoft).toHaveBeenCalledWith(true);
        });
    });

});