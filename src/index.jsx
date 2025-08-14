import ReactDOM from 'react-dom/client';
import App from './App';
import * as React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import IngredientComponent from './component/IngredientComponent';
import DishComponent from './component/DishComponent';
import DishRecordComponent from './component/DishRecordComponent';
import LoginComponent from './component/LoginComponent';
import SessionFilter from './component/SessionFilter';
import Typography from '@mui/material/Typography';
import RegistrationComponent from './component/RegistrationComponent';
import ResetPasswordComponent from './component/ResetPasswordComponent';
import SessionProvider from './component/SessionProvider';
import NotificationProvider from './component/NotificationProvider';
const router = createBrowserRouter([
  {
    Component: App, // root layout route
    children: [
      {
        path: '/',
        Component: SessionFilter,
        children: [
          {
            path: 'home',
            Component: ToBeDone
          },
          {
            path: 'foodstorage',
            children: [
              {
                path: 'ingredients',
                Component: IngredientComponent,
              },
              {
                path: 'dishes',
                Component: DishComponent,
              },
              {
                path: 'dishrecords',
                Component: DishRecordComponent,
              },
            ]
          },
        ]
      },
      {
        path: '/login',
        Component: LoginComponent,
      },
      {
        path: '/register',
        Component: RegistrationComponent,
      },
      {
        path: '/reset-password',
        Component: ResetPasswordComponent,
      },
    ],
  },
],
  {
    basename: import.meta.env.VITE_REACT_APP_CONTEXT
  }
);
function ToBeDone() {
  return (
    <Typography>To Be Done</Typography>
  )
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SessionProvider>
      <NotificationProvider>
        <RouterProvider router={router} />
      </NotificationProvider>
    </SessionProvider>
  </React.StrictMode>,
);