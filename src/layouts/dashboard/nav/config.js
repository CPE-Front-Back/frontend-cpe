// component
import {
  mdiAccountWrenchOutline,
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
import { useState } from 'react';
import { UseAuthContext } from '../../../sections/auth/context/AuthProvider';
import { UseProcessingStatus } from '../../../sections/procesamiento/context/ProcessingStatus';

// ----------------------------------------------------------------------

export default function navConfig() {
  const {
    canAsigPrimVuelta, // es falso
    canAsigSegVuelta,
    canAsigClassrooms,
    canAsigActs,
    canCalify,
    canRecalify,
    canActOffers,
    canActCapacities,
    canActRequests,
  } = UseProcessingStatus();

  const { auth } = UseAuthContext();

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
      title: 'Gestión de usuarios',
      path: '/dashboard/admin',
      icon: <Icon size={1} path={mdiAccountWrenchOutline} />,
      haveAccess: auth.rol === 'Administrador',
      enabled: true,
    },
    {
      title: 'Gestión de curso',
      icon: <Icon size={1} path={mdiBank} />,
      haveAccess: auth.rol === 'Secretario General' || auth.rol === 'Matriculador' || auth.rol === 'Técnico',
      showSubItems: false,
      subItems: [
        {
          title: 'Generar curso activo',
          path: '/dashboard/course',
          icon: <Icon size={1} path={mdiBank} />,
          haveAccess: auth.rol === 'Secretario General',
          enabled: true,
        },
        {
          title: 'Actualizar capacidades',
          path: '/dashboard/capacities',
          icon: <Icon size={1} path={mdiChairSchool} />,
          haveAccess: auth.rol === 'Secretario General',
          enabled: canActCapacities,
        },
        {
          title: 'Actualizar ofertas',
          path: '/dashboard/offers',
          icon: <Icon size={1} path={mdiPlaylistEdit} />,
          haveAccess: auth.rol === 'Secretario General',
          enabled: canActOffers,
        },
        {
          title: 'Actualizar solicitudes sin confirmar',
          path: '/dashboard/solicitudesSinConfirmar',
          icon: <Icon size={1} path={mdiFileDocumentOutline} />,
          haveAccess: auth.rol === 'Secretario General' || auth.rol === 'Matriculador' || auth.rol === 'Técnico',
          enabled: canActRequests,
        },
        {
          title: 'Actualizar solicitudes confirmadas',
          path: '/dashboard/solicitudesConfirmadas',
          icon: <Icon size={1} path={mdiFileDocumentCheckOutline} />,
          haveAccess: auth.rol === 'Secretario General' || auth.rol === 'Matriculador' || auth.rol === 'Técnico',
          enabled: canActRequests,
        },
        {
          title: 'Exportar solicitantes',
          path: '/dashboard/pdfPage15',
          icon: <Icon size={1} path={mdiTextBoxMultipleOutline} />,
          haveAccess: auth.rol === 'Secretario General' || auth.rol === 'Técnico' || auth.rol === 'Matriculador',
          enabled: true,
        },
      ],
    },
    {
      title: 'Gestión de codificadores',
      icon: <Icon size={1} path={mdiFileCogOutline} />,
      showSubItems: false,
      haveAccess: auth.rol === 'Técnico',
      subItems: [
        {
          title: 'Actualizar aulas',
          path: '/dashboard/classrooms',
          icon: <Icon size={1} path={mdiStoreEditOutline} />,
          haveAccess: auth.rol === 'Técnico',
          enabled: true,
        },
        {
          title: 'Actualizar carreras',
          path: '/dashboard/careers',
          icon: <Icon size={1} path={mdiSchoolOutline} />,
          haveAccess: auth.rol === 'Técnico',
          enabled: true,
        },
        {
          title: 'Actualizar edificios',
          path: '/dashboard/buildings',
          icon: <Icon size={1} path={mdiStoreEditOutline} />,
          haveAccess: auth.rol === 'Técnico',
          enabled: true,
        },
        {
          title: 'Actualizar facultades',
          path: '/dashboard/faculties',
          icon: <Icon size={1} path={mdiStoreEditOutline} />,
          haveAccess: auth.rol === 'Técnico',
          enabled: true,
        },
        {
          title: 'Actualizar fuentes de Ingreso',
          path: '/dashboard/incomeSources',
          icon: <Icon size={1} path={mdiBookOpenPageVariantOutline} />,
          haveAccess: auth.rol === 'Técnico',
          enabled: true,
        },
      ],
    },
    {
      title: 'Asignación de plazas',
      icon: <Icon size={1} path={mdiFileSyncOutline} />,
      showSubItems: false,
      haveAccess: auth.rol === 'Secretario General',
      subItems: [
        {
          title: 'Asignar carreras 1ra vuelta',
          icon: <Icon size={1} path={mdiSchoolOutline} />,
          haveAccess: auth.rol === 'Secretario General',
          enabled: canAsigPrimVuelta,
        },
        {
          title: 'Asignar carreras 2da vuelta',
          icon: <Icon size={1} path={mdiSchoolOutline} />,
          haveAccess: auth.rol === 'Secretario General',
          enabled: canAsigSegVuelta,
        },
        {
          title: 'Asignar aulas',
          icon: <Icon size={1} path={mdiStoreEditOutline} />,
          haveAccess: auth.rol === 'Secretario General',
          enabled: canAsigClassrooms,
        },
        {
          title: 'Asignar actas',
          icon: <Icon size={1} path={mdiFileDocumentMultipleOutline} />,
          haveAccess: auth.rol === 'Secretario General',
          enabled: canAsigActs,
        },
        {
          title: 'Insertar calificaciones',
          path: '/dashboard/qualifications',
          icon: <Icon size={1} path={mdiFileSign} />,
          haveAccess: auth.rol === 'Secretario General',
          enabled: canCalify,
        },
        {
          title: 'Insertar recalificación',
          path: '/dashboard/requalifications',
          icon: <Icon size={1} path={mdiFileSign} />,
          haveAccess: auth.rol === 'Secretario General',
          enabled: canRecalify,
        },
      ],
    },
    {
      title: 'Reportes',
      icon: <Icon size={1} path={mdiTextBoxMultipleOutline} />,
      showSubItems: false,
      haveAccess: auth.rol === 'Secretario General' || auth.rol === 'Técnico',
      subItems: [
        {
          title: 'Resumen de solicitudes 1ra opción por carrera',
          path: '/dashboard/pdfPage1',
          icon: <Icon size={1} path={mdiTextBoxMultipleOutline} />,
          haveAccess: auth.rol === 'Secretario General' || auth.rol === 'Técnico',
          enabled: true,
        },
        {
          title: 'Listado de asignaciones en 1ra vuelta por carrera',
          path: '/dashboard/pdfPage2',
          icon: <Icon size={1} path={mdiTextBoxMultipleOutline} />,
          haveAccess: auth.rol === 'Secretario General' || auth.rol === 'Técnico',
          enabled: true,
        },
        {
          title: 'Listado de asignaciones en 1ra vuelta por estudiante',
          path: '/dashboard/pdfPage3',
          icon: <Icon size={1} path={mdiTextBoxMultipleOutline} />,
          haveAccess: auth.rol === 'Secretario General' || auth.rol === 'Técnico',
          enabled: true,
        },
        {
          title: 'Listado de ubicación de estudiantes',
          path: '/dashboard/pdfPage4',
          icon: <Icon size={1} path={mdiTextBoxMultipleOutline} />,
          haveAccess: auth.rol === 'Secretario General' || auth.rol === 'Técnico',
          enabled: true,
        },
        {
          title: 'Actas de comparecencia',
          path: '/dashboard/pdfPage5',
          icon: <Icon size={1} path={mdiTextBoxMultipleOutline} />,
          haveAccess: auth.rol === 'Secretario General' || auth.rol === 'Técnico',
          enabled: true,
        },
        {
          title: 'Actas de notas',
          path: '/dashboard/pdfPage6',
          icon: <Icon size={1} path={mdiTextBoxMultipleOutline} />,
          haveAccess: auth.rol === 'Secretario General' || auth.rol === 'Técnico',
          enabled: true,
        },
        {
          title: 'Actas de anonimato',
          path: '/dashboard/pdfPage7',
          icon: <Icon size={1} path={mdiTextBoxMultipleOutline} />,
          haveAccess: auth.rol === 'Secretario General' || auth.rol === 'Técnico',
          enabled: true,
        },
        {
          title: 'Listado de notas',
          path: '/dashboard/pdfPage8',
          icon: <Icon size={1} path={mdiTextBoxMultipleOutline} />,
          haveAccess: auth.rol === 'Secretario General' || auth.rol === 'Técnico',
          enabled: true,
        },
        {
          title: 'Actas de reclamación',
          path: '/dashboard/pdfPage11',
          icon: <Icon size={1} path={mdiTextBoxMultipleOutline} />,
          haveAccess: auth.rol === 'Secretario General' || auth.rol === 'Técnico',
          enabled: true,
        },
        {
          title: 'Listado de recalificaciones',
          path: '/dashboard/pdfPage10',
          icon: <Icon size={1} path={mdiTextBoxMultipleOutline} />,
          haveAccess: auth.rol === 'Secretario General' || auth.rol === 'Técnico',
          enabled: true,
        },
        {
          title: 'Listado de asignaciones final por carrera',
          path: '/dashboard/pdfPage9',
          icon: <Icon size={1} path={mdiTextBoxMultipleOutline} />,
          haveAccess: auth.rol === 'Secretario General' || auth.rol === 'Técnico',
          enabled: true,
        },
        {
          title: 'Listado de asignaciones final por estudiante',
          path: '/dashboard/pdfPage12',
          icon: <Icon size={1} path={mdiTextBoxMultipleOutline} />,
          haveAccess: auth.rol === 'Secretario General' || auth.rol === 'Técnico',
          enabled: true,
        },
        {
          title: 'Resumen de asignaciones en 1ra opción por carrera',
          path: '/dashboard/pdfPage13',
          icon: <Icon size={1} path={mdiTextBoxMultipleOutline} />,
          haveAccess: auth.rol === 'Secretario General' || auth.rol === 'Técnico',
          enabled: true,
        },
        {
          title: 'Resumen final de asignaciones por carreras',
          path: '/dashboard/pdfPage14',
          icon: <Icon size={1} path={mdiTextBoxMultipleOutline} />,
          haveAccess: auth.rol === 'Secretario General' || auth.rol === 'Técnico',
          enabled: true,
        },
      ],
    },
  ];

  return navConfig;
}
