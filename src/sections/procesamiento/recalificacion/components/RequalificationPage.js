import { Alert, Button, Container, Grid, TextField, Typography } from '@mui/material';
import { isNaN } from 'lodash';
import { useConfirm } from 'material-ui-confirm';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import setMessage from '../../../../components/messages/messages';
import { UseActiveCourse } from '../../../gestionCurso/curso/context/ActiveCourseContext';
import {
  getActByRequesterId,
  getAssignmentByRequesterId,
  getRequesterInRoomById,
  insertRequalification,
} from '../store/store';

export default function RequalificationPage() {
  const [requesterIdNumber, setRequesterIdNumber] = useState(null);
  const [requester, setRequester] = useState(null);
  const [anonNumber, setAnonNumber] = useState(null);
  const [calification, setCalification] = useState(null);
  const [calificationDumb, setCalificationDumb] = useState(null);
  const [focused, setFocused] = useState(false);

  const { activeCourse } = UseActiveCourse();
  const confirm = useConfirm();

  const [errors, setErrors] = useState({
    requesterIdNumber: '',
    calification: '',
  });

  const validateRequalification = () => {
    const newErrors = {};

    if (!requester) {
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

  const validateRequesterIdNumber = () => {
    const newErrors = {};

    if (!requesterIdNumber) {
      newErrors.requesterIdNumber = 'No. Identidad requerido';
    } else if (requesterIdNumber?.length !== 11) {
      newErrors.requesterIdNumber = 'El carnet de identidad debe tener 11 dígitos.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const findRequester = () => {
    if (validateRequesterIdNumber()) {
      getRequesterInRoomById(requesterIdNumber, activeCourse.cod_curso)
        .then((response) => {
          if (response.status === 200) {
            const requester = response.data;
            setRequester(requester);
            console.log('el solicitante', requester);
            getActByRequesterId(requester.cod_solicitante)
              .then((response) => {
                if (response.status === 200) {
                  const act = response.data;
                  console.log('el acta', act);
                  getAssignmentByRequesterId(requester.cod_solicitante)
                    .then((response) => {
                      if (response.status === 200) {
                        const assignment = response.data;
                        console.log('la asignacion', assignment);

                        setAnonNumber(act.cod_anonimato);
                        setCalification(assignment.calificacion);
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
        })
        .catch((error) => {
          console.log('Error al buscar el solicitante', error);
        });
    }
  };

  const clearForm = () => {
    setRequesterIdNumber('');
    setRequester(null);
    setAnonNumber('');
    setCalification('');
    setCalificationDumb('');
  };

  const handleAccept = () => {
    if (validateRequalification()) {
      const requalification = {
        cod_curso: activeCourse.cod_curso,
        cod_solicitante: requester.cod_solicitante,
        recalificacion: Number(calification),
      };
      console.log('la recalificacion', requalification);
      insertRequalification(requalification).then((response) => {
        if (response.status === 200) {
          setMessage('success', '¡Recalificación insertada con éxito!');

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

  const handleRequesterIdInput = (event) => {
    // Allow only numbers
    const inputValue = event.target.value.replace(/[^0-9]/g, '');
    event.target.value = inputValue;
  };

  const handleRequalificationInput = (event) => {
    // Allow only floating point numbers
    const inputValue = event.target.value.replace(/[^.0-9]/g, '');
    event.target.value = inputValue;
  };

  return (
    <>
      <Container sx={{ pt: '50px' }}>
        <Helmet>
          <title> Recalificaciones | SAPCE </title>
        </Helmet>
        <Typography variant="h4" gutterBottom>
          Insertar recalificación
        </Typography>

        <Container sx={{ bgcolor: 'white', pt: '50px' }}>
          <Grid container spacing={2} sx={{ pt: '10px' }}>
            <Grid item xs />
            <Grid item xs={3}>
              <TextField
                label="Carnet de identidad"
                variant="outlined"
                value={requesterIdNumber}
                onChange={(event) => {
                  setRequesterIdNumber(event.target.value);
                }}
                onInput={handleRequesterIdInput}
                inputProps={{ maxLength: 11 }}
                error={!!errors.requesterIdNumber}
                helperText={errors.requesterIdNumber}
                required
              />
            </Grid>
            <Grid item xs={3}>
              <Button variant="contained" sx={{ width: '100%', mt: '10px' }} onClick={findRequester}>
                Buscar
              </Button>
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
                  shrink: !!anonNumber,
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
                InputLabelProps={{
                  shrink: !!calification || focused,
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
    </>
  );
}
