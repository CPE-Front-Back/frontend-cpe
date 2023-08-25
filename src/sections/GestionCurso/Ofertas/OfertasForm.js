import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';

OfertasForm.propTypes = {
  editMode: PropTypes.bool,
  formData: PropTypes.object,
  onSubmit: PropTypes.func,
};
export default function OfertasForm({ editMode, formData, onSubmit }) {
  const { cod_oferta, cod_carrera, nomb_carrera, cod_curso, cant_ofertas, eliminada } = formData;
  const [numberInput, setNumberInput] = useState(cant_ofertas);

  const handleSubmit = (event) => {
    event.preventDefault();
    const updatedData = {
      cod_oferta: formData.cod_oferta,
      cod_carrera: formData.cod_carrera,
      nomb_carrera: formData.nomb_carrera,
      cod_curso: formData.cod_curso,
      cant_ofertas: Number(numberInput),
      eliminada: formData.eliminada,
    };
    onSubmit(updatedData);
  };

  return (
    <>
      <Box flexGrow={{ flexGrow: 1 }}>
        <Grid container spacing={5}>
          <Grid item xs={6}>
            <Typography variant="body1">Carrera: {nomb_carrera}</Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField
              type="number"
              label="Cantidad de Ofertas"
              variant="outlined"
              value={numberInput}
              onChange={(event) => setNumberInput(event.target.value)}
              required
            />
          </Grid>
        </Grid>

        <Grid container spacing={1}>
          <Grid item xs={5} />
          <Grid item xs={2}>
            <Button type="submit" variant="contained" color="primary" onClick={handleSubmit}>
              {editMode ? 'Modificar' : 'Registrar'}
            </Button>
          </Grid>
          <Grid item xs={5} />
        </Grid>
      </Box>
    </>
  );
}
