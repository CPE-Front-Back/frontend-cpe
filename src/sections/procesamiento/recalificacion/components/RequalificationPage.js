import { Button, Container, Grid, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { UseActiveCourse } from '../../../gestionCurso/curso/context/ActiveCourseContext';
import { getActByRequesterId, getAssignmentByRequesterId, getRequesterInRoomById } from '../store/store';

export default function RequalificationPage() {
  // todo: implement logic
  const [requeterIdNumber, setRequeterIdNumber] = useState(null);
  const [anonNumber, setAnonNumber] = useState(null);
  const [calification, setCalification] = useState(null);
  const [focused, setFocused] = useState(false);

  const { activeCourse } = UseActiveCourse();

  useEffect(() => {
    console.log('requeterIdNumber', requeterIdNumber);
  }, [requeterIdNumber]);

  const findRequester = () => {
    getRequesterInRoomById(requeterIdNumber, activeCourse.cod_curso)
      .then((response) => {
        if (response.status === 200) {
          const requester = response.data;
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
    return null;
  };

  return (
    <>
      <Helmet>
        <title> Recalificaciones | CPE </title>
      </Helmet>
      <Typography variant="h4" gutterBottom>
        Insertar recalificación
      </Typography>

      <Container sx={{ bgcolor: 'white', pt: '50px' }}>
        <Grid container spacing={2} sx={{ pt: '10px' }}>
          <Grid item xs />
          <Grid item xs={3}>
            <TextField
              type="number"
              label="Carnet de identidad"
              variant="outlined"
              value={requeterIdNumber}
              onChange={(event) => {
                setRequeterIdNumber(event.target.value);
              }}
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
              required
              InputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              InputLabelProps={{
                shrink: !!calification || focused,
              }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
          </Grid>
          <Grid item xs />

          <Grid container spacing={2} sx={{ pt: '15px', pb: '20px', pl: '8px' }}>
            <Grid item xs />
            <Grid item xs={3}>
              <Button variant="contained" sx={{ width: '100%' }} onClick={() => {}}>
                Aceptar
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Button variant="contained" sx={{ width: '100%' }} onClick={() => {}}>
                Cancelar
              </Button>
            </Grid>
            <Grid item xs />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
