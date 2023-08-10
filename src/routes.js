import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import OfertasPage from "./pages/OfertasPage";
import SolicitantePage from "./pages/SolicitantePage";
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardLogedInPage from './pages/DashboardLogedInPage';
import SolicitantePersonalDataForm from "./sections/Solicitante/SolicitantePersonalDataForm";

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true},
        { path: 'offers', element: <OfertasPage /> },
        { path: 'app', element: <DashboardLogedInPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
      ],
    },
    {
      path: '/solicitante',
      element: <SimpleLayout />,
      children: [
        {element: <Navigate to="/solicitante/solicitante-page" />, index: true},
        { path: 'solicitante-page', element: <SolicitantePage /> },
        { path: 'formulario-solicitud', element: <SolicitantePersonalDataForm /> }
      ]
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {// define la ruta de entrada de la aplicación
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/solicitante" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
