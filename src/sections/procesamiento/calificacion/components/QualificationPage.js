import {
  Autocomplete,
  Button,
  Card,
  Container,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { isNaN } from 'lodash';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Await } from 'react-router-dom';
import Iconify from '../../../../components/iconify';
import setMessage from '../../../../components/messages/messages';
import Scrollbar from '../../../../components/scrollbar';
import { UseActiveCourse } from '../../../gestionCurso/curso/context/ActiveCourseContext';
import {
  getActasNotas,
  getAsignaciones,
  getComparecenciasCurso,
  getRequesterAct,
  getRequesterAssignment,
  updateQualification,
} from '../store/store';
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
  const [updatedQualifications, setUpdatedQualifications] = useState(false);

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
    // console.log('el selected del combo', selectedComp);
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

    // reset the list when no option selected
    if (selectedComp === null && requestersList.length > 0) {
      if (requestersList === requesterListDump) {
        setRequestersList([]);
        setEmptyRows(0);
      } else {
        const confrimed = window.confirm('Está a punto de perder los cambios no guardados! ¿Desea continuar?');

        if (confrimed) {
          setRequestersList([]);
          setEmptyRows(0);
        }
      }
    }
  }, [selectedComp, activeCourse]);

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

  const validateCalifications = () => {
    let isValid = true;

    // Loop through the requestersList and validate califications
    requestersList.forEach((requester) => {
      const calificacion = requester.calificacion;

      if (isNaN(Number(calificacion)) || calificacion < -1 || calificacion > 100) {
        // Invalid calification, set isValid to false
        isValid = false;
      }
    });

    return isValid;
  };

  const handleAccept = () => {
    const isValid = validateCalifications();

    if (isValid) {
      requestersList.forEach((requester) => {
        getRequesterAct(requester.no_anonimato)
          .then((response) => {
            if (response.status === 200) {
              const act = response.data;
              console.log('el acta', act);

              getRequesterAssignment(act.cod_acta)
                .then((response) => {
                  if (response.status === 200) {
                    const assignment = response.data;
                    console.log('la asignacion', assignment);

                    // todo
                    const updatedAssignment = {
                      cod_acta: assignment.cod_acta,
                      cod_asignacion: assignment.cod_asignacion,
                      cod_solicitante: assignment.cod_solicitante,
                      calificacion: requester.calificacion,
                    };

                    updateQualification(updatedAssignment)
                      .then((response) => {
                        if (response.status === 200) {
                          setUpdatedQualifications(true);
                        }
                      })
                      .catch((error) => {
                        console.log('Error al actualizar la nota', error);
                        setMessage('error', '¡Error al actualizar la nota!');
                      });
                  }
                })
                .catch((error) => {
                  console.log('Error al buscar la asignacion', error);
                  setMessage('error', '¡Error al buscar la asignación!');
                });
            }
          })
          .catch((error) => {
            console.log('Error al buscar el acta', error);
            setMessage('error', '¡Error al buscar el acta!');
          });
      });
    } else {
      console.log('errores en las notas');
      setMessage('error', '¡Existen notas con valores incorrectos!');
    }
  };

  useEffect(() => {
    if (updatedQualifications) {
      setMessage('success', '¡Notas actualizadas con éxito!');
    }
  }, [updatedQualifications]);

  const handleCancel = () => {
    // todo: use confirm dialog instead
    const confirmed = window.confirm('Está a punto de perder los cambios no guardados! ¿Desea continuar?');

    if (confirmed) {
      setRequestersList(requesterListDump);
    }
  };

  const handleQualificationInput = (event) => {
    // Allow only numbers and minus sign
    const inputValue = event.target.value.replace(/[^-.0-9]/g, '');
    event.target.value = inputValue;
  };

  return (
    <>
      <Helmet>
        <title> Calificaciones | CPE </title>
      </Helmet>

      <Typography variant="h4" gutterBottom>
        Insertar calificaciones del instrumento
      </Typography>

      <Container sx={{ bgcolor: 'white', pt: '50px' }}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={1} sx={{ minWidth: '170px' }}>
            <Autocomplete
              id="comboComparecencias"
              options={comparecenciasList}
              value={selectedComp}
              onChange={(event, newValue) => {
                setSelectedComp(newValue);
              }}
              getOptionLabel={(option) => option.cod_acta_comp + 500}
              renderInput={(params) => <TextField {...params} label="Actas de notas" />}
              noOptionsText={'No hay opciones'}
            />
          </Grid>

          <Grid item xs={12} />

          <Grid item xs={1} sx={{ minWidth: '500px' }}>
            <Card>
              <Scrollbar>
                <TableContainer>
                  <Table size="small">
                    <QualificationListHead headLabel={TABLE_HEAD} />

                    <TableBody sx={{ width: '100%' }}>
                      {requestersList.map((row) => {
                        const { no_anonimato, calificacion } = row;

                        return (
                          <TableRow key={no_anonimato} tabIndex={-1} hover sx={{ height: '30px' }}>
                            <TableCell align="center">{no_anonimato}</TableCell>

                            <TableCell align="center" sx={{ padding: '1px' }}>
                              <TextField
                                type={'text'}
                                value={calificacion}
                                onChange={(event) => handleChange(no_anonimato, event)}
                                onInput={handleQualificationInput}
                                variant={'standard'}
                                size="large"
                                margin={'none'}
                                sx={{ padding: '0px', width: '50px', textAlign: 'center' }}
                              />
                            </TableCell>
                            <TableCell align="center">{}</TableCell>
                          </TableRow>
                        );
                      })}
                      {emptyRows === 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                          <TableCell colSpan={6} sx={{ textAlign: 'center' }}>
                            Seleccione un acta de notas
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Scrollbar>
            </Card>
          </Grid>

          <Grid item xs={12} />

          <Grid item container xs={3}>
            <Grid item xs>
              <Button type="submit" variant="contained" color="primary" onClick={handleAccept}>
                Aceptar
              </Button>
            </Grid>

            <Grid item xs>
              <Button type="submit" variant="contained" color="primary" onClick={handleCancel}>
                Cancelar
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
