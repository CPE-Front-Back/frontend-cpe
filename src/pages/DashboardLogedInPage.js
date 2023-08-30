import { faker } from '@faker-js/faker';
import { Container, Grid, Typography } from '@mui/material';
// @mui
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
// components
// sections
import { AppNewsUpdate } from '../sections/@dashboard/app';
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
          Pantalla estadísticas Curso
        </Typography>

        <Grid container>
          <Grid item xs={12}>
            <AppNewsUpdate
              title={`Curso: ${activeCourse.nomb_curso}`}
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: faker.name.jobDescriptor(),
                description: faker.name.jobTitle(),
                image: `/assets/images/covers/cover_${index + 1}.jpg`,
                postedAt: faker.date.recent(),
              }))}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
