import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import BuildingsPage from './pages/BuildingsPage';
import CarrerasPage from './pages/CarrerasPage';
import ClassroomsPage from './pages/ClassroomsPage';
import CursoPage from './pages/CursoPage';
import FacultadesPage from './pages/FacultadesPage';
import OfertasPage from './pages/OfertasPage';
import SolicitantePage from './pages/SolicitantePage';
import SolicitudesPage from './pages/SolicitudesPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardLogedInPage from './pages/DashboardLogedInPage';
import SolicitanteCarrerOptionsForm from './sections/solicitante/SolicitanteCarrerOptionsForm';
import SolicitantePersonalDataForm from './sections/solicitante/SolicitantePersonalDataForm';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'curso', element: <CursoPage /> },
        { path: 'offers', element: <OfertasPage /> },
        { path: 'careers', element: <CarrerasPage /> },
        { path: 'faculties', element: <FacultadesPage /> },
        { path: 'buildings', element: <BuildingsPage /> },
        { path: 'classrooms', element: <ClassroomsPage /> },
        { path: 'solicitudesConfirmadas', element: <SolicitudesPage solicitantesConfirmados /> },
        { path: 'solicitudesSinConfirmar', element: <SolicitudesPage solicitantesConfirmados={false} /> },
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
        { element: <Navigate to="/solicitante/solicitante-page" />, index: true },
        { path: 'solicitante-page', element: <SolicitantePage /> },
        { path: 'formulario-personal-data', element: <SolicitantePersonalDataForm /> },
        { path: 'formulario-carreras', element: <SolicitanteCarrerOptionsForm /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      // define la ruta de entrada de la aplicación
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
