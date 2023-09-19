import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { UseActiveCourse } from '../../gestionCurso/curso/context/ActiveCourseContext';
import { insertarOferta } from '../../gestionCurso/ofertas/store/store';
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
          }
        })
        .catch((error) => {
          console.log('Error al modificar la facultad: ', error);
        });
    } else {
      insertFaculty(updatedData)
        .then((response) => {
          if (response.status === 200) {
            console.log(response.data);
          }
        })
        .catch((error) => {
          console.log('Error al registrar la facultad: ', error);
        });
    }

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
          <Grid item xs />
        </Grid>
      </Box>
    </>
  );
}
