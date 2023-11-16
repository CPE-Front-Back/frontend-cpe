import {
  Autocomplete,
  Backdrop,
  Button,
  CircularProgress,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Iconify from '../../../components/iconify';
import { UseActiveCourse } from '../../gestionCurso/curso/context/ActiveCourseContext';
import { getCursos } from '../../gestionCurso/curso/store/store';
import {
  getActasAnonimatoReport,
  getActasComparecenciaReport,
  getActasNotasReport,
  getActasReclamacionReport,
  getListadoAsignaciones1raVueltaCarreraReport,
  getListadoAsignaciones1raVueltaEstudianteReport,
  getListadoAsignacionesFinalCarreraReport,
  getListadoAsignacionesFinalEstudianteReport,
  getListadoNotasReport,
  getListadoRecalificacionesReport,
  getListadoUbicacionEstudianteReport,
  getProvinciasReport,
  getResumenAsignaciones1raOpcCarreraReport,
  getResumenFinalAsignacionesCarreraReport,
  getResumenSolicitudes1raOpcCarreraReport,
} from '../store/store';
import ViewPdf from './ViewPdf';

PdfPage.propTypes = {
  pdfName: PropTypes.string,
};
export default function PdfPage({ pdfName }) {
  const [pdfData, setPdfData] = useState(null);
  const [pdfNameValue, setPdfNameValue] = useState(pdfName);
  const [loading, setLoading] = useState(false);
  const { activeCourse } = UseActiveCourse();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    setPdfNameValue(pdfName);
    setPdfData(null);
  }, [pdfName]);

  useEffect(() => {
    getCursos()
      .then((response) => {
        if (response.status === 200) {
          console.log('cursos: ', response.data);
          setCourses(response.data);
        }
      })
      .catch((error) => {
        console.log('Error al cargar los cursos', error);
      });
  }, []);

  useEffect(() => {
    const sc = courses.find((curso) => curso.nomb_curso === activeCourse.nomb_curso);
    console.log('curso activo: ', sc);
    setSelectedCourse(sc);
  }, [activeCourse, courses]);

  const HandleGeneratePdf = () => {
    setLoading(true);
    switch (pdfNameValue) {
      case 'Resumen solicitudes 1ra opción por Carrera':
        getResumenSolicitudes1raOpcCarreraReport(selectedCourse.nomb_curso)
          .then((response) => {
            if (response.status === 200) {
              const blob = new Blob([response.data], { type: 'application/pdf' });

              setPdfData(blob);
              setLoading(false);
            }
          })
          .catch((error) => {
            console.log('Error al cargar el reporte', error);
          });
        break;
      case 'Listado de asignaciones en 1era vuelta por carrera':
        getListadoAsignaciones1raVueltaCarreraReport(selectedCourse.nomb_curso)
          .then((response) => {
            if (response.status === 200) {
              const blob = new Blob([response.data], { type: 'application/pdf' });

              setPdfData(blob);
              setLoading(false);
            }
          })
          .catch((error) => {
            console.log('Error al cargar el reporte', error);
          });
        break;
      case 'Listado de asignaciones en 1era vuelta por estudiante':
        getListadoAsignaciones1raVueltaEstudianteReport(selectedCourse.nomb_curso)
          .then((response) => {
            if (response.status === 200) {
              const blob = new Blob([response.data], { type: 'application/pdf' });

              setPdfData(blob);
              setLoading(false);
            }
          })
          .catch((error) => {
            console.log('Error al cargar el reporte', error);
          });
        break;
      case 'Listado de ubicación de estudiantes':
        getListadoUbicacionEstudianteReport(selectedCourse.nomb_curso)
          .then((response) => {
            if (response.status === 200) {
              const blob = new Blob([response.data], { type: 'application/pdf' });

              setPdfData(blob);
              setLoading(false);
            }
          })
          .catch((error) => {
            console.log('Error al cargar el reporte', error);
          });
        break;
      case 'Actas de comparecencia':
        getActasComparecenciaReport(selectedCourse.nomb_curso)
          .then((response) => {
            if (response.status === 200) {
              const blob = new Blob([response.data], { type: 'application/pdf' });

              setPdfData(blob);
              setLoading(false);
            }
          })
          .catch((error) => {
            console.log('Error al cargar el reporte', error);
          });
        break;
      case 'Actas de notas':
        getActasNotasReport(selectedCourse.nomb_curso)
          .then((response) => {
            if (response.status === 200) {
              const blob = new Blob([response.data], { type: 'application/pdf' });

              setPdfData(blob);
              setLoading(false);
            }
          })
          .catch((error) => {
            console.log('Error al cargar el reporte', error);
          });
        break;
      case 'Actas de anonimato':
        getActasAnonimatoReport(selectedCourse.nomb_curso)
          .then((response) => {
            if (response.status === 200) {
              const blob = new Blob([response.data], { type: 'application/pdf' });

              setPdfData(blob);
              setLoading(false);
            }
          })
          .catch((error) => {
            console.log('Error al cargar el reporte', error);
          });
        break;
      case 'Listado de notas':
        getListadoNotasReport(selectedCourse.nomb_curso)
          .then((response) => {
            if (response.status === 200) {
              const blob = new Blob([response.data], { type: 'application/pdf' });

              setPdfData(blob);
              setLoading(false);
            }
          })
          .catch((error) => {
            console.log('Error al cargar el reporte', error);
          });
        break;
      case 'Listado de asignaciones final por carrera':
        getListadoAsignacionesFinalCarreraReport(selectedCourse.nomb_curso)
          .then((response) => {
            if (response.status === 200) {
              const blob = new Blob([response.data], { type: 'application/pdf' });

              setPdfData(blob);
              setLoading(false);
            }
          })
          .catch((error) => {
            console.log('Error al cargar el reporte', error);
          });
        break;
      case 'Listado de recalificaciones':
        getListadoRecalificacionesReport(selectedCourse.nomb_curso)
          .then((response) => {
            if (response.status === 200) {
              const blob = new Blob([response.data], { type: 'application/pdf' });

              setPdfData(blob);
              setLoading(false);
            }
          })
          .catch((error) => {
            console.log('Error al cargar el reporte', error);
          });
        break;
      case 'Actas de reclamación':
        getActasReclamacionReport(selectedCourse.nomb_curso)
          .then((response) => {
            if (response.status === 200) {
              const blob = new Blob([response.data], { type: 'application/pdf' });

              setPdfData(blob);
              setLoading(false);
            }
          })
          .catch((error) => {
            console.log('Error al cargar el reporte', error);
          });
        break;
      case 'Listado de asignaciones final por estudiante':
        getListadoAsignacionesFinalEstudianteReport(selectedCourse.nomb_curso)
          .then((response) => {
            if (response.status === 200) {
              const blob = new Blob([response.data], { type: 'application/pdf' });

              setPdfData(blob);
              setLoading(false);
            }
          })
          .catch((error) => {
            console.log('Error al cargar el reporte', error);
          });
        break;
      case 'Resumen de asignaciones en 1era opción por carrera':
        getResumenAsignaciones1raOpcCarreraReport(selectedCourse.nomb_curso)
          .then((response) => {
            if (response.status === 200) {
              const blob = new Blob([response.data], { type: 'application/pdf' });

              setPdfData(blob);
              setLoading(false);
            }
          })
          .catch((error) => {
            console.log('Error al cargar el reporte', error);
          });
        break;
      case 'Resumen final de asignaciones por carreras':
        getResumenFinalAsignacionesCarreraReport(selectedCourse.nomb_curso)
          .then((response) => {
            if (response.status === 200) {
              const blob = new Blob([response.data], { type: 'application/pdf' });

              setPdfData(blob);
              setLoading(false);
            }
          })
          .catch((error) => {
            console.log('Error al cargar el reporte', error);
          });
        break;

      default:
        console.log('Unknown PDF name:', pdfName);
    }
  };

  return (
    <>
      {loading && (
        <Backdrop sx={{ bgcolor: 'white' }} open={loading}>
          <CircularProgress color="primary" />
        </Backdrop>
      )}
      {!loading && pdfData && <ViewPdf pdfData={pdfData} pdfName={pdfName} />}
      {!loading && !pdfData && (
        <Container sx={{ backgroundColor: 'white', pt: '50px' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              Reporte
            </Typography>
          </Stack>

          <Grid container sx={{ pt: '10px' }}>
            <Grid item xs />
            <Grid item xs={10}>
              <Typography variant="h5" sx={{ textAlign: 'center' }}>
                {pdfNameValue}
              </Typography>
            </Grid>
            <Grid item xs />
          </Grid>

          <Grid container sx={{ pt: '30px' }}>
            <Grid item xs />
            <Grid item xs={3}>
              <Autocomplete
                id="ComboCursosReporte"
                options={courses}
                getOptionLabel={(option) => option.nomb_curso}
                value={selectedCourse}
                onChange={(event, newValue) => {
                  setSelectedCourse(newValue);
                }}
                renderInput={(params) => <TextField {...params} label="Cursos disponibles" />}
                noOptionsText={'No hay opciones'}
              />
            </Grid>
            <Grid item xs />
          </Grid>

          <Grid container sx={{ pt: '20px', pb: '20px' }}>
            <Grid item xs />
            <Grid item xs={3}>
              <Button variant="contained" sx={{ width: '100%' }} onClick={HandleGeneratePdf}>
                Generar Reporte
              </Button>
            </Grid>
            <Grid item xs />
          </Grid>
        </Container>
      )}
    </>
  );
}
