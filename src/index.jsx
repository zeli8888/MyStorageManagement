import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import IngredientComponent from './component/IngredientComponent';
import DishComponent from './component/DishComponent';
import DishRecordComponent from './component/DishRecordComponent';
import Typography from '@mui/material/Typography';

const router = createBrowserRouter([
  {
    Component: App, // root layout route
    children: [
      {
        path: '/',
        Component: Overview,
      },
      {
        path: 'foodstorage/ingredients',
        Component: IngredientComponent,
      },
      {
        path: 'foodstorage/dishes',
        Component: DishComponent,
      },
      {
        path: 'foodstorage/dishrecords',
        Component: DishRecordComponent,
      },
    ],
  },
]);

function Overview() {
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
