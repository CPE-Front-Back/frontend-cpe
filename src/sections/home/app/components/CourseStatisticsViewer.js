// @mui
import PropTypes from 'prop-types';
import { Box, Stack, Link, Card, Button, Divider, Typography, CardHeader } from '@mui/material';
import { useEffect, useState } from 'react';
// utils
import { fToNow } from '../../../../utils/formatTime';
// components
import Iconify from '../../../../components/iconify';
import Scrollbar from '../../../../components/scrollbar';
import { UseActiveCourse } from '../../../gestionCurso/curso/context/ActiveCourseContext';
import {
  getCantCarrerasAsigPrimeraVueltaCurso,
  getCantCarrerasAsigSegundaVueltaCurso,
  getCantSolicitantesTotalCurso,
  getCantSolicitudesTotalCurso,
} from '../store/store';

// ----------------------------------------------------------------------

CourseStatisticsViewer.propTypes = {
  title: PropTypes.string.isRequired,
};
export default function CourseStatisticsViewer({ title, ...other }) {
  const { activeCourse } = UseActiveCourse();
  const [cant1, setCant1] = useState(0);
  const [cant2, setCant2] = useState(0);
  const [cant3, setCant3] = useState(0);
  const [cant4, setCant4] = useState(0);
  const [cant5, setCant5] = useState(0);

  useEffect(() => {
    getCantSolicitantesTotalCurso(activeCourse.cod_curso)
      .then((response) => {
        if (response.status === 200) {
          setCant1(response.data);
        }
      })
      .catch((error) => {
        console.log('Error al cargar la cantidad total de solicitantes en el curso', error);
      });
  }, [activeCourse]);

  useEffect(() => {
    getCantSolicitudesTotalCurso(activeCourse.cod_curso)
      .then((response) => {
        if (response.status === 200) {
          setCant2(response.data);
        }
      })
      .catch((error) => {
        console.log('Error al cargar la cantidad total de solicitudes en el curso', error);
      });
  }, [activeCourse]);

  useEffect(() => {
    getCantCarrerasAsigPrimeraVueltaCurso(activeCourse.cod_curso)
      .then((response) => {
        if (response.status === 200) {
          setCant3(response.data);
        }
      })
      .catch((error) => {
        console.log('Error al cargar la cantidad de carreras asig 1ra vuelta en el curso', error);
      });
  }, [activeCourse]);

  useEffect(() => {
    setCant4(cant1 - cant3);
  }, [cant1, cant3]);

  useEffect(() => {
    getCantCarrerasAsigSegundaVueltaCurso(activeCourse.cod_curso)
      .then((response) => {
        if (response.status === 200) {
          setCant5(response.data);
        }
      })
      .catch((error) => {
        console.log('Error al cargar la cantidad de carreras asig 2da vuelta en el curso', error);
      });
  }, [activeCourse]);

  return (
    <Card {...other}>
      <CardHeader title={title} />

      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3, pr: 0 }}>
          <StatisticItem key="statistic1" title="Cantidad de solicitantes total en el curso:" cant={cant1} />
          <StatisticItem key="statistic2" title="Cantidad de solicitudes total en el curso:" cant={cant2} />
          <StatisticItem key="statistic3" title="Cantidad de solicitantes asignados en 1ra vuelta:" cant={cant3} />
          <StatisticItem key="statistic4" title="Cantidad de solicitantes para instrumento:" cant={cant4} />
          <StatisticItem key="statistic5" title="Cantidad de solicitantes asignados en 2da vuelta:" cant={cant5} />
        </Stack>
      </Scrollbar>
    </Card>
  );
}

// ----------------------------------------------------------------------

StatisticItem.propTypes = {
  cant: PropTypes.number,
  title: PropTypes.string,
};
function StatisticItem({ title, cant }) {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box sx={{ minWidth: 240, flexGrow: 1 }}>
        <Link color="inherit" variant="subtitle2" underline="hover" noWrap>
          {title}
        </Link>
      </Box>

      <Typography variant="caption" sx={{ pr: 3, flexShrink: 0, color: 'text.secondary' }}>
        {cant}
      </Typography>
    </Stack>
  );
}
