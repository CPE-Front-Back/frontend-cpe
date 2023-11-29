import { Button, Container, Grid, Typography } from '@mui/material';
import { useState } from 'react';
// @mui
import { Helmet } from 'react-helmet-async';
import ProcessingStatusDialog from '../../../../components/messages/ProcessingStatusDialog';
// sections
import CourseStatisticsViewer from './CourseStatisticsViewer';
import { UseActiveCourse } from '../../../gestionCurso/curso/context/ActiveCourseContext';

// ----------------------------------------------------------------------

export default function HomePage() {
  const { activeCourse } = UseActiveCourse();

  return (
    <>
      <Helmet>
        <title> Dashboard | SAPCE </title>
      </Helmet>

      <Container maxWidth="100%">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Estadísticas del curso
        </Typography>

        <Grid container>
          <Grid item xs />
          <Grid item xs={9}>
            <CourseStatisticsViewer />
          </Grid>
          <Grid item xs />
        </Grid>
      </Container>
    </>
  );
}
