import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import BuildingsPage from './pages/BuildingsPage';
import CapacitiesPage from './pages/CapacitiesPage';
import CareersPage from './pages/CareersPage';
import ClassroomsPage from './pages/ClassroomsPage';
import CoursePage from './pages/CoursePage';
import FacultiesPage from './pages/FacultiesPage';
import IncomeSourcesPage from './pages/IncomeSourcesPage';
import OffersPage from './pages/OffersPage';
import RequesterPage from './pages/RequesterPage';
import RequestsPage from './pages/RequestsPage';
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
        { path: 'curso', element: <CoursePage /> },
        { path: 'capacities', element: <CapacitiesPage /> },
        { path: 'offers', element: <OffersPage /> },
        { path: 'careers', element: <CareersPage /> },
        { path: 'faculties', element: <FacultiesPage /> },
        { path: 'buildings', element: <BuildingsPage /> },
        { path: 'classrooms', element: <ClassroomsPage /> },
        { path: 'incomeSources', element: <IncomeSourcesPage /> },
        { path: 'solicitudesConfirmadas', element: <RequestsPage solicitantesConfirmados /> },
        { path: 'solicitudesSinConfirmar', element: <RequestsPage solicitantesConfirmados={false} /> },
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
        { path: 'solicitante-page', element: <RequesterPage /> },
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
