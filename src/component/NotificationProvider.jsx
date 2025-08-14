import { SnackbarProvider } from 'notistack';
import { useSnackbar } from 'notistack';
import notificationService from '../service/NotificationService';
import React, { useEffect } from 'react';
function InitializeNotificationService() {
    const { enqueueSnackbar } = useSnackbar();
    useEffect(() => {
        notificationService.initialize({ enqueueSnackbar });

        return () => {
            notificationService.reset();
        };
    }, [enqueueSnackbar]);

    return null;
}

const NotificationProvider = ({ children }) => {
    return <SnackbarProvider
        maxSnack={3}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
        <InitializeNotificationService />
        {children}
    </SnackbarProvider>;
}

export default NotificationProvider