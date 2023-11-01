// component
import {
  mdiBank,
  mdiBookOpenPageVariantOutline,
  mdiChairSchool,
  mdiFileCogOutline,
  mdiFileDocumentCheckOutline,
  mdiFileDocumentMultipleOutline,
  mdiFileDocumentOutline,
  mdiFileSign,
  mdiFileSyncOutline,
  mdiPlaylistEdit,
  mdiSchoolOutline,
  mdiStoreEditOutline,
  mdiTextBoxMultipleOutline,
} from '@mdi/js';
import { Icon } from '@mdi/react';
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
      icon: <Icon size={1} path={mdiBank} />,
      showSubItems: false,
      subItems: [
        {
          title: 'Cambiar curso activo',
          path: '/dashboard/course',
          icon: <Icon size={1} path={mdiBank} />,
        },
        {
          title: 'Actualizar capacidades',
          path: '/dashboard/capacities',
          icon: <Icon size={1} path={mdiChairSchool} />,
          // isDisabled: canActCapacities,
        },
        {
          title: 'Actualizar ofertas',
          path: '/dashboard/offers',
          icon: <Icon size={1} path={mdiPlaylistEdit} />,
          // isDisabled: canActOffers,
        },
        {
          title: 'Actualizar solicitudes sin confirmar',
          path: '/dashboard/solicitudesSinConfirmar',
          icon: <Icon size={1} path={mdiFileDocumentOutline} />,
          // isDisabled: canActRequests,
        },
        {
          title: 'Actualizar solicitudes confirmadas',
          path: '/dashboard/solicitudesConfirmadas',
          icon: <Icon size={1} path={mdiFileDocumentCheckOutline} />,
          // isDisabled: canActRequests,
        },
      ],
    },
    {
      title: 'Gestión de codificadores',
      icon: <Icon size={1} path={mdiFileCogOutline} />,
      showSubItems: false,
      subItems: [
        {
          title: 'Actualizar aulas',
          path: '/dashboard/classrooms',
          icon: <Icon size={1} path={mdiStoreEditOutline} />,
        },
        {
          title: 'Actualizar carreras',
          path: '/dashboard/careers',
          icon: <Icon size={1} path={mdiSchoolOutline} />,
        },
        {
          title: 'Actualizar edificios',
          path: '/dashboard/buildings',
          icon: <Icon size={1} path={mdiStoreEditOutline} />,
        },
        {
          title: 'Actualizar facultades',
          path: '/dashboard/faculties',
          icon: <Icon size={1} path={mdiStoreEditOutline} />,
        },
        {
          title: 'Actualizar fuentes de Ingreso',
          path: '/dashboard/incomeSources',
          icon: <Icon size={1} path={mdiBookOpenPageVariantOutline} />,
        },
      ],
    },
    {
      title: 'Asignación de plazas',
      icon: <Icon size={1} path={mdiFileSyncOutline} />,
      showSubItems: false,
      subItems: [
        {
          title: 'Asignar Carreras 1ra vuelta',
          icon: <Icon size={1} path={mdiSchoolOutline} />,
          // isDisabled: canAsigPrimVuelta,
        },
        {
          title: 'Asignar Carreras 2da vuelta',
          path: '/dashboard/apps',
          icon: <Icon size={1} path={mdiSchoolOutline} />,
          // isDisabled: canAsigSegVuelta,
        },
        {
          title: 'Asignar Aulas',
          path: '/dashboard/apps',
          icon: <Icon size={1} path={mdiStoreEditOutline} />,
          // isDisabled: canAsigClassrooms,
        },
        {
          title: 'Asignar Actas',
          path: '/dashboard/apps',
          icon: <Icon size={1} path={mdiFileDocumentMultipleOutline} />,
          // isDisabled: canAsigActs,
        },
        {
          title: 'Insertar calificaciones',
          path: '/dashboard/qualifications',
          icon: <Icon size={1} path={mdiFileSign} />,
          // isDisabled: canCalify,
        },
        {
          title: 'Insertar recalificación',
          path: '/dashboard/requalifications',
          icon: <Icon size={1} path={mdiFileSign} />,
          // isDisabled: canRecalify,
        },
      ],
    },
    {
      title: 'Reportes',
      icon: <Icon size={1} path={mdiTextBoxMultipleOutline} />,
      showSubItems: false,
      subItems: [
        {
          title: 'Reporte 1',
          path: 'd',
          icon: <Icon size={1} path={mdiTextBoxMultipleOutline} />,
        },
        {
          title: 'Reporte 2',
          path: 'd',
          icon: <Icon size={1} path={mdiTextBoxMultipleOutline} />,
        },
        {
          title: 'Reporte 3',
          path: 'd',
          icon: <Icon size={1} path={mdiTextBoxMultipleOutline} />,
        },
        {
          title: 'Reporte 4',
          path: 'd',
          icon: <Icon size={1} path={mdiTextBoxMultipleOutline} />,
        },
        {
          title: 'Reporte 5',
          path: 'd',
          icon: <Icon size={1} path={mdiTextBoxMultipleOutline} />,
        },
        {
          title: 'Reporte 6',
          path: 'd',
          icon: <Icon size={1} path={mdiTextBoxMultipleOutline} />,
        },
        {
          title: 'Reporte 7',
          path: 'd',
          icon: <Icon size={1} path={mdiTextBoxMultipleOutline} />,
        },
        {
          title: 'Reporte 8',
          path: 'd',
          icon: <Icon size={1} path={mdiTextBoxMultipleOutline} />,
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
