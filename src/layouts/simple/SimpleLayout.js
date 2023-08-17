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
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(5, 5, 0),
  },
}));

const HEADER_MOBILE = 64;
const HEADER_DESKTOP = 92;

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_MOBILE,
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
            alignItems="center"
            justifyContent="space-between"
            spacing={{
              xs: 0.5,
              sm: 1,
            }}
          >
            <Logo />

            <Stack direction="row" alignItems="center" spacing={10}>
              <Typography variant="h4" sx={{ mb: 5 }}>
                Página de solicitante
              </Typography>

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
