import { LoadingButton } from '@mui/lab';
import { Button, Container, Grid, Stack, TextField, Typography } from '@mui/material';
import { addYears } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import enGB from 'date-fns/locale/en-GB';
import { Helmet } from 'react-helmet-async';
import setMessage from '../../../../components/messages/messages';
import { UseActiveCourse } from '../context/ActiveCourseContext';
import { activarCurso, desactivarCursos, getActiveCourse, getCursos, insertarCurso } from '../store/store';

export default function CoursePage() {
  const { activeCourse, setActiveCourse } = UseActiveCourse();
  const [courseNameInput, setCourseNameInput] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [canGenerate, setCanGenerate] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errors, setErrors] = useState({
    nomb_curso: '',
    fecha_inicio: '',
  });

  const validateData = () => {
    const newErrors = {};

    if (!courseNameInput) {
      newErrors.nomb_curso = 'Nombre de curso requerido';
    }
    if (!startDate) {
      newErrors.fecha_inicio = 'Fecha de inicio requerida';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const validateDates = () => {
    const currentDate = new Date();
    const formattedCurrentDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
    const activeCourseDate = activeCourse.fecha_inicio;

    // Convert the dates from dd-mm-yyyy to yyyy-mm-dd format for JavaScript's Date object
    const formattedCurrentDateForJS = formattedCurrentDate.split('-').reverse().join('-');
    const activeCourseDateForJS = activeCourseDate.split('-').reverse().join('-');

    // Create Date objects
    const date1 = new Date(formattedCurrentDateForJS);
    const date2 = new Date(activeCourseDateForJS);

    // Compare the dates
    setCanGenerate(date1.getTime() > date2.getTime());
  };
  useEffect(() => {
    validateDates();
  });

  const handleGenerarCursoClick = () => {
    // todo: fix generation logic and validations

    if (validateData() && canGenerate) {
      setIsGenerating(true);
      const generatedCourse = {
        cod_curso: 0,
        nomb_curso: courseNameInput,
        activo: true,
        fecha_inicio: `${startDate.getDate()}-${startDate.getMonth() + 1}-${startDate.getFullYear()}`,
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
                setIsGenerating(false);
              });
          }
        })
        .catch((error) => {
          console.log('Error al desactivar los cursos', error);
        });
    }
    /* if (validateData()) {
      setIsGenerating(true);
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
                setIsGenerating(false);
              });
          }
        })
        .catch((error) => {
          console.log('Error al desactivar los cursos', error);
        }); */
  };

  const handleCourseNameInput = (event) => {
    // allow only one blank space and letters
    const inputValue = event.target.value.replace(/[^0-9-]/g, '');
    event.target.value = inputValue;
  };

  return (
    <>
      <Helmet>
        <title> Cursos | SAPCE </title>
      </Helmet>

      <Container sx={{ pt: '50px' }}>
        <Stack direction="column" alignItems="flex-start" justifyContent="left" mb={5} spacing={1}>
          <Typography variant="h4" gutterBottom>
            {`Curso activo: ${activeCourse.nomb_curso}`}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            {`Fecha de inicio: ${activeCourse.fecha_inicio}`}
          </Typography>
        </Stack>

        <Container sx={{ backgroundColor: 'white' }}>
          <Grid container sx={{ pt: '10px' }}>
            <Grid item xs />
            <Grid item xs={10} sx={{ textAlign: 'center' }}>
              <Typography variant="h5">
                {canGenerate
                  ? 'Generar nuevo curso'
                  : `El nuevo curso se podrá generar pasado el ${activeCourse.fecha_inicio}`}
              </Typography>
            </Grid>
            <Grid item xs />
          </Grid>

          <Grid container sx={{ pt: '30px' }}>
            <Grid item xs />
            <Grid item xs={3}>
              <TextField
                name="nomb_curso"
                fullWidth
                type="text"
                value={courseNameInput}
                label="Nombre del curso"
                onChange={(event) => setCourseNameInput(event.target.value)}
                onInput={handleCourseNameInput}
                error={!!errors.nomb_curso}
                helperText={errors.nomb_curso}
                inputProps={{ maxLength: 20 }}
                sx={{ textAlign: 'center' }}
                disabled={!canGenerate}
              />
            </Grid>
            <Grid item xs />
          </Grid>

          <Grid container sx={{ pt: '30px' }}>
            <Grid item xs />
            <Grid item xs={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
                <DesktopDatePicker
                  label="Fecha de inicio"
                  value={startDate}
                  minDate={addYears(new Date(), 1)}
                  onChange={(newValue) => setStartDate(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} error={!!errors.fecha_inicio} helperText={errors.fecha_inicio} />
                  )}
                  openTo="year"
                  sx={{ width: '100%' }}
                  disabled={!canGenerate}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs />
          </Grid>

          <Grid container sx={{ pt: '20px', pb: '20px' }}>
            <Grid item xs />
            <Grid item xs={3}>
              <LoadingButton
                variant="contained"
                loading={isGenerating}
                sx={{ width: '100%' }}
                onClick={handleGenerarCursoClick}
                disabled={!canGenerate}
              >
                Generar curso
              </LoadingButton>
            </Grid>
            <Grid item xs />
          </Grid>
        </Container>
      </Container>
    </>
  );
}
