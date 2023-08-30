import { LoadingButton } from '@mui/lab';
import { Autocomplete, Button, Container, Grid, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Iconify from '../components/iconify';
import { UseActiveCourse } from '../sections/GestionCurso/Curso/context/ActiveCourseContext';
import { activarCurso, desactivarCursos, getCursos, insertarCurso } from '../sections/GestionCurso/Curso/store/store';

export default function CursoPage() {
  const { activeCourse, setActiveCourse } = UseActiveCourse();
  const [isActivating, setIsActivating] = useState(false);

  const [cursos, setCursos] = useState([]);
  const [selectedCurso, setSelectedCurso] = useState(null);

  const handleGenerarCursoClick = () => {
    insertarCurso()
      .then((response) => {
        if (response.status === 200) {
          console.log('Curso generado correctamente');
        }
      })
      .catch((error) => {
        console.log('Error al generar el curso', error);
      });
  };

  const handleActivarCursoClick = () => {
    setIsActivating(true);
    console.log('El curso activo en el context:', activeCourse);
    desactivarCursos().then((response) => {
      if (response.status === 200) {
        console.log(response.data);
        activarCurso(selectedCurso)
          .then((response) => {
            if (response.status === 200) {
              console.log(response.data);
              setActiveCourse(selectedCurso);
            }
          })
          .catch((error) => {
            console.log('Error al activar el curso', error);
          })
          .finally(() => {
            setIsActivating(false);
          });
      }
    });
  };

  useEffect(() => {
    getCursos()
      .then((response) => {
        if (response.status === 200) {
          console.log('cursos: ', response.data);
          setCursos(response.data);
        }
      })
      .catch((error) => {
        console.log('Error al cargar los cursos', error);
      });
  }, []);

  return (
    <>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Cursos
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleGenerarCursoClick}>
            Generar nuevo curso
          </Button>
        </Stack>

        <Grid container>
          <Grid item xs />
          <Grid item xs={3}>
            <Autocomplete
              id="ComboCursos"
              options={cursos}
              getOptionLabel={(option) => option.nomb_curso}
              value={selectedCurso}
              onChange={(event, newValue) => {
                setSelectedCurso(newValue);
              }}
              renderInput={(params) => <TextField {...params} label="Cursos disponibles" />}
            />
          </Grid>
          <Grid item xs />
        </Grid>
        <Grid container sx={{ pt: '10px' }}>
          <Grid item xs />
          <Grid item xs={3}>
            <Button variant="contained" sx={{ width: '100%' }} onClick={handleActivarCursoClick}>
              Activar curso
            </Button>
          </Grid>
          <Grid item xs />
        </Grid>
      </Container>
    </>
  );
}
