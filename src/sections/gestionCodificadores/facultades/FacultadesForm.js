import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import setMessage from '../../../components/messages/messages';
import { insertFaculty, updateFaculty } from './store/store';

FacultadesForm.propTypes = {
  editMode: PropTypes.bool,
  formData: PropTypes.object,
  onSubmit: PropTypes.func,
};
export default function FacultadesForm({ editMode, formData, onSubmit }) {
  const { cod_facultad, nomb_facultad, eliminada } = formData;
  const [facultyNameInput, setFacultyNameInput] = useState(nomb_facultad);

  const handleSubmit = (event) => {
    event.preventDefault();
    const updatedData = {
      cod_facultad: formData.cod_facultad,
      nomb_facultad: facultyNameInput,
      eliminada: false,
    };

    if (editMode) {
      updateFaculty(updatedData)
        .then((response) => {
          if (response.status === 200) {
            console.log(response.data);
            setMessage('success', '¡Facultad actualizada con éxito!');
          }
        })
        .catch((error) => {
          console.log('Error al modificar la facultad: ', error);
          setMessage('error', '¡Ha ocurrido un error!');
        });
    } else {
      insertFaculty(updatedData)
        .then((response) => {
          if (response.status === 200) {
            console.log(response.data);
            setMessage('success', '¡Facultad registrada con éxito!');
          }
        })
        .catch((error) => {
          console.log('Error al registrar la facultad: ', error);
          setMessage('error', '¡Ha ocurrido un error!');
        });
    }

    setTimeout(() => {
      onSubmit();
    }, 500);
  };

  const handleBack = (event) => {
    event.preventDefault();

    onSubmit();
  };

  return (
    <>
      <Box
        flexGrow={{ flexGrow: 1 }}
        sx={{ backgroundColor: 'white', marginTop: '80px', pr: '100px', pl: '100px', pb: '20px', pt: '20px' }}
      >
        <Typography variant="h4" sx={{ pb: '10px' }}>
          {editMode ? 'Editar Facultad' : 'Registrar Facultad'}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs>
            <TextField
              type="text"
              label="Nombre"
              variant="outlined"
              value={facultyNameInput}
              onChange={(event) => setFacultyNameInput(event.target.value)}
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
