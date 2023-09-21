import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import OfertasForm from '../../gestionCurso/ofertas/OfertasForm';
import { insertCarrera, updateCarrera } from './store/store';

OfertasForm.propTypes = {
  editMode: PropTypes.bool,
  formData: PropTypes.object,
  onSubmit: PropTypes.func,
};
export default function CareersForm({ editMode, formData, onSubmit }) {
  const { cod_carrera, nomb_carrera } = formData;
  const [codCarreraInput, setCodCarreraInput] = useState(cod_carrera);
  const [nombCarreraInput, setNombCarreraInput] = useState(nomb_carrera);

  const handleSubmit = (event) => {
    event.preventDefault();

    const updatedData = {
      cod_carrera: codCarreraInput,
      nomb_carrera: nombCarreraInput,
      eliminada: false,
    };

    if (editMode) {
      updateCarrera(updatedData)
        .then((response) => {
          if (response.status === 200) {
            console.log(response.data);
          }
        })
        .catch((error) => {
          console.log('Error al registrar la carrera: ', error);
        });
    } else {
      insertCarrera(updatedData)
        .then((response) => {
          if (response.status === 200) {
            console.log(response.data);
          }
        })
        .catch((error) => {
          console.log('Error al modificar la carrera: ', error);
        });
    }
    onSubmit();
  };

  const handleBack = (event) => {
    event.preventDefault();

    setTimeout(() => {
      onSubmit();
    }, 500);
  };

  return (
    <>
      <Box
        flexGrow={{ flexGrow: 1 }}
        sx={{ backgroundColor: 'white', marginTop: '80px', pr: '100px', pl: '100px', pb: '20px', pt: '20px' }}
      >
        <Typography variant="h4" sx={{ pb: '10px' }}>
          {editMode ? 'Editar Carrera' : 'Registrar Carrera'}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs>
            <TextField
              type="number"
              label="Codigo"
              variant="outlined"
              value={codCarreraInput}
              onChange={(event) => setCodCarreraInput(event.target.value)}
              required
            />
          </Grid>

          <Grid item xs />

          <Grid item xs>
            <TextField
              type="text"
              label="Nombre"
              variant="outlined"
              value={nombCarreraInput}
              onChange={(event) => setNombCarreraInput(event.target.value)}
              required
            />
          </Grid>
        </Grid>

        <Grid container spacing={1} sx={{ pt: 5 }}>
          <Grid item xs />
          <Grid item xs={2}>
            <Button type="submit" variant="contained" color="primary" onClick={handleSubmit}>
              {editMode ? 'Modificar' : 'Registrar'}
            </Button>
          </Grid>
          <Grid item xs>
            <Button type="submit" variant="contained" color="primary" onClick={handleBack}>
              Cancelar
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
