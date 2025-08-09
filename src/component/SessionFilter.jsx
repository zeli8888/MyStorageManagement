import * as React from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import { Outlet, Navigate, useLocation } from 'react-router';
import SessionContext from './UserProvider';
import FoodProvider from './FoodProvider';

export default function SessionFilter() {
    const { session, loading } = React.useContext(SessionContext);
    const location = useLocation();

    if (loading) {
        return (
            <div style={{ width: '100%' }}>
                <LinearProgress />
            </div>
        );
    }

    if (!session) {
        // Add the `callbackUrl` search parameter
        const redirectTo = `/login?callbackUrl=${encodeURIComponent(location.pathname)}`;

        return <Navigate to={redirectTo} replace />;
    }

    return (
        <FoodProvider>
            <Outlet />
        </FoodProvider>
    );
}