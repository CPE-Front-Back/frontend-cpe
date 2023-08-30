import { faker } from '@faker-js/faker';
import { Container, Grid, Typography } from '@mui/material';
// @mui
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
// components
// sections
import CourseStatisticsViewer from '../sections/@dashboard/app/CourseStatisticsViewer';
import { UseActiveCourse } from '../sections/GestionCurso/Curso/context/ActiveCourseContext';
import { getActiveCourse } from '../sections/GestionCurso/Curso/store/store';

// ----------------------------------------------------------------------

export default function DashboardLogedInPage() {
  const theme = useTheme();
  const { activeCourse } = UseActiveCourse();

  return (
    <>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>

      <Container maxWidth="100%">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Estadísticas del Curso
        </Typography>

        <Grid container>
          <Grid item xs />
          <Grid item xs={9}>
            <CourseStatisticsViewer title={`Curso: ${activeCourse.nomb_curso}`} />
          </Grid>
          <Grid item xs />
        </Grid>
      </Container>
    </>
  );
}
