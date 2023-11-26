import { Alert, Box, Button, Grid, TextField, Typography } from '@mui/material';
import { useConfirm } from 'material-ui-confirm';
import PropTypes from 'prop-types';
import { useState } from 'react';
import setMessage from '../../../../components/messages/messages';
import { insertFaculty, updateFaculty } from '../store/store';

FacultadesForm.propTypes = {
  editMode: PropTypes.bool,
  formData: PropTypes.object,
  onSubmit: PropTypes.func,
};
export default function FacultadesForm({ editMode, formData, onSubmit }) {
  const { cod_facultad, nomb_facultad, eliminada } = formData;
  const [facultyNameInput, setFacultyNameInput] = useState(nomb_facultad);

  const confirm = useConfirm();

  const [errors, setErrors] = useState({
    faclutyName: '',
  });

  const validateData = () => {
    const newErrors = {};

    if (!facultyNameInput) {
      newErrors.faclutyName = 'Nombre requerido';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validateData()) {
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
    }
  };

  const handleCancel = () => {
    confirm({
      content: <Alert severity={'warning'}>¡Perderá los cambios no guardados! ¿Desea continuar?</Alert>,
    })
      .then(() => {
        onSubmit();
      })
      .catch(() => {});
  };

  const handleNameInput = (event) => {
    // allow only letters
    const inputValue = event.target.value.replace(/[^a-zA-Z]/g, '');
    event.target.value = inputValue;
  };

  return (
    <>
      <Box
        flexGrow={{ flexGrow: 1 }}
        sx={{ backgroundColor: 'white', marginTop: '80px', pr: '100px', pl: '100px', pb: '20px', pt: '20px' }}
      >
        <Typography variant="h4" gutterBottom>
          {editMode ? 'Editar Facultad' : 'Registrar Facultad'}
        </Typography>

        <Grid container spacing={2} sx={{ pt: 5 }}>
          <Grid item xs />
          <Grid item xs={3.5} sx={{ ml: '-30px' }}>
            <TextField
              type={'text'}
              label="Nombre"
              variant="outlined"
              value={facultyNameInput}
              onInput={handleNameInput}
              onChange={(event) => setFacultyNameInput(event.target.value)}
              error={!!errors.faclutyName}
              helperText={errors.faclutyName}
              inputProps={{ maxLength: 30 }}
              required
            />
          </Grid>
          <Grid item xs />
        </Grid>

        <Grid container spacing={1} sx={{ pt: 5 }}>
          <Grid item xs />
          <Grid item xs={2}>
            <Button type="submit" variant="contained" color="primary" onClick={handleCancel}>
              Cancelar
            </Button>
          </Grid>
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
