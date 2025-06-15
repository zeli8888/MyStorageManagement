import './App.css';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import { Outlet } from 'react-router'
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import BarChartIcon from '@mui/icons-material/BarChart';
// import LayersIcon from '@mui/icons-material/Layers';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
const NAVIGATION = [
  {
    kind: 'header',
    title: 'Tracker',
  },
  {
    title: 'Overview',
    icon: <BarChartIcon />,
  },
  {
    segment: 'foodstorage',
    title: 'Food Storage',
    // icon: <BarChartIcon />,
    icon: <DashboardIcon />,
    children: [
      {
        segment: 'ingredients',
        title: 'Ingredients',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'dishes',
        title: 'Dishes',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'dishrecords',
        title: 'Dish Records',
        icon: <DescriptionIcon />,
      },
    ],
  },
  // {
  //   segment: 'orders',
  //   title: 'Orders',
  //   icon: <ShoppingCartIcon />,
  // },
  {
    kind: 'divider',
  },
  // {
  //   kind: 'header',
  //   title: 'Analytics',
  // },
  // {
  //   segment: 'reports',
  //   title: 'Reports',
  //   icon: <BarChartIcon />,
  //   children: [
  //     {
  //       segment: 'sales',
  //       title: 'Sales',
  //       icon: <DescriptionIcon />,
  //     },
  //     {
  //       segment: 'traffic',
  //       title: 'Traffic',
  //       icon: <DescriptionIcon />,
  //     },
  //   ],
  // },
  // {
  //   segment: 'integrations',
  //   title: 'Integrations',
  //   icon: <LayersIcon />,
  // },
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

function App() {

  return (
    <ReactRouterAppProvider
      navigation={NAVIGATION}
      theme={demoTheme}
    >
      <DashboardLayout>
        <PageContainer>
          <Outlet />
        </PageContainer>
      </DashboardLayout>
    </ReactRouterAppProvider>
  );
}

export default App;
