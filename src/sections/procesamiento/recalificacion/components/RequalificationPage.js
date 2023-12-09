import {
  Alert,
  Autocomplete,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { isNaN } from 'lodash';
import { useConfirm } from 'material-ui-confirm';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import setMessage from '../../../../components/messages/messages';
import { UseActiveCourse } from '../../../gestionCurso/curso/context/ActiveCourseContext';
import {
  getActByRequesterId,
  getAllRequestersInRoom,
  getAssignmentByRequesterId,
  getRequesterInRoomById,
  insertRequalification,
} from '../store/store';

export default function RequalificationPage() {
  const [requesters, setRequesters] = useState(null);
  const [selectedRequester, setSelectedRequester] = useState(null);
  const [anonNumber, setAnonNumber] = useState(null);
  const [calification, setCalification] = useState(null);
  const [calificationDumb, setCalificationDumb] = useState(null);
  const [focused, setFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { activeCourse, refreshProcessingStatus, setRefreshProcessingStatus } = UseActiveCourse();
  const confirm = useConfirm();

  const [errors, setErrors] = useState({
    requesterIdNumber: '',
    calification: '',
  });

  const validateRequalification = () => {
    const newErrors = {};

    if (!selectedRequester) {
      newErrors.requesterIdNumber = 'No. Identidad requerido';
    }
    if (!calification) {
      newErrors.calification = 'Calificación requerida';
    } else if (isNaN(Number(calification)) || calification < 0 || calification > 100) {
      newErrors.calification = 'La calificación debe estar entre 0 y 100.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    getAllRequestersInRoom(activeCourse.cod_curso)
      .then((response) => {
        if (response.status === 200) {
          setRequesters(response.data);
        }
      })
      .catch((error) => {
        console.log('Error al buscar todos los solicitantes', error);
      });
  }, []);

  useEffect(() => {
    if (selectedRequester) {
      setIsLoading(true);
      getActByRequesterId(selectedRequester.cod_solicitante)
        .then((response) => {
          if (response.status === 200) {
            const act = response.data;
            console.log('el acta', act);
            getAssignmentByRequesterId(selectedRequester.cod_solicitante)
              .then((response) => {
                if (response.status === 200) {
                  const assignment = response.data;
                  console.log('la asignacion', assignment);

                  setAnonNumber(act.cod_anonimato);
                  setCalification(assignment.calificacion);
                  setIsLoading(false);
                  setCalificationDumb(assignment.calificacion);
                }
              })
              .catch((error) => {
                console.log('Error al buscar la solicitud del solicitante', error);
              });
          }
        })
        .catch((error) => {
          console.log('Error al buscar el acta del solicitante', error);
        });
    }
  }, [selectedRequester]);

  const clearForm = () => {
    setSelectedRequester(null);
    setAnonNumber('');
    setCalification('');
    setCalificationDumb('');
  };

  const handleAccept = () => {
    if (validateRequalification()) {
      const requalification = {
        cod_curso: activeCourse.cod_curso,
        cod_solicitante: selectedRequester.cod_solicitante,
        recalificacion: Number(calification),
      };
      console.log('la recalificacion', requalification);
      insertRequalification(requalification).then((response) => {
        if (response.status === 200) {
          setMessage('success', '¡Recalificación insertada con éxito!');
          setRefreshProcessingStatus(refreshProcessingStatus + 1);

          setTimeout(() => {
            confirm({
              content: <Alert severity={'warning'}>¿Desea insertar otra recalificación?</Alert>,
            })
              .then(() => {
                clearForm();
              })
              .catch(() => {});
          }, 400);
        }
      });
    }
  };

  const handleCancel = () => {
    confirm({
      content: <Alert severity={'warning'}>¡Perderá los cambios no guardados! ¿Desea continuar?</Alert>,
    })
      .then(() => {
        setCalification(calificationDumb);
      })
      .catch(() => {});
  };

  const handleRequalificationInput = (event) => {
    // Allow only floating point numbers
    const inputValue = event.target.value.replace(/[^.0-9]/g, '');
    event.target.value = inputValue;
  };

  return (
    <>
      <Box
        flexGrow={{ flexGrow: 1 }}
        sx={{ backgroundColor: 'white', marginTop: '20px', pr: '100px', pl: '100px', pb: '20px', pt: '20px' }}
      >
        <Container>
          <Helmet>
            <title> Recalificaciones | SAPCE </title>
          </Helmet>
          <Typography variant="h4" gutterBottom>
            Insertar recalificación
          </Typography>

          <Container sx={{ bgcolor: 'white', pt: '50px' }}>
            {isLoading && (
              <Backdrop sx={{ bgcolor: 'rgba(255,255,255,0.41)', zIndex: 1 }} open={isLoading}>
                <CircularProgress color="primary" sx={{ ml: '200px', mt: '10px' }} />
              </Backdrop>
            )}
            <Grid container spacing={2} sx={{ pt: '10px' }}>
              <Grid item xs />
              <Grid item xs={3}>
                <Autocomplete
                  id="RequestersCombo"
                  options={requesters}
                  getOptionLabel={(option) => option.num_id}
                  value={selectedRequester}
                  onChange={(event, newValue) => {
                    if (newValue === null || calification !== calificationDumb) {
                      confirm({
                        content: (
                          <Alert severity={'warning'}>¡Perderá los cambios no guardados! ¿Desea continuar?</Alert>
                        ),
                      })
                        .then(() => {
                          setSelectedRequester(newValue);
                          setAnonNumber('');
                          setCalification('');
                          setCalificationDumb('');
                        })
                        .catch(() => {});
                    } else {
                      setSelectedRequester(newValue);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Solicitantes"
                      error={!!errors.requesterIdNumber}
                      helperText={errors.requesterIdNumber}
                      required
                    />
                  )}
                  noOptionsText={'No hay opciones'}
                />
              </Grid>
              <Grid item xs />
            </Grid>

            <Grid container spacing={1} sx={{ pt: '50px', pb: '20px' }}>
              <Grid item xs />
              <Grid item xs={3}>
                <TextField
                  type="number"
                  label="No. Anonimato"
                  variant="outlined"
                  value={anonNumber}
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{
                    shrink: !!anonNumber || anonNumber === 0,
                  }}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label="Calificación"
                  variant="outlined"
                  value={calification}
                  onChange={(event) => setCalification(event.target.value)}
                  onInput={handleRequalificationInput}
                  required
                  InputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                  inputProps={{ maxLength: 3 }}
                  InputLabelProps={{
                    shrink: !!calification || focused || calification === 0,
                  }}
                  error={!!errors.calification}
                  helperText={errors.calification}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                />
              </Grid>
              <Grid item xs />

              <Grid container spacing={2} sx={{ pt: '15px', pb: '20px', pl: '8px' }}>
                <Grid item xs />
                <Grid item xs={3}>
                  <Button variant="contained" sx={{ width: '100%' }} onClick={handleCancel}>
                    Cancelar
                  </Button>
                </Grid>
                <Grid item xs={3}>
                  <Button variant="contained" sx={{ width: '100%' }} onClick={handleAccept}>
                    Aceptar
                  </Button>
                </Grid>
                <Grid item xs />
              </Grid>
            </Grid>
          </Container>
        </Container>
      </Box>
    </>
  );
}
