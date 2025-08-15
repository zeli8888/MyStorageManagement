import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, test, expect, vi } from 'vitest'
import { SessionContext } from '../component/SessionProvider'
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import App from '../App'
import '@testing-library/jest-dom/vitest'
// simulate react-router and DashboardLayout component
vi.mock('@toolpad/core/react-router', { spy: true })
vi.mock('@toolpad/core/DashboardLayout', { spy: true })

describe('App Component', () => {
  const mockSession = {
    user: { name: 'Test User', email: 'test@example.com', image: 'https://example.com/avatar.jpg' },
  }

  const Wrapper = ({ children }) => (
    <MemoryRouter>
      <SessionContext.Provider value={{ session: mockSession, loading: false, setSession: vi.fn(), setLoading: vi.fn(), rememberMe: false, setRememberMe: vi.fn() }}>
        {children}
      </SessionContext.Provider>
    </MemoryRouter>
  )

  // reset mock records
  beforeEach(() => {
    DashboardLayout.mockClear()
    ReactRouterAppProvider.mockClear()
  })

  test('should render core providers and layout', () => {
    render(<App />, { wrapper: Wrapper })

    // verify ReactRouterAppProvider is called
    expect(ReactRouterAppProvider.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        session: mockSession
      })
    )

    // verify DashboardLayout is called
    expect(DashboardLayout).toHaveBeenCalled()
  })

  test('verify elements in screen', () => {
    render(<App />, { wrapper: Wrapper })
    // verify footer
    expect(screen.getAllByText(/made with love by Ze Li/i).length).toBeGreaterThan(0)
    // verify user image
    const image = screen.getByRole('img', {
      name: /Test User/i // match the alt text
    });
    expect(image).toHaveAttribute('src', mockSession.user.image);
  })
})
