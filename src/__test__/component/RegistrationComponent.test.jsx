import { describe, expect, test, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import RegistrationComponent from '../../component/RegistrationComponent';
import { SessionContext } from '../../component/SessionProvider';
import { useNavigate } from 'react-router-dom';
import { act } from 'react';
import { signUpWithCredentials } from '../../service/firebase/auth';
import '@testing-library/jest-dom/vitest'

// Mock react-router-dom hooks
vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
    Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

// Mock Firebase authentication service
vi.mock('../../service/firebase/auth', () => ({
    signUpWithCredentials: vi.fn(),
}));

// Mock session context values
const mockSessionContext = {
    setSession: vi.fn(),
    rememberMe: false,
    setRememberMe: vi.fn(),
};

// Mock navigate function
const mockNavigate = vi.fn();

describe('RegistrationComponent', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useNavigate.mockImplementation(() => mockNavigate);
    });
    afterEach(cleanup)

    // Snapshot test
    test('renders correctly and matches snapshot', () => {
        const { asFragment } = render(
            <SessionContext.Provider value={mockSessionContext}>
                <RegistrationComponent />
            </SessionContext.Provider>
        );
        expect(asFragment()).toMatchSnapshot();
    });

    // Test form submission with valid credentials
    test('handles successful registration', async () => {
        const mockUser = {
            displayName: 'Test User',
            email: 'test@example.com',
            photoURL: 'http://example.com/avatar.jpg',
        };

        signUpWithCredentials.mockResolvedValue({
            success: true,
            user: mockUser,
        });

        render(
            <SessionContext.Provider value={mockSessionContext}>
                <RegistrationComponent />
            </SessionContext.Provider>
        );

        act(() => {
            fireEvent.change(screen.getByLabelText(/Email/i), {
                target: { value: 'test@example.com' },
            });
            fireEvent.change(screen.getByLabelText(/Password/i), {
                target: { value: 'password123' },
            });
            fireEvent.click(screen.getByText(/Create Account/i));
        })

        await waitFor(() => {
            expect(mockSessionContext.setSession).toHaveBeenCalledWith({
                user: {
                    name: 'Test User',
                    email: 'test@example.com',
                    image: 'http://example.com/avatar.jpg',
                },
            });
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });

    // Test form submission with null credentials
    test('handles successful registration', async () => {
        const mockUser = {
            displayName: null,
            email: null,
            photoURL: null,
        };

        signUpWithCredentials.mockResolvedValue({
            success: true,
            user: mockUser,
        });

        render(
            <SessionContext.Provider value={mockSessionContext}>
                <RegistrationComponent />
            </SessionContext.Provider>
        );

        act(() => {
            fireEvent.change(screen.getByLabelText(/Email/i), {
                target: { value: 'test@example.com' },
            });
            fireEvent.change(screen.getByLabelText(/Password/i), {
                target: { value: 'password123' },
            });
            fireEvent.click(screen.getByText(/Create Account/i));
        })

        await waitFor(() => {
            expect(mockSessionContext.setSession).toHaveBeenCalledWith({
                user: {
                    name: '',
                    email: '',
                    image: '',
                },
            });
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });

    // Test form submission with error
    test('handles registration failure', async () => {
        const errorMessage = 'Email already in use';
        signUpWithCredentials.mockResolvedValue({
            success: false,
            error: errorMessage,
        });

        render(
            <SessionContext.Provider value={mockSessionContext}>
                <RegistrationComponent />
            </SessionContext.Provider>
        );

        act(() => {
            fireEvent.change(screen.getByLabelText(/Email/i), {
                target: { value: 'existing@example.com' },
            });
            fireEvent.change(screen.getByLabelText(/Password/i), {
                target: { value: 'password123' },
            });
            fireEvent.click(screen.getByText(/Create Account/i));
        })

        await waitFor(() => {
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });
    });

    // Test form submission with missing error message
    test('handles registration failure', async () => {
        signUpWithCredentials.mockResolvedValue({
            success: false,
            error: null,
        });

        render(
            <SessionContext.Provider value={mockSessionContext}>
                <RegistrationComponent />
            </SessionContext.Provider>
        );

        act(() => {
            fireEvent.change(screen.getByLabelText(/Email/i), {
                target: { value: 'existing@example.com' },
            });
            fireEvent.change(screen.getByLabelText(/Password/i), {
                target: { value: 'password123' },
            });
            fireEvent.click(screen.getByText(/Create Account/i));
        })

        await waitFor(() => {
            expect(screen.getByText(/Registration failed/i)).toBeInTheDocument();
        });
    });

    // Test input field validation
    test('validates required fields', async () => {
        render(
            <SessionContext.Provider value={mockSessionContext}>
                <RegistrationComponent />
            </SessionContext.Provider>
        );

        act(() => {
            fireEvent.click(screen.getByText(/Create Account/i));
        })

        await waitFor(() => {
            expect(screen.getByLabelText(/Email/i)).toBeInvalid();
            expect(screen.getByLabelText(/Password/i)).toBeInvalid();
        });
    });

    // Test login link presence
    test('contains login link', () => {
        render(
            <SessionContext.Provider value={mockSessionContext}>
                <RegistrationComponent />
            </SessionContext.Provider>
        );

        expect(screen.getByText(/Already have an account/i)).toBeInTheDocument();
    });
});
