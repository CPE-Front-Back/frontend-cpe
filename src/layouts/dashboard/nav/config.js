// component
import SvgColor from '../../../components/svg-color';
import { UseProcessingStatus } from '../../../sections/procesamiento/context/ProcessingStatus';

// ----------------------------------------------------------------------

export default function navConfig() {
  const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

  const {
    canAsigPrimVuelta,
    canAsigSegVuelta,
    canAsigClassrooms,
    canAsigActs,
    canCalify,
    canRecalify,
    canActOffers,
    canActCapacities,
    canActRequests,
  } = UseProcessingStatus();

  const navConfig = [
    /* {
      title: 'dashboard',
      path: '/dashboard/app',
      icon: icon('ic_analytics'),
    },
    {
      title: 'solicitante',
      path: '/solicitante/solicitante-page',
      icon: icon('ic_analytics'),
    }, */
    {
      title: 'Gestión de curso',
      icon: icon('ic_analytics'),
      showSubItems: false,
      subItems: [
        {
          title: 'Cambiar curso activo',
          path: '/dashboard/curso',
          icon: icon('ic_analytics'),
        },
        {
          title: 'Actualizar capacidades',
          path: '/dashboard/capacities',
          icon: icon('ic_analytics'),
          isDisabled: canActCapacities,
        },
        {
          title: 'Actualizar ofertas',
          path: '/dashboard/offers',
          icon: icon('ic_analytics'),
          isDisabled: canActOffers,
        },
        {
          title: 'Actualizar solicitudes sin confirmar',
          path: '/dashboard/solicitudesSinConfirmar',
          icon: icon('ic_analytics'),
          isDisabled: canActRequests,
        },
        {
          title: 'Actualizar solicitudes confirmadas',
          path: '/dashboard/solicitudesConfirmadas',
          icon: icon('ic_analytics'),
          isDisabled: canActRequests,
        },
      ],
    },
    {
      title: 'Gestión de codificadores',
      icon: icon('ic_analytics'),
      showSubItems: false,
      subItems: [
        {
          title: 'Actualizar aulas',
          path: '/dashboard/classrooms',
          icon: icon('ic_analytics'),
        },
        {
          title: 'Actualizar carreras',
          path: '/dashboard/careers',
          icon: icon('ic_analytics'),
        },
        {
          title: 'Actualizar edificios',
          path: '/dashboard/buildings',
          icon: icon('ic_analytics'),
        },
        {
          title: 'Actualizar facultades',
          path: '/dashboard/faculties',
          icon: icon('ic_analytics'),
        },
        {
          title: 'Actualizar fuentes de Ingreso',
          path: '/dashboard/incomeSources',
          icon: icon('ic_analytics'),
        },
      ],
    },
    {
      title: 'Procesamiento',
      icon: icon('ic_analytics'),
      showSubItems: false,
      subItems: [
        {
          title: 'Asignar Carreras 1ra vuelta',
          icon: icon('ic_analytics'),
          isDisabled: canAsigPrimVuelta,
        },
        {
          title: 'Asignar Carreras 2da vuelta',
          path: '/dashboard/apps',
          icon: icon('ic_analytics'),
          isDisabled: canAsigSegVuelta,
        },
        {
          title: 'Asignar Aulas',
          path: '/dashboard/apps',
          icon: icon('ic_analytics'),
          isDisabled: canAsigClassrooms,
        },
        {
          title: 'Asignar Actas',
          path: '/dashboard/apps',
          icon: icon('ic_analytics'),
          isDisabled: canAsigActs,
        },
        {
          title: 'Calificación',
          path: '/dashboard/apps',
          icon: icon('ic_analytics'),
          isDisabled: canCalify,
        },
        {
          title: 'Recalificación',
          path: '/dashboard/apps',
          icon: icon('ic_analytics'),
          isDisabled: canRecalify,
        },
      ],
    },
    {
      title: 'Reportes',
      icon: icon('ic_analytics'),
      showSubItems: false,
      subItems: [
        {
          title: 'Reporte 1',
          path: 'd',
          icon: icon('ic_analytics'),
        },
        {
          title: 'Reporte 2',
          path: 'd',
          icon: icon('ic_analytics'),
        },
        {
          title: 'Reporte 3',
          path: 'd',
          icon: icon('ic_analytics'),
        },
        {
          title: 'Reporte 4',
          path: 'd',
          icon: icon('ic_analytics'),
        },
        {
          title: 'Reporte 5',
          path: 'd',
          icon: icon('ic_analytics'),
        },
        {
          title: 'Reporte 6',
          path: 'd',
          icon: icon('ic_analytics'),
        },
        {
          title: 'Reporte 7',
          path: 'd',
          icon: icon('ic_analytics'),
        },
        {
          title: 'Reporte 8',
          path: 'd',
          icon: icon('ic_analytics'),
        },
      ],
    },
    /* {
      title: 'user',
      path: '/dashboard/user',
      icon: icon('ic_user'),
    },
    /* {
      title: 'product',
      path: '/dashboard/products',
      icon: icon('ic_cart'),
    },
    {
      title: 'blog',
      path: '/dashboard/blog',
      icon: icon('ic_blog'),
    },
    {
      title: 'login',
      path: '/login',
      icon: icon('ic_lock'),
    },
    {
      title: 'Not found',
      path: '/404',
      icon: icon('ic_disabled'),
    }, */
  ];

  return navConfig;
}
