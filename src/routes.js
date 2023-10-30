import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './sections/@dashboard/blog/components/BlogPage';
import BuildingsPage from './sections/gestionCodificadores/edificios/components/BuildingsPage';
import CapacitiesPage from './sections/gestionCurso/capacidades/components/CapacitiesPage';
import CareersPage from './sections/gestionCodificadores/carreras/components/CareersPage';
import ClassroomsPage from './sections/gestionCodificadores/aulas/components/ClassroomsPage';
import CoursePage from './sections/gestionCurso/curso/components/CoursePage';
import FacultiesPage from './sections/gestionCodificadores/facultades/components/FacultiesPage';
import IncomeSourcesPage from './sections/gestionCodificadores/fuentesIngreso/components/IncomeSourcesPage';
import OffersPage from './sections/gestionCurso/ofertas/components/OffersPage';
import RequesterPage from './sections/solicitante/components/RequesterPage';
import RequestsPage from './sections/gestionCurso/solicitudes/components/RequestsPage';
import UserPage from './sections/@dashboard/user/components/UserPage';
import LoginPage from './sections/auth/login/LoginPage';
import Page404 from './layouts/404/Page404';
import ProductsPage from './sections/@dashboard/products/components/ProductsPage';
import DashboardLogedInPage from './sections/@dashboard/app/components/DashboardLogedInPage';
import QualificationPage from './sections/procesamiento/calificacion/components/QualificationPage';
import RequalificationPage from './sections/procesamiento/recalificacion/components/RequalificationPage';
import SolicitanteCarrerOptionsForm from './sections/solicitante/components/SolicitanteCarrerOptionsForm';
import SolicitantePersonalDataForm from './sections/solicitante/components/SolicitantePersonalDataForm';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'course', element: <CoursePage /> },
        { path: 'capacities', element: <CapacitiesPage /> },
        { path: 'offers', element: <OffersPage /> },
        { path: 'careers', element: <CareersPage /> },
        { path: 'faculties', element: <FacultiesPage /> },
        { path: 'buildings', element: <BuildingsPage /> },
        { path: 'classrooms', element: <ClassroomsPage /> },
        { path: 'incomeSources', element: <IncomeSourcesPage /> },
        { path: 'solicitudesConfirmadas', element: <RequestsPage solicitantesConfirmados /> },
        { path: 'solicitudesSinConfirmar', element: <RequestsPage solicitantesConfirmados={false} /> },
        { path: 'qualifications', element: <QualificationPage /> },
        { path: 'requalifications', element: <RequalificationPage /> },
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
