// MyRouterProvider.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createBrowserRouter, RouterProvider, MemoryRouter } from 'react-router-dom';
import MyRouterProvider from '../../component/MyRouterProvider';
import '@testing-library/jest-dom/vitest'

// Mock components to avoid rendering actual implementations
vi.mock('../../component/LoginComponent', () => ({ default: () => <div>Login</div> }));
vi.mock('../../component/RegistrationComponent', () => ({ default: () => <div>Register</div> }));
// Mock react-router functions
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        createBrowserRouter: vi.fn(),
        RouterProvider: vi.fn(() => <div>RouterProvider</div>),
    };
});

describe('MyRouterProvider Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.stubEnv('VITE_REACT_APP_CONTEXT', '/test');
    });

    it('should create router with correct configuration', () => {
        const mockRouter = {};
        createBrowserRouter.mockReturnValue(mockRouter);

        const { asFragment } = render(<MyRouterProvider />);
        expect(asFragment()).toMatchSnapshot();

        expect(createBrowserRouter).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({ basename: '/test' })
        );
        expect(RouterProvider.mock.calls[0][0]).toEqual(
            expect.objectContaining({ router: mockRouter })
        );
    });
});