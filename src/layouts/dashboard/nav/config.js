// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'solicitante',
    path: '/solicitante/solicitante-page',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Gestión de Curso',
    // path: '/dashboard/app',
    icon: icon('ic_analytics'),
    showSubItems: false,
    subItems: [
      {
        title: 'Actualizar Capacidades',
        path: '/dashboard/app',
        icon: icon('ic_analytics')
      },
      {
        title: 'Actualizar Ofertas',
        path: '/dashboard/offers',
        icon: icon('ic_analytics')
      }
    ]
  },
  {
    title: 'Gestión de Codificadores',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Procesamiento',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
    showSubItems: false,
    subItems: [
      {
        title: 'Asignar 1ra vuelta',
        path: '/dashboard/app',
        icon: icon('ic_analytics')
      },
      {
        title: 'Asignar 2da vuelta',
        path: '/dashboard/app',
        icon: icon('ic_analytics')
      }
    ]
  },
  {
    title: 'Reportes',
    // path: '/dashboard/app',
    icon: icon('ic_analytics'),
    showSubItems: false,
    subItems: [
      {
        title: 'Reporte 1',
        path: '',
        icon: icon('ic_analytics')
      },
      {
        title: 'Reporte 2',
        path: '',
        icon: icon('ic_analytics')
      }
    ]
  },
  {
    title: 'user',
    path: '/dashboard/user',
    icon: icon('ic_user'),
  },
  {
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
  },
];

export default navConfig;
