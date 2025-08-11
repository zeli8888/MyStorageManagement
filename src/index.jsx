import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
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
    <RouterProvider router={router} />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
