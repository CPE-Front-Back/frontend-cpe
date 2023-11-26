import { mdiAccountCircleOutline, mdiInformationSlabCircleOutline, mdiLogout } from '@mdi/js';
import { Icon } from '@mdi/react';
import { useConfirm } from 'material-ui-confirm';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Link, Drawer, Typography, Stack, MenuItem, Popover, Alert } from '@mui/material';
import setMessage from '../../../components/messages/messages';
import ProcessingStatusDialog from '../../../components/messages/ProcessingStatusDialog';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// components
import Logo from '../../../components/logo';
import Scrollbar from '../../../components/scrollbar';
import NavSection from '../../../components/nav-section';
import { UseAuthContext } from '../../../sections/auth/context/AuthProvider';
import { UseActiveCourse } from '../../../sections/gestionCurso/curso/context/ActiveCourseContext';
//
import navConfig from './config';
import {
  asignar1raVuelta,
  asignar2daVuelta,
  asignarActas,
  asignarAulas,
} from '../../../sections/procesamiento/store/store';

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const StyledAccount = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function Nav({ openNav, onCloseNav }) {
  const { pathname } = useLocation();
  const { auth } = UseAuthContext();
  const isDesktop = useResponsive('up', 'lg');
  const navigate = useNavigate();
  const location = useLocation();

  const { activeCourse, refreshProcessingStatus, setRefreshProcessingStatus } = UseActiveCourse();
  const { setAuth } = UseAuthContext();
  const confirm = useConfirm();

  const [isOpen, setIsOpen] = useState(false);
  const [openSessionMenu, setOpenSessionMenu] = useState(null);
  const [actionName, setActionName] = useState('');
  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleOpenSessionMenu = (event) => {
    setOpenSessionMenu(event.currentTarget);
  };

  const handleCloseSessionMenu = () => {
    setOpenSessionMenu(null);
  };

  const handleSubmenuItemClicked = (actionName) => {
    setActionName(actionName);
    switch (actionName) {
      case 'Asignar carreras 1ra vuelta':
        asignar1raVuelta(activeCourse.cod_curso)
          .then((response) => {
            console.log(response);
            if (response.data) {
              setRefreshProcessingStatus(refreshProcessingStatus + 1);
              setMessage('success', '¡Asignación realizada con éxito!');
              setIsOpen(true);
            } else {
              setMessage('error', '¡No se ha podido realizar la asignación!');
            }
          })
          .catch((error) => {
            console.log('Error al asignar primera vuelta', error);
            setMessage('error', '¡Ha ocurrido un error!');
          });

        break;
      case 'Asignar carreras 2da vuelta':
        console.log(`Submenu item clicked: ${actionName}`);
        asignar2daVuelta(activeCourse.cod_curso)
          .then((response) => {
            console.log(response);
            if (response.data) {
              setRefreshProcessingStatus(refreshProcessingStatus + 1);
              setMessage('success', '¡Asignación realizada con éxito!');
              setIsOpen(true);
            } else {
              setMessage('error', '¡No se ha podido realizar la asignación!');
            }
          })
          .catch((error) => {
            console.log('Error al asignar segunda vuelta', error);
            setMessage('error', '¡Ha ocurrido un error!');
          });

        break;
      case 'Asignar aulas':
        console.log(`Submenu item clicked: ${actionName}`);
        asignarAulas(activeCourse.cod_curso)
          .then((response) => {
            console.log(response);
            if (response.data) {
              setRefreshProcessingStatus(refreshProcessingStatus + 1);
              setMessage('success', '¡Asignación realizada con éxito!');
              setIsOpen(true);
            } else {
              setMessage('error', '¡No se ha podido realizar la asignación!');
            }
          })
          .catch((error) => {
            console.log('Error al asignar las aulas', error);
            setMessage('error', '¡Ha ocurrido un error!');
          });

        break;
      case 'Asignar actas':
        console.log(`Submenu item clicked: ${actionName}`);
        asignarActas(activeCourse.cod_curso)
          .then((response) => {
            console.log(response);
            if (response.data) {
              setRefreshProcessingStatus(refreshProcessingStatus + 1);
              setMessage('success', '¡Asignación realizada con éxito!');
              setIsOpen(true);
            } else {
              setMessage('error', '¡No se ha podido realizar la asignación!');
            }
          })
          .catch((error) => {
            console.log('Error al asignar las actas', error);
            setMessage('error', '¡Ha ocurrido un error!');
          });

        break;
      default:
        console.log('Accion no reconocida:', actionName);
        break;
    }
  };

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box sx={{ px: 2.5, py: 3, pl: '105px', display: 'inline-flex' }}>
        <Logo />
      </Box>

      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none">
          <StyledAccount onClick={(event) => handleOpenSessionMenu(event)}>
            <Icon size={2.5} path={mdiAccountCircleOutline} />

            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                {auth.name}
              </Typography>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {auth.rol}
              </Typography>
            </Box>
          </StyledAccount>
        </Link>
      </Box>

      <NavSection data={navConfig()} onSubmenuItemClicked={handleSubmenuItemClicked} />

      <Box sx={{ flexGrow: 1 }} />

      <Box
        sx={{ pb: 2, mt: 5 }}
        onClick={() => {
          navigate('/dashboard/help', { replace: true });
        }}
      >
        <Stack alignItems="center" spacing={0.5} sx={{ pt: 1, borderRadius: 2, position: 'relative' }}>
          <Icon size={2} path={mdiInformationSlabCircleOutline} color="green" />
          <Typography variant="h6" textAlign={'center'} sx={{ color: (theme) => theme.palette.primary.main }}>
            Contenido de ayuda
          </Typography>
        </Stack>
      </Box>
    </Scrollbar>
  );

  return (
    <>
      <Box
        component="nav"
        sx={{
          flexShrink: { lg: 0 },
          width: { lg: NAV_WIDTH },
        }}
      >
        {isDesktop ? (
          <Drawer
            open
            variant="permanent"
            PaperProps={{
              sx: {
                width: NAV_WIDTH,
                bgcolor: 'background.default',
                borderRightStyle: 'double',
              },
            }}
          >
            {isOpen && <ProcessingStatusDialog open={isOpen} handleClose={handleClose} actionName={actionName} />}
            {renderContent}
          </Drawer>
        ) : (
          <Drawer
            open={openNav}
            onClose={onCloseNav}
            ModalProps={{
              keepMounted: true,
            }}
            PaperProps={{
              sx: { width: NAV_WIDTH },
            }}
          >
            {isOpen && <ProcessingStatusDialog open={isOpen} handleClose={handleClose} actionName={actionName} />}
            {renderContent}
          </Drawer>
        )}
      </Box>

      <Popover
        open={Boolean(openSessionMenu)}
        anchorEl={openSessionMenu}
        onClose={handleCloseSessionMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 180,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            confirm({
              content: <Alert severity={'warning'}>{`¡Perderá los cambios no guardados! ¿Desea continuar?`}</Alert>,
            })
              .then(() => {
                navigate('/login', { state: { from: location }, replace: true });
                setAuth({});
                sessionStorage.removeItem('accessToken');
              })
              .catch(() => {});
          }}
          sx={{ color: 'error.main' }}
        >
          <Icon size={1} path={mdiLogout} />
          <span style={{ marginLeft: 15 }}>Cerrar sesión</span>
        </MenuItem>
      </Popover>
    </>
  );
}
