import { mdiSchoolOutline, mdiTextBoxMultipleOutline } from '@mdi/js';
import { Icon } from '@mdi/react';
import { LoadingButton } from '@mui/lab';
import { Backdrop, CircularProgress, Container, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppWidgetSummary } from '../../home/app';
import { UseActiveCourse } from '../../gestionCurso/curso/context/ActiveCourseContext';
import {
  getListadoAsignaciones1raVueltaCarreraReportRequester,
  getListadoAsignacionesFinalCarreraReportRequester,
  getListadoNotasReportRequester,
  getListadoOfertasReportRequester,
  getListadoRecalificacionesReportRequester,
  getListadoUbicacionEstudianteReportRequester,
} from '../../reportes/store/store';
import ViewPdf from '../../reportes/components/ViewPdf';

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    minHeight: '100%',
    overflow: 'hidden',
  },
}));

const APP_BAR_MOBILE = 82;
const APP_BAR_DESKTOP = 92;

const Main = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(0),
  [theme.breakpoints.up('sm')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  [theme.breakpoints.down('sm')]: {
    paddingTop: APP_BAR_DESKTOP + 90,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

export default function RequesterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [pdfData, setPdfData] = useState(null);
  const [pdfNameValue, setPdfNameValue] = useState('');
  const { activeCourse } = UseActiveCourse();

  const handleReport1Click = () => {
    setIsLoading(true);

    // todo: implement this function logic in the report store
    getListadoOfertasReportRequester(activeCourse.nomb_curso)
      .then((response) => {
        if (response.status === 200) {
          const blob = new Blob([response.data], { type: 'application/pdf' });

          setPdfData(blob);
          setPdfNameValue('Listado de ofertas');

          setTimeout(() => {
            setIsLoading(false);
          }, 500);
        }
      })
      .catch((error) => {
        console.log('Error al cargar el reporte', error);
      });
  };

  const handleReport2Click = () => {
    setIsLoading(true);

    getListadoAsignaciones1raVueltaCarreraReportRequester(activeCourse.nomb_curso)
      .then((response) => {
        if (response.status === 200) {
          const blob = new Blob([response.data], { type: 'application/pdf' });

          setPdfData(blob);
          setPdfNameValue('Listado de asignaciones en primera vuelta por carrera');

          setTimeout(() => {
            setIsLoading(false);
          }, 500);
        }
      })
      .catch((error) => {
        console.log('Error al cargar el reporte', error);
      });
  };

  const handleReport3Click = () => {
    setIsLoading(true);

    getListadoUbicacionEstudianteReportRequester(activeCourse.nomb_curso)
      .then((response) => {
        if (response.status === 200) {
          const blob = new Blob([response.data], { type: 'application/pdf' });

          setPdfData(blob);
          setPdfNameValue('Listado de ubicaciones para instrumento por estudiante');

          setTimeout(() => {
            setIsLoading(false);
          }, 500);
        }
      })
      .catch((error) => {
        console.log('Error al cargar el reporte', error);
      });
  };

  const handleReport4Click = () => {
    setIsLoading(true);

    getListadoNotasReportRequester(activeCourse.nomb_curso)
      .then((response) => {
        if (response.status === 200) {
          const blob = new Blob([response.data], { type: 'application/pdf' });

          setPdfData(blob);
          setPdfNameValue('Listado de notas');

          setTimeout(() => {
            setIsLoading(false);
          }, 500);
        }
      })
      .catch((error) => {
        console.log('Error al cargar el reporte', error);
      });
  };

  const handleReport5Click = () => {
    setIsLoading(true);

    getListadoRecalificacionesReportRequester(activeCourse.nomb_curso)
      .then((response) => {
        if (response.status === 200) {
          const blob = new Blob([response.data], { type: 'application/pdf' });

          setPdfData(blob);
          setPdfNameValue('Listado de recalificaciones');

          setTimeout(() => {
            setIsLoading(false);
          }, 500);
        }
      })
      .catch((error) => {
        console.log('Error al cargar el reporte', error);
      });
  };

  const handleReport6Click = () => {
    setIsLoading(true);

    getListadoAsignacionesFinalCarreraReportRequester(activeCourse.nomb_curso)
      .then((response) => {
        if (response.status === 200) {
          const blob = new Blob([response.data], { type: 'application/pdf' });

          setPdfData(blob);
          setPdfNameValue('Listado de asignaciones en finales por carrera');

          setTimeout(() => {
            setIsLoading(false);
          }, 500);
        }
      })
      .catch((error) => {
        console.log('Error al cargar el reporte', error);
      });
  };

  return (
    <>
      <Helmet>
        <title> Solicitante | SAPCE </title>
      </Helmet>
      {isLoading && (
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
          <CircularProgress color="primary" />
        </Backdrop>
      )}
      <StyledRoot>
        <Main>
          {!isLoading && pdfData && pdfNameValue && (
            <>
              <ViewPdf pdfData={pdfData} pdfName={pdfNameValue} />
            </>
          )}
          {!pdfData && !pdfNameValue && (
            <Container>
              <Grid container spacing={3} justifyContent={'center'}>
                <Grid item xs={12} sm={12} md={12} style={{ textAlign: 'center' }}>
                  <LoadingButton
                    size="large"
                    type="submit"
                    variant="contained"
                    sx={{ margin: '0 auto' }}
                    onClick={() => {
                      navigate('/simple', { state: { from: location }, replace: true });
                    }}
                    startIcon={<Icon size={1} path={mdiSchoolOutline} />}
                  >
                    Prematrícula
                  </LoadingButton>
                </Grid>

                <Grid item xs={12} sm={6} md={3} onClick={handleReport1Click}>
                  <AppWidgetSummary pdfName="Listado de ofertas" icon={mdiTextBoxMultipleOutline} />
                </Grid>

                <Grid item xs={12} sm={6} md={3} onClick={handleReport2Click}>
                  <AppWidgetSummary
                    pdfName="Listado de asignaciones en primera vuelta por carrera"
                    icon={mdiTextBoxMultipleOutline}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3} onClick={handleReport3Click}>
                  <AppWidgetSummary
                    pdfName="Listado de ubicaciones para instrumento por estudiante"
                    icon={mdiTextBoxMultipleOutline}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3} onClick={handleReport4Click}>
                  <AppWidgetSummary pdfName="Listado de notas" icon={mdiTextBoxMultipleOutline} />
                </Grid>

                <Grid item xs={12} sm={6} md={3} onClick={handleReport5Click}>
                  <AppWidgetSummary pdfName="Listado de recalificaciones" icon={mdiTextBoxMultipleOutline} />
                </Grid>

                <Grid item xs={12} sm={6} md={3} onClick={handleReport6Click}>
                  <AppWidgetSummary
                    pdfName="Listado de asignaciones en finales por carrera"
                    icon={mdiTextBoxMultipleOutline}
                  />
                </Grid>
              </Grid>
            </Container>
          )}
        </Main>
      </StyledRoot>
    </>
  );
}
