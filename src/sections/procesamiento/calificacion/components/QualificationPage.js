import {
  Alert,
  Autocomplete,
  Backdrop,
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { isNaN } from 'lodash';
import { useConfirm } from 'material-ui-confirm';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
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
  const [isLoading, setIsLoading] = useState(false);
  const { activeCourse, refreshProcessingStatus, setRefreshProcessingStatus } = UseActiveCourse();
  const confirm = useConfirm();

  const [errors, setErrors] = useState({
    selectedComp: '',
  });

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
      setIsLoading(true);
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
      setRequestersList([]);
      setRequesterListDump([]);
      setEmptyRows(0);
    }
  }, [selectedComp, activeCourse]);

  useEffect(() => {
    if (actasNotasList.length > 0 && asignacionesList.length > 0 && actasNotasList.length === asignacionesList.length) {
      console.log('actasNotasList', actasNotasList);
      console.log('asignacionesList', asignacionesList);

      const req = actasNotasList.map((actaNota, index) => ({
        no_anonimato: actaNota.cod_anonimato,
        calificacion: asignacionesList[index].calificacion === 0 ? -1 : asignacionesList[index].calificacion,
      }));

      setRequestersList(req);
      setRequesterListDump(req);
      setEmptyRows(1);
      setIsLoading(false);
    }
  }, [actasNotasList, asignacionesList]);

  const handleChange = (no_anonimato, event) => {
    const updatedRequestersList = requestersList.map((requester) => {
      if (requester.no_anonimato === no_anonimato) {
        // Update the calificacion for the matching requester
        return {
          ...requester,
          calificacion: ['NP', 'np', 'Np', 'nP'].includes(event.target.value) ? -1 : event.target.value,
        };
      }
      return requester; // Keep other requesters as they are
    });

    // Set the updated requestersList
    setRequestersList(updatedRequestersList);
  };

  const validateSelectedComp = () => {
    const newErrors = {};

    if (!selectedComp) {
      newErrors.selectedComp = 'Acta de notas requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCalifications = () => {
    let areValids = true;

    // Loop through the requestersList and validate califications
    requestersList.forEach((requester) => {
      const calificacion = requester.calificacion;

      if (isNaN(Number(calificacion)) || calificacion < -1 || calificacion > 100) {
        // Invalid calification, set areValids to false
        areValids = false;
      }
    });

    return areValids;
  };

  const handleAccept = () => {
    const isCompSelected = validateSelectedComp();
    const calificationsValids = validateCalifications();

    if (isCompSelected) {
      if (calificationsValids) {
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

                      const updatedAssignment = {
                        cod_acta: assignment.cod_acta,
                        cod_asignacion: assignment.cod_asignacion,
                        cod_solicitante: assignment.cod_solicitante,
                        calificacion: Number(requester.calificacion),
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
        setMessage('error', '¡Existen notas con valores incorrectos!');
      }
    }
  };

  useEffect(() => {
    if (updatedQualifications) {
      setRefreshProcessingStatus(refreshProcessingStatus + 1);
      setMessage('success', '¡Notas actualizadas con éxito!');
    }
  }, [updatedQualifications]);

  const handleCancel = () => {
    confirm({
      content: <Alert severity={'warning'}>¡Perderá los cambios no guardados! ¿Desea continuar?</Alert>,
    })
      .then(() => {
        setRequestersList(requesterListDump);
      })
      .catch(() => {});
  };

  const handleQualificationInput = (event) => {
    // Allow only numbers and minus sign
    const inputValue = event.target.value.replace(/[^-.0-9NnPp]/g, '');
    event.target.value = inputValue;
  };

  return (
    <>
      <Box
        flexGrow={{ flexGrow: 1 }}
        sx={{ backgroundColor: 'white', marginTop: '20px', pr: '100px', pl: '100px', pb: '20px', pt: '20px' }}
      >
        <Helmet>
          <title> Calificaciones | SAPCE </title>
        </Helmet>

        <Typography variant="h4" gutterBottom>
          Insertar calificaciones del instrumento
        </Typography>

        <Container sx={{ bgcolor: 'white', pt: '50px' }}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={1} sx={{ minWidth: '190px' }}>
              <Autocomplete
                id="comboComparecencias"
                options={comparecenciasList}
                value={selectedComp}
                onChange={(event, newValue) => {
                  if (newValue === null || JSON.stringify(requestersList) !== JSON.stringify(requesterListDump)) {
                    confirm({
                      content: <Alert severity={'warning'}>¡Perderá los cambios no guardados! ¿Desea continuar?</Alert>,
                    })
                      .then(() => {
                        setSelectedComp(newValue);
                        setUpdatedQualifications(false);
                      })
                      .catch(() => {});
                  } else {
                    setSelectedComp(newValue);
                    setUpdatedQualifications(false);
                  }
                }}
                getOptionLabel={(option) => option.cod_acta_comp + 500}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Actas de notas"
                    error={!!errors.selectedComp}
                    helperText={errors.selectedComp}
                  />
                )}
                noOptionsText={'No hay opciones'}
              />
            </Grid>

            <Grid item xs={12} />

            <Grid item xs={1} sx={{ minWidth: '500px' }}>
              <Card>
                {isLoading && (
                  <Backdrop
                    sx={{ bgcolor: 'rgba(255,255,255,0.41)', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={isLoading}
                  >
                    <CircularProgress color="primary" sx={{ ml: '200px', mt: '10px' }} />
                  </Backdrop>
                )}
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
                                  value={calificacion === -1 ? 'NP' : calificacion}
                                  onChange={(event) => handleChange(no_anonimato, event)}
                                  onInput={handleQualificationInput}
                                  variant={'standard'}
                                  size="large"
                                  margin={'none'}
                                  sx={{ padding: '0px', width: '50px', textAlign: 'center' }}
                                  inputProps={{ maxLength: 3 }}
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

            <Grid item container sx={{ mb: '20px' }}>
              <Grid item xs />

              <Grid item xs={2}>
                <Button type="submit" variant="contained" color="primary" onClick={handleCancel}>
                  Cancelar
                </Button>
              </Grid>

              <Grid item xs={2}>
                <Button type="submit" variant="contained" color="primary" onClick={handleAccept}>
                  Aceptar
                </Button>
              </Grid>

              <Grid item xs />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
