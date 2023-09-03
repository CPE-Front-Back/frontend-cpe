import { LoadingButton } from '@mui/lab';
import { Box, Stack, Toolbar, Typography } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
// components
import Logo from '../../components/logo';

// ----------------------------------------------------------------------

const StyledHeader = styled('header')(({ theme }) => ({
  top: 0,
  left: 0,
  lineHeight: 0,
  width: '100%',
  position: 'absolute',
  padding: theme.spacing(3, 3, 0),
  // display: 'flex',
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(5, 5, 0),
  },
}));

const HEADER_MOBILE = 64;
const HEADER_DESKTOP = 94;

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_MOBILE,
  width: '100%',
  // display: 'flex',
  [theme.breakpoints.up('lg')]: {
    minHeight: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

export default function SimpleLayout() {
  const navigate = useNavigate();

  return (
    <>
      <StyledHeader>
        <StyledToolbar>
          <Stack
            direction="row"
            sx={{ flexGrow: 1 }}
            spacing={{
              xs: 0.5,
              sm: 1,
            }}
          >
            <Logo />

            <Stack direction="row" spacing={10} sx={{ flexGrow: 1 }}>
              <Typography variant="h4" sx={{ mb: 5, paddingTop: '12px' }}>
                Bienvenido
              </Typography>

              <Box sx={{ flexGrow: 1 }} />

              <LoadingButton
                size="large"
                type="submit"
                variant="contained"
                onClick={() => {
                  navigate('/login', { replace: true });
                }}
              >
                Iniciar Sesión
              </LoadingButton>
            </Stack>
          </Stack>
        </StyledToolbar>
      </StyledHeader>

      <Outlet />
    </>
  );
}
