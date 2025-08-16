import { render, screen, cleanup } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import SessionFilter from '../../component/SessionFilter'; // Adjust the import path
import { useLocation } from 'react-router';
import { SessionContext } from '../../component/SessionProvider';
import '@testing-library/jest-dom/vitest'

// Mock necessary modules
vi.mock('react-router', async (importOriginal) => ({
    ...(await importOriginal()),
    useLocation: vi.fn(),
    Navigate: ({ to }) => <div data-testid="navigate" data-to={to} />,
}));

vi.mock('../../component/FoodProvider', () => ({
    default: ({ children }) => <div>{children}</div>,
}
));

describe('../../component/SessionFilter', () => {
    beforeEach(() => {
        // Reset mock state before each test
        vi.clearAllMocks()
    })

    afterEach(cleanup)

    const mockLocation = { pathname: '/protected-route' };

    it('should match snapshot when loading', () => {

        const { container } = render(
            <MemoryRouter>
                <SessionContext value={
                    {
                        session: null,
                        loading: true,
                        setSession: vi.fn(),
                        setLoading: vi.fn(),
                        rememberMe: false,
                        setRememberMe: vi.fn(),
                    }
                }>
                    <SessionFilter />
                </SessionContext>
            </MemoryRouter>
        );

        expect(container).toMatchSnapshot();
    });

    it('should match snapshot when not authenticated', () => {
        useLocation.mockImplementation(() => mockLocation);

        const { container } = render(
            <MemoryRouter>
                <SessionContext value={
                    {
                        session: null,
                        loading: false,
                        setSession: vi.fn(),
                        setLoading: vi.fn(),
                        rememberMe: false,
                        setRememberMe: vi.fn(),
                    }
                }>
                    <SessionFilter />
                </SessionContext>
            </MemoryRouter>
        );

        expect(container).toMatchSnapshot();
        const redirect = screen.getByTestId('navigate');
        const redirectTo = redirect.getAttribute('data-to');
        expect(redirect).toBeInTheDocument();
        expect(redirectTo).toBe('/login?callbackUrl=%2Fprotected-route');
    });

    it('should match snapshot when authenticated', () => {

        const { container } = render(
            <SessionContext value={
                {
                    session: { user: 'test@example.com' },
                    loading: false,
                    setSession: vi.fn(),
                    setLoading: vi.fn(),
                    rememberMe: false,
                    setRememberMe: vi.fn(),
                }
            }>
                <SessionFilter />
            </SessionContext>
        );

        expect(container).toMatchSnapshot();
    });
});
