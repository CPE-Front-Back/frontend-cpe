import { Button, Container, Grid, Typography } from '@mui/material';
// @mui
import { Helmet } from 'react-helmet-async';
// sections
import CourseStatisticsViewer from './CourseStatisticsViewer';
import { UseActiveCourse } from '../../../gestionCurso/curso/context/ActiveCourseContext';

// ----------------------------------------------------------------------

export default function DashboardLogedInPage() {
  const { activeCourse } = UseActiveCourse();

  return (
    <>
      <Helmet>
        <title> Dashboard | SAPCE </title>
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
