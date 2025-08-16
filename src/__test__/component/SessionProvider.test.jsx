import { render, waitFor, screen, cleanup } from '@testing-library/react'
import { vi, describe, expect, test, beforeEach, afterEach } from 'vitest'
import SessionProvider, { SessionContext } from '../../component/SessionProvider'
import { onAuthStateChanged } from '../../service/firebase/auth'
import '@testing-library/jest-dom/vitest'
import { act } from 'react'

// Mock Firebase auth module
vi.mock('../../service/firebase/auth', () => ({
    onAuthStateChanged: vi.fn()
}))

describe('SessionProvider', () => {
    let mockUnsubscribe
    beforeEach(() => {
        vi.clearAllMocks()
        // Reset mock functions' states
        mockUnsubscribe = vi.fn()
        onAuthStateChanged.mockImplementation((callback) => {
            // Store callback to trigger in tests
            window.__firebaseAuthCallback = callback
            return mockUnsubscribe
        })
    })
    afterEach(cleanup)

    // Base context consumer component
    const TestConsumer = () => {
        return (
            <SessionContext.Consumer>
                {value => (
                    <div>
                        <span data-testid="session">{JSON.stringify(value.session)}</span>
                        <span data-testid="loading">{value.loading.toString()}</span>
                    </div>
                )}
            </SessionContext.Consumer>
        )
    }

    test('Initial loading state', async () => {
        const { asFragment } = render(
            <SessionProvider>
                <TestConsumer />
            </SessionProvider>
        )
        expect(asFragment()).toMatchSnapshot()
        expect(screen.getByTestId('loading')).toHaveTextContent('true')
    })

    test('Successful authentication scenario', async () => {
        render(
            <SessionProvider>
                <TestConsumer />
            </SessionProvider>
        )
        // Mock Firebase auth callback
        const mockUser = {
            displayName: 'John Doe',
            email: 'john@example.com',
            photoURL: 'https://example.com/avatar.jpg'
        }
        act(() => {
            window.__firebaseAuthCallback(mockUser)
        })
        await waitFor(() => {
            const session = JSON.parse(screen.getByTestId('session').textContent)
            expect(session).toEqual({
                user: {
                    name: 'John Doe',
                    email: 'john@example.com',
                    image: 'https://example.com/avatar.jpg'
                }
            })
            expect(screen.getByTestId('loading')).toHaveTextContent('false')
        })
    })

    test('Unauthenticated user scenario', async () => {
        render(
            <SessionProvider>
                <TestConsumer />
            </SessionProvider>
        )
        // Trigger unauthenticated state
        act(() => {
            window.__firebaseAuthCallback(null)
        })
        await waitFor(() => {
            const session = JSON.parse(screen.getByTestId('session').textContent)
            expect(session).toBeNull()
            expect(screen.getByTestId('loading')).toHaveTextContent('false')
        })
    })

    test('Incomplete user information', async () => {
        render(
            <SessionProvider>
                <TestConsumer />
            </SessionProvider>
        )
        // Mock Firebase auth callback
        const mockUser = {
            displayName: null,
            email: null,
            photoURL: null
        }
        act(() => {
            window.__firebaseAuthCallback(mockUser)
        })
        await waitFor(() => {
            const session = JSON.parse(screen.getByTestId('session').textContent)
            expect(session).toEqual({
                user: {
                    name: '',
                    email: '',
                    image: ''
                }
            })
            expect(screen.getByTestId('loading')).toHaveTextContent('false')
        })
    })

    test('Unsubscribe on component unmount', () => {
        const { unmount } = render(
            <SessionProvider>
                <TestConsumer />
            </SessionProvider>
        )
        unmount()
        expect(mockUnsubscribe).toHaveBeenCalledTimes(1)
    })

    test('Update context method', async () => {
        let capturedSetSession
        render(
            <SessionProvider>
                <SessionContext.Consumer>
                    {value => {
                        capturedSetSession = value.setSession;
                        return (
                            <div>
                                <span data-testid="session">{JSON.stringify(value.session)}</span>
                                <span data-testid="loading">{value.loading.toString()}</span>
                            </div>
                        )
                    }}
                </SessionContext.Consumer>
            </SessionProvider>
        )
        // Test if setSession works
        const mockSession = { user: { name: 'Test User2' } }
        act(() => {
            capturedSetSession(mockSession)
        })
        await waitFor(() => {
            const session = JSON.parse(screen.getByTestId('session').textContent)
            expect(session).toEqual(mockSession)
        })
    })
})
