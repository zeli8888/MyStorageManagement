import ReactDOM from 'react-dom/client';
import * as React from 'react';
import SessionProvider from './component/SessionProvider';
import NotificationProvider from './component/NotificationProvider';
import MyRouterProvider from './component/MyRouterProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SessionProvider>
      <NotificationProvider>
        <MyRouterProvider />
      </NotificationProvider>
    </SessionProvider>
  </React.StrictMode>,
);