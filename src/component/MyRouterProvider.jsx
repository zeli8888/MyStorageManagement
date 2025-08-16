import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import IngredientComponent from './IngredientComponent';
import DishComponent from './DishComponent';
import DishRecordComponent from './DishRecordComponent';
import LoginComponent from './LoginComponent';
import SessionFilter from './SessionFilter';
import HomeComponent from './HomeComponent';
import RegistrationComponent from './RegistrationComponent';
import ResetPasswordComponent from './ResetPasswordComponent';
import App from '../App';
const MyRouterProvider = () => {
    const routes = [
        {
            Component: App, // root layout route
            children: [
                {
                    path: '/',
                    Component: SessionFilter,
                    children: [
                        {
                            path: 'home',
                            Component: HomeComponent
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
    ]
    const routerConfig = {
        basename: import.meta.env.VITE_REACT_APP_CONTEXT
    }
    const router = createBrowserRouter(routes, routerConfig);
    return (
        <RouterProvider router={router} />
    )
}

export default MyRouterProvider