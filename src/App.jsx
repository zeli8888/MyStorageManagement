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
import {
  firebaseSignOut,
  signInWithGoogle,
} from './service/firebase/auth';
import { useContext } from 'react';
import { SessionContext } from './component/SessionProvider';
export const NAVIGATION = [
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

export const demoTheme = createTheme({
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

export function SidebarFooter({ mini }) {
  return (
    <Typography
      variant="caption"
      sx={{ m: 1, whiteSpace: 'nowrap', overflow: 'hidden' }}
    >
      {mini ? '© Ze' : `© ${new Date().getFullYear()} Made with love by Ze Li`}
    </Typography>
  );
}

export function CustomAppTitle() {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <ManageAccountsSharpIcon fontSize="large" color="primary" />
      <Typography variant="h6" sx={{ display: { xs: 'none', sm: 'block' } }}>Storage Management App</Typography>
      <Chip size="small" label="BETA" color="info" />
      {/* <Tooltip title="Connected to production">
        <CheckCircleIcon color="success" fontSize="small" />
      </Tooltip> */}
    </Stack>
  );
}

export const AUTHENTICATION = {
  signIn: signInWithGoogle,
  signOut: firebaseSignOut,
};

function App() {
  const { session } = useContext(SessionContext);

  return (
    <ReactRouterAppProvider
      navigation={NAVIGATION}
      theme={demoTheme}
      session={session}
      authentication={AUTHENTICATION}
    >
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
    </ReactRouterAppProvider>
  );
}

export default App;
