import { createBrowserRouter, RouterProvider } from 'react-router';
import IngredientComponent from './IngredientComponent';
import DishComponent from './DishComponent';
import DishRecordComponent from './DishRecordComponent';
import LoginComponent from './LoginComponent';
import SessionFilter from './SessionFilter';
import Typography from '@mui/material/Typography';
import RegistrationComponent from './RegistrationComponent';
import ResetPasswordComponent from './ResetPasswordComponent';
import App from '../App';
export const router = createBrowserRouter([
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

export const MyRouterProvider = ({ children }) => {
    return (
        <RouterProvider router={router}>
            {children}
        </RouterProvider>
    )
}

export default MyRouterProvider