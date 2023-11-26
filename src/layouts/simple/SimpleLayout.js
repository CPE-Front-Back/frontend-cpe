import { Grid, Toolbar, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';
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
  return (
    <>
      <StyledHeader>
        <StyledToolbar>
          <Grid container spacing={{ xs: 1, sm: 1, md: 1 }} columns={{ sm: 1 }}>
            <Grid
              item
              container
              xs={'auto'}
              sx={{ minWidth: '200px', maxWidth: '205px', margin: 'auto' }}
              justifyContent={{ xs: 'center', sm: 'center', md: 'center' }}
            >
              <Grid item xs>
                <Logo />
              </Grid>
              <Grid item xs>
                <Typography variant="h4" sx={{ mb: 5, paddingTop: '12px' }}>
                  Prematrícula
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </StyledToolbar>
      </StyledHeader>

      <Outlet />
    </>
  );
}
