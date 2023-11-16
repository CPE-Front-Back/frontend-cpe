import { LoadingButton } from '@mui/lab';
import { Autocomplete, Button, Container, Grid, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Iconify from '../../../../components/iconify';
import setMessage from '../../../../components/messages/messages';
import { UseActiveCourse } from '../context/ActiveCourseContext';
import { activarCurso, desactivarCursos, getCursos, insertarCurso } from '../store/store';

export default function CoursePage() {
  const { activeCourse, setActiveCourse } = UseActiveCourse();
  const [isActivating, setIsActivating] = useState(false);

  const [cursos, setCursos] = useState([]);
  const [cursosFiltrados, setCursosFiltrados] = useState([]);
  const [selectedCurso, setSelectedCurso] = useState(null);

  useEffect(() => {
    getCursos()
      .then((response) => {
        if (response.status === 200) {
          console.log('cursos: ', response.data);
          setCursos(response.data);
          setCursosFiltrados(response.data);
        }
      })
      .catch((error) => {
        console.log('Error al cargar los cursos', error);
      });
  }, []);

  useEffect(() => {
    const listaFiltrada = cursos.filter((curso) => curso.nomb_curso !== activeCourse.nomb_curso);
    setCursosFiltrados(listaFiltrada);
  }, [activeCourse, cursos]);

  const handleGenerarCursoClick = () => {
    setIsActivating(true);
    const currentYear = new Date().getFullYear();
    const generatedCourse = {
      cod_curso: 0,
      nomb_curso: `${currentYear}-${currentYear + 1}`,
      activo: true,
    };

    console.log('Nuevo Curso: ', generatedCourse);

    desactivarCursos()
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);
          insertarCurso(generatedCourse)
            .then((response) => {
              if (response.status === 200) {
                console.log('Curso generado correctamente');
                setMessage('success', '¡Curso generado con éxito!');

                setActiveCourse(generatedCourse);
              }
            })
            .catch((error) => {
              console.log('Error al generar el curso', error);
              setMessage('error', '¡Ha ocurrido un error!');
            })
            .finally(() => {
              setIsActivating(false);
            });
        }
      })
      .catch((error) => {
        console.log('Error al desactivar los cursos', error);
      });
  };

  const handleActivarCursoClick = () => {
    setIsActivating(true);
    console.log('El curso activo en el context:', activeCourse);
    desactivarCursos()
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);
          activarCurso(selectedCurso)
            .then((response) => {
              if (response.status === 200) {
                console.log(response.data);
                setMessage('success', '¡Curso activado con éxito!');

                setActiveCourse(selectedCurso);
              }
            })
            .catch((error) => {
              console.log('Error al activar el curso', error);
              setMessage('error', '¡Ha ocurrido un error!');
            })
            .finally(() => {
              setIsActivating(false);
            });
        }
      })
      .catch((error) => {
        console.log('Error al desactivar los cursos', error);
      });
  };

  return (
    <>
      <Container sx={{ pt: '50px' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Cursos
          </Typography>
          <Button
            variant="contained"
            style={{ textTransform: 'none' }}
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleGenerarCursoClick}
          >
            Generar nuevo Curso
          </Button>
        </Stack>
        <Container sx={{ backgroundColor: 'white' }}>
          <Grid container sx={{ pt: '10px' }}>
            <Grid item xs />
            <Grid item xs={10} sx={{ textAlign: 'center' }}>
              <Typography variant="h5">{`Curso activo: ${activeCourse.nomb_curso}`}</Typography>
            </Grid>
            <Grid item xs />
          </Grid>

          <Grid container sx={{ pt: '30px' }}>
            <Grid item xs />
            <Grid item xs={3}>
              <Autocomplete
                id="ComboCursos"
                options={cursosFiltrados}
                getOptionLabel={(option) => option.nomb_curso}
                value={selectedCurso}
                onChange={(event, newValue) => {
                  setSelectedCurso(newValue);
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
              <Button variant="contained" sx={{ width: '100%' }} onClick={handleActivarCursoClick}>
                Activar curso
              </Button>
            </Grid>
            <Grid item xs />
          </Grid>
        </Container>
      </Container>
    </>
  );
}
