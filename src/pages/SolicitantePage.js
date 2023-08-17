import { LoadingButton } from '@mui/lab';
import { Container, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { AppWidgetSummary } from '../sections/@dashboard/app';
import Header from '../sections/Solicitante/Header';
import SolicitanteCarrerOptionsForm from '../sections/Solicitante/SolicitanteCarrerOptionsForm';
import SolicitantePersonalDataForm from '../sections/Solicitante/SolicitantePersonalDataForm';

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    minHeight: '100%',
    overflow: 'hidden',
  },
}));

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const Main = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

export default function SolicitantePage() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/solicitante/formulario-solicitud', { replace: true });
  };

  return (
    <>
      <Helmet>
        <title> Solicitante | CPE </title>
      </Helmet>

      <StyledRoot>
        <Main>
          <Container>
            <LoadingButton size="large" type="submit" variant="contained" onClick={handleClick}>
              Prematrícula
            </LoadingButton>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <AppWidgetSummary title="Reporte 1" total={100} icon={'ant-design:android-filled'} />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <AppWidgetSummary title="Reporte 2" total={100} icon={'ant-design:android-filled'} />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <AppWidgetSummary title="Reporte 3" total={100} icon={'ant-design:android-filled'} />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <AppWidgetSummary title="Reporte 4" total={100} icon={'ant-design:android-filled'} />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <AppWidgetSummary title="Reporte 5" total={100} icon={'ant-design:android-filled'} />
              </Grid>
            </Grid>
          </Container>
        </Main>
      </StyledRoot>
    </>
  );
}
