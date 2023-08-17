import { Button, TextField, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';

OfertasForm.propTypes = {
  editMode: PropTypes.bool,
  formData: PropTypes.object,
  onSubmit: PropTypes.func,
};
export default function OfertasForm({ editMode, formData, onSubmit }) {
  const { cod_oferta, cod_carrera, cod_curso, cant_ofertas } = formData;
  const [numberInput, setNumberInput] = useState(cant_ofertas);

  const hanldeSubmit = (event) => {
    event.preventDefault();

    onSubmit({ numberInput });
  };

  return (
    <>
      <Typography variant="body1">Carrera: {cod_carrera}</Typography>
      <TextField
        type="number"
        label="Cantidad de Ofertas"
        variant="outlined"
        value={numberInput}
        onChange={(event) => setNumberInput(event.target.value)}
        required
      />
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </>
  );
}
