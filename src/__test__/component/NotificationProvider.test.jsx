import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import NotificationProvider from '../../component/NotificationProvider'
import notificationService from '../../service/NotificationService'
import { SnackbarProvider } from 'notistack'
import '@testing-library/jest-dom/vitest'

// Mock notification service module
vi.mock('../../service/NotificationService', () => ({
    default: {
        initialize: vi.fn(),
        reset: vi.fn()
    }
}))

// Mock notistack SnackbarProvider component for props verification
vi.mock('notistack', () => ({
    SnackbarProvider: vi.fn(({ children }) => <div>{children}</div>),
    useSnackbar: vi.fn(() => ({
        enqueueSnackbar: vi.fn()
    }))
}))

// Mock child component for rendering verification
const MockChild = () => <div>Test Child</div>

describe('NotificationProvider Component Tests', () => {
    beforeEach(() => {
        // Reset mock state before each test
        vi.clearAllMocks()
    })

    afterEach(cleanup)

    test('should render SnackbarProvider with correct props', () => {
        const { asFragment } = render(
            <NotificationProvider>
                <MockChild />
            </NotificationProvider>
        )
        expect(asFragment()).toMatchSnapshot()

        // Verify SnackbarProvider receives correct props
        expect(SnackbarProvider.mock.calls[0][0]).toEqual(
            expect.objectContaining({
                maxSnack: 3,
                autoHideDuration: 3000,
                anchorOrigin: { vertical: 'bottom', horizontal: 'left' }
            })
        )

        // Verify child component rendering
        expect(screen.getByText('Test Child')).toBeInTheDocument()
    })

    test('should initialize notification service on mount', () => {
        const { unmount } = render(<NotificationProvider><MockChild /></NotificationProvider>)

        // Verify initialize method is called
        expect(notificationService.initialize).toHaveBeenCalledWith({
            enqueueSnackbar: expect.any(Function)
        })

        // Simulate component unmount
        unmount()

        // Verify reset method is called on unmount
        expect(notificationService.reset).toHaveBeenCalled()
    })

    test('should reset notification service on component unmount', () => {
        const { unmount } = render(<NotificationProvider><MockChild /></NotificationProvider>)

        // Ensure initial state
        expect(notificationService.reset).not.toHaveBeenCalled()

        // Trigger unmount
        unmount()

        // Verify reset method is called
        expect(notificationService.reset).toHaveBeenCalledTimes(1)
    })
})
