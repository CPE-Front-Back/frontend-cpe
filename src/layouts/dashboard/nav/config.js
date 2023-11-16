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
import { UseProcessingStatus } from '../../../sections/procesamiento/context/ProcessingStatus';

// ----------------------------------------------------------------------

export default function navConfig() {
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
          title: 'Resumen solicitudes 1ra opción por Carrera',
          path: '/dashboard/pdfPage1',
          icon: <Icon size={1} path={mdiTextBoxMultipleOutline} />,
        },
        {
          title: 'Listado de asignaciones en 1era vuelta por carrera',
          path: '/dashboard/pdfPage2',
          icon: <Icon size={1} path={mdiTextBoxMultipleOutline} />,
        },
        {
          title: 'Listado de asignaciones en 1era vuelta por estudiante',
          path: '/dashboard/pdfPage3',
          icon: <Icon size={1} path={mdiTextBoxMultipleOutline} />,
        },
        {
          title: 'Listado de ubicación de estudiantes',
          path: '/dashboard/pdfPage4',
          icon: <Icon size={1} path={mdiTextBoxMultipleOutline} />,
        },
        {
          title: 'Actas de comparecencia',
          path: '/dashboard/pdfPage5',
          icon: <Icon size={1} path={mdiTextBoxMultipleOutline} />,
        },
        {
          title: 'Actas de notas',
          path: '/dashboard/pdfPage6',
          icon: <Icon size={1} path={mdiTextBoxMultipleOutline} />,
        },
        {
          title: 'Actas de anonimato',
          path: '/dashboard/pdfPage7',
          icon: <Icon size={1} path={mdiTextBoxMultipleOutline} />,
        },
        {
          title: 'Listado de notas',
          path: '/dashboard/pdfPage8',
          icon: <Icon size={1} path={mdiTextBoxMultipleOutline} />,
        },
        {
          title: 'Listado de asignaciones final por carrera',
          path: '/dashboard/pdfPage9',
          icon: <Icon size={1} path={mdiTextBoxMultipleOutline} />,
        },
        {
          title: 'Listado de recalificaciones',
          path: '/dashboard/pdfPage10',
          icon: <Icon size={1} path={mdiTextBoxMultipleOutline} />,
        },
        {
          title: 'Actas de reclamación',
          path: '/dashboard/pdfPage11',
          icon: <Icon size={1} path={mdiTextBoxMultipleOutline} />,
        },
        {
          title: 'Listado de asignaciones final por estudiante',
          path: '/dashboard/pdfPage12',
          icon: <Icon size={1} path={mdiTextBoxMultipleOutline} />,
        },
        {
          title: 'Resumen de asignaciones en 1era opción por carrera',
          path: '/dashboard/pdfPage13',
          icon: <Icon size={1} path={mdiTextBoxMultipleOutline} />,
        },
        {
          title: 'Resumen final de asignaciones por carreras',
          path: '/dashboard/pdfPage14',
          icon: <Icon size={1} path={mdiTextBoxMultipleOutline} />,
        },
      ],
    },
  ];

  return navConfig;
}
