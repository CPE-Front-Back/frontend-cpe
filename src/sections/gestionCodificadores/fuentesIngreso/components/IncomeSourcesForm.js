import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import setMessage from '../../../../components/messages/messages';
import { insertIncomeSource, updateIncomeSource } from '../store/store';

IncomeSourcesForm.propTypes = {
  editMode: PropTypes.bool,
  formData: PropTypes.object,
  onSubmit: PropTypes.func,
};
export default function IncomeSourcesForm({ editMode, formData, onSubmit }) {
  const { cod_fuente, nomb_fuente, eliminada } = formData;
  const [IncomeSourceNameInput, setIncomeSourceNameInput] = useState(nomb_fuente);

  const handleSubmit = (event) => {
    event.preventDefault();
    const updatedData = {
      cod_fuente: formData.cod_fuente,
      nomb_fuente: IncomeSourceNameInput,
      eliminada: false,
    };

    if (editMode) {
      updateIncomeSource(updatedData)
        .then((response) => {
          if (response.status === 200) {
            console.log(response.data);
            setMessage('success', '¡Fuente de ingreso actualizada con éxito!');
          }
        })
        .catch((error) => {
          console.log('Error al modificar la fuente de ingreso: ', error);
          setMessage('error', '¡Ha ocurrido un error!');
        });
    } else {
      insertIncomeSource(updatedData)
        .then((response) => {
          if (response.status === 200) {
            console.log(response.data);
            setMessage('success', '¡Fuente de ingreso registrada con éxito!');
          }
        })
        .catch((error) => {
          console.log('Error al registrar la fuente de ingreso: ', error);
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
          {editMode ? 'Editar Fuente de ingreso' : 'Registrar Fuente de ingreso'}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs>
            <TextField
              type="text"
              label="Nombre"
              variant="outlined"
              value={IncomeSourceNameInput}
              onChange={(event) => setIncomeSourceNameInput(event.target.value)}
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
