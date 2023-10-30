import {
  Autocomplete,
  Button,
  Card,
  Container,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Scrollbar from '../../../../components/scrollbar';
import { UseActiveCourse } from '../../../gestionCurso/curso/context/ActiveCourseContext';
import { getActasNotas, getAsignaciones, getComparecenciasCurso } from '../store/store';
import QualificationListHead from './QualificationListHead';

const TABLE_HEAD = [
  { id: 'no_anonimato', label: 'No. Anonimato', alignRight: false },
  { id: 'calificacion', label: 'Calificación', alignRight: false },
  { id: '' },
];

export default function QualificationPage() {
  const [comparecenciasList, setComparecenciasList] = useState([]);
  const [selectedComp, setSelectedComp] = useState(null);

  const [actasNotasList, setActasNotasList] = useState([]);
  const [asignacionesList, setAsignacionesList] = useState([]);

  const [requestersList, setRequestersList] = useState([]);
  const [requesterListDump, setRequesterListDump] = useState([]);
  const [updatedQualifications, setUpdatedQualifications] = useState([]);

  const [emptyRows, setEmptyRows] = useState(0);
  const { activeCourse } = UseActiveCourse();

  useEffect(() => {
    getComparecenciasCurso(activeCourse.cod_curso)
      .then((response) => {
        if (response.status === 200) {
          setComparecenciasList(response.data);
        }
      })
      .catch((error) => {
        console.log('Error al cargar los actas de comparecencia', error);
      });
  }, [activeCourse]);

  // cargar las actas de notas y las asiganciones
  useEffect(() => {
    if (selectedComp) {
      console.log('selected', selectedComp.cod_acta_comp);
      getActasNotas(activeCourse.cod_curso, selectedComp.cod_acta_comp)
        .then((response) => {
          if (response.status === 200) {
            setActasNotasList(response.data);
          }
        })
        .catch((error) => {
          console.log('Error al cargar los actas de notas', error);
        });

      getAsignaciones(activeCourse.cod_curso, selectedComp.cod_acta_comp)
        .then((response) => {
          if (response.status === 200) {
            setAsignacionesList(response.data);
          }
        })
        .catch((error) => {
          console.log('Error al cargar las asignaciones', error);
        });
    }
  }, [selectedComp]);

  useEffect(() => {
    if (actasNotasList.length > 0 && asignacionesList.length > 0) {
      const req = actasNotasList.map((actaNota, index) => ({
        no_anonimato: actaNota.cod_anonimato,
        calificacion: asignacionesList[index].calificacion,
      }));

      setRequestersList(req);
      setRequesterListDump(req);
      setEmptyRows(1);
      console.log('actasNotasList', actasNotasList);
      console.log('asignacionesList', asignacionesList);
    }
  }, [actasNotasList, asignacionesList]);

  const handleChange = (no_anonimato, event) => {
    const updatedRequestersList = requestersList.map((requester) => {
      if (requester.no_anonimato === no_anonimato) {
        // Update the calificacion for the matching requester
        return { ...requester, calificacion: event.target.value };
      }
      return requester; // Keep other requesters as they are
    });

    // Set the updated requestersList
    setRequestersList(updatedRequestersList);
  };

  const handleLimpiar = () => {
    const confrimed = window.confirm('Está a punto de perder los cambios no guardados! ¿Desea continuar?');

    if (confrimed) {
      setRequestersList(requesterListDump);
    }
  };

  return (
    <>
      <Helmet>
        <title> Calificaciones | CPE </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Calificación del instrumento
          </Typography>
        </Stack>

        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ minWidth: '400px' }}>
            <Autocomplete
              id="comboComparecencias"
              options={comparecenciasList}
              value={selectedComp}
              onChange={(event, newValue) => {
                setSelectedComp(newValue);
              }}
              getOptionLabel={(option) => option.cod_acta_comp + 500}
              renderInput={(params) => <TextField {...params} label="Actas de notas disponibles" />}
              noOptionsText={'No hay opciones'}
            />
          </Grid>

          <Grid item xs={12} sx={{ minWidth: '500px' }}>
            <Card>
              <Scrollbar>
                <TableContainer>
                  <Table size="small">
                    <QualificationListHead headLabel={TABLE_HEAD} />

                    <TableBody>
                      {requestersList.map((row) => {
                        const { no_anonimato, calificacion } = row;

                        return (
                          <TableRow key={no_anonimato} tabIndex={-1} hover>
                            <TableCell align="left">{no_anonimato}</TableCell>

                            <TableCell align="left">
                              <TextField
                                type={'text'}
                                value={calificacion}
                                onChange={(event) => handleChange(no_anonimato, event)}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {emptyRows === 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                          <TableCell colSpan={6}>Nada que mostrar</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Scrollbar>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" onClick={() => {}}>
              Aceptar
            </Button>
            <Button type="submit" variant="contained" color="primary" onClick={handleLimpiar}>
              Cancelar
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
