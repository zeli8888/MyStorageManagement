import { createTheme } from '@mui/material/styles';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import { Outlet } from 'react-router'
import { PageContainer } from '@toolpad/core/PageContainer';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import HomeIcon from '@mui/icons-material/Home';
import ManageAccountsSharpIcon from '@mui/icons-material/ManageAccountsSharp';
import FlatwareSharpIcon from '@mui/icons-material/FlatwareSharp';
import GrassIcon from '@mui/icons-material/Grass';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import SessionContext from './component/UserProvider';
import {
  firebaseSignOut,
  signInWithGoogle,
  onAuthStateChanged,
} from './component/firebase/auth';
import React from 'react';
const NAVIGATION = [
  {
    segment: 'home',
    title: 'Home',
    icon: <HomeIcon />,
  },
  {
    kind: 'header',
    title: 'Storage Tracker',
  },
  {
    segment: 'foodstorage',
    title: 'Food Storage',
    icon: <FlatwareSharpIcon />,
    children: [
      {
        segment: 'ingredients',
        title: 'Ingredients',
        icon: <GrassIcon />,
      },
      {
        segment: 'dishes',
        title: 'Dishes',
        icon: <DinnerDiningIcon />,
      },
      {
        segment: 'dishrecords',
        title: 'Dish Records',
        icon: <FormatListBulletedIcon />,
      },
    ],
  },
  {
    kind: 'divider',
  },

];

const demoTheme = createTheme({
  colorSchemes: { light: true, dark: true },
  cssVariables: {
    colorSchemeSelector: 'class',
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function SidebarFooter({ mini }) {
  return (
    <Typography
      variant="caption"
      sx={{ m: 1, whiteSpace: 'nowrap', overflow: 'hidden' }}
    >
      {mini ? '© Ze' : `© ${new Date().getFullYear()} Made with love by Ze Li`}
    </Typography>
  );
}

function CustomAppTitle() {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <ManageAccountsSharpIcon fontSize="large" color="primary" />
      <Typography variant="h6">Storage Management App</Typography>
      <Chip size="small" label="BETA" color="info" />
      {/* <Tooltip title="Connected to production">
        <CheckCircleIcon color="success" fontSize="small" />
      </Tooltip> */}
    </Stack>
  );
}

const AUTHENTICATION = {
  signIn: signInWithGoogle,
  signOut: firebaseSignOut,
};

function App() {
  const [session, setSession] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const sessionContextValue = React.useMemo(
    () => ({
      session,
      loading,
      setSession,
      setLoading,
    }),
    [session, loading],
  );

  React.useEffect(() => {
    // Returns an `unsubscribe` function to be called during teardown
    const unsubscribe = onAuthStateChanged((user) => {
      if (user) {
        setSession({
          user: {
            name: user.displayName || '',
            email: user.email || '',
            image: user.photoURL || '',
          },
        });
      } else {
        setSession(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <ReactRouterAppProvider
      navigation={NAVIGATION}
      theme={demoTheme}
      session={session}
      authentication={AUTHENTICATION}
    >
      <SessionContext.Provider value={sessionContextValue}>
        <DashboardLayout
          slots={{
            appTitle: CustomAppTitle,
            // toolbarActions: ToolbarActionsSearch,
            sidebarFooter: SidebarFooter,
          }}>
          <PageContainer>
            <Outlet />
          </PageContainer>
        </DashboardLayout>
      </SessionContext.Provider>
    </ReactRouterAppProvider>
  );
}

export default App;
