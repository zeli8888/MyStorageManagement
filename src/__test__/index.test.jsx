import { render, screen, waitFor } from '@testing-library/react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { vi } from 'vitest'
import SessionProvider from '../component/SessionProvider'
import NotificationProvider from '../component/NotificationProvider'
import App from '../App'
import SessionFilter from '../component/SessionFilter'
import LoginComponent from '../component/LoginComponent'
import RegistrationComponent from '../component/RegistrationComponent'
import ResetPasswordComponent from '../component/ResetPasswordComponent'
import DishComponent from '../component/DishComponent'
import DishRecordComponent from '../component/DishRecordComponent'
import IngredientComponent from '../component/IngredientComponent'

function ToBeDone() {
  return <Typography>To Be Done</Typography>
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // root layout route
    children: [
      {
        path: '/',
        element: <SessionFilter />,
        children: [
          {
            path: 'home',
            element: <ToBeDone />,
          },
          {
            path: 'foodstorage',
            children: [
              {
                path: 'ingredients',
                element: <IngredientComponent />,
              },
              {
                path: 'dishes',
                element: <DishComponent />,
              },
              {
                path: 'dishrecords',
                element: <DishRecordComponent />,
              },
            ],
          },
        ],
      },
      {
        path: '/login',
        element: <LoginComponent />,
      },
      {
        path: '/register',
        element: <RegistrationComponent />,
      },
      {
        path: '/reset-password',
        element: <ResetPasswordComponent />,
      },
    ],
  },
], {
  basename: import.meta.env.VITE_REACT_APP_CONTEXT
});

// 模拟关键组件
vi.mock('../component/SessionFilter', () => ({
  default: ({ children }) => <div>{children}</div>
}));


// 设置基础测试环境
const renderWithProviders = (initialEntries = ['/']) => {
  return render(
    <SessionProvider>
      <NotificationProvider>
        <RouterProvider router={router} />
      </NotificationProvider>
    </SessionProvider>
  )
}

describe('集成测试', () => {
  beforeEach(() => {
    // 重置所有 mock 和 session 状态
    vi.clearAllMocks();
    localStorage.clear();
  })

  test('未登录时重定向到登录页', async () => {
    renderWithProviders(['/home']);
    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    })
  })

  test('已登录用户可以访问主页', async () => {
    // 模拟登录状态
    localStorage.setItem('authToken', 'mock-token');
    renderWithProviders(['/home']);
    await waitFor(() => {
      expect(screen.getByText('To Be Done')).toBeInTheDocument();
    })
  })

  test('食材页面路由正常', async () => {
    localStorage.setItem('authToken', 'mock-token');
    renderWithProviders(['/foodstorage/ingredients']);
    await waitFor(() => {
      expect(screen.getByTestId('ingredient-component')).toBeInTheDocument();
    })
  })

  test('公共路由无需登录', async () => {
    renderWithProviders(['/register']);
    await waitFor(() => {
      expect(screen.getByText(/Registration/i)).toBeInTheDocument();
    })
  })
})
