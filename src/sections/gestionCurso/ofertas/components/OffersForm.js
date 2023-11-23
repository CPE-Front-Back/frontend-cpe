import { Alert, Autocomplete, Box, Button, Grid, TextField, Typography } from '@mui/material';
import { isNaN } from 'lodash';
import { useConfirm } from 'material-ui-confirm';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import setMessage from '../../../../components/messages/messages';

import { getCarreras } from '../../../gestionCodificadores/carreras/store/store';
import { UseActiveCourse } from '../../curso/context/ActiveCourseContext';
import { getAllOfertasByCurso, insertarOferta, updateOferta } from '../store/store';

OffersForm.propTypes = {
  editMode: PropTypes.bool,
  formData: PropTypes.object,
  onSubmit: PropTypes.func,
};
export default function OffersForm({ editMode, formData, onSubmit }) {
  const confirm = useConfirm();

  const { cod_oferta, cod_carrera, nomb_carrera, cod_curso, cant_ofertas, eliminada } = formData;
  const [amountInput, setAmountInput] = useState(cant_ofertas);
  const { activeCourse } = UseActiveCourse();

  const [currentOffers, setCurrentOffers] = useState([]);
  const [careers, setCareers] = useState([]);
  const [filteredCareers, setFilteredCareers] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState(formData.nomb_carrera ? formData : null);

  const [errors, setErrors] = useState({
    career: '',
    amount: '',
  });

  useEffect(() => {
    // filtrar las carreras disponibles a insertar
    const listaFiltrada = careers.filter(
      (carrera) =>
        !Object.values(currentOffers).some(
          (ofertaActual) => ofertaActual && ofertaActual.nomb_carrera === carrera.nomb_carrera
        )
    );

    setFilteredCareers(listaFiltrada);
  }, [currentOffers]);

  useEffect(() => {
    getCarreras()
      .then((response) => {
        if (response.status === 200) {
          setCareers(response.data);
        }
      })
      .catch((error) => {
        console.log('Error al cargar las carreras', error);
      });
  }, []);

  useEffect(() => {
    getAllOfertasByCurso(activeCourse.cod_curso)
      .then((response) => {
        if (response.status === 200) {
          const updatedOfertasList = response.data.map((oferta) => {
            const relatedCarrera = careers.find((carrera) => carrera.cod_carrera === oferta.cod_carrera);
            return {
              ...oferta,
              nomb_carrera: relatedCarrera ? relatedCarrera.nomb_carrera : 'Unknown', // Replace 'Unknown' with a default name
            };
          });
          setCurrentOffers(updatedOfertasList);
        }
      })
      .catch((error) => {
        console.log('Error al cargar ofertas: ', error);
      });
  }, [careers]);

  const validateData = () => {
    const newErrors = {};

    if (!selectedCareer) {
      newErrors.career = 'Carrera requerida';
    }
    if (!amountInput) {
      newErrors.amount = 'Cantidad de plazas requerida';
    } else if (isNaN(Number(amountInput)) || amountInput < 0 || amountInput > 200) {
      newErrors.amount = 'La cantidad debe estar entre 0 y 200.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validateData()) {
      if (editMode) {
        const updatedData = {
          cod_oferta: formData.cod_oferta,
          cod_carrera: formData.cod_carrera,
          nomb_carrera: formData.nomb_carrera,
          cod_curso: formData.cod_curso,
          cant_ofertas: Number(amountInput),
          eliminada: formData.eliminada,
        };

        updateOferta(updatedData)
          .then((response) => {
            if (response.status === 200) {
              console.log(response.data);
              setMessage('success', '¡Oferta actualizada con éxito!');
            }
          })
          .catch((error) => {
            console.log('Error al actualizar la oferta: ', error);
            setMessage('error', '¡Ha ocurrido un error!');
          });
      } else {
        const updatedData = {
          cod_oferta: -1,
          cod_carrera: selectedCareer.cod_carrera,
          nomb_carrera: selectedCareer.nomb_carrera,
          cod_curso: activeCourse.cod_curso,
          cant_ofertas: Number(amountInput),
          eliminada: false,
        };

        insertarOferta(updatedData)
          .then((response) => {
            if (response.status === 200) {
              console.log(response.data);
              setMessage('success', '¡Oferta registrada con éxito!');
            }
          })
          .catch((error) => {
            console.log('Error al registrar la oferta: ', error);
            setMessage('error', '¡Ha ocurrido un error!');
          });

        // console.log('la oferta a insertar: ', updatedData);
      }

      setTimeout(() => {
        onSubmit();
      }, 500);
    }
  };

  const handleCancel = (event) => {
    confirm({
      content: <Alert severity={'warning'}>¡Perderá los cambios no guardados! ¿Desea continuar?</Alert>,
    })
      .then(() => {
        onSubmit();
      })
      .catch(() => {});
  };

  const handleAmountInput = (event) => {
    // Allow only numbers
    const inputValue = event.target.value.replace(/[^0-9]/g, '');
    event.target.value = inputValue;
  };

  return (
    <>
      <Box
        flexGrow={{ flexGrow: 1 }}
        sx={{ backgroundColor: 'white', marginTop: '80px', pr: '100px', pl: '100px', pb: '20px', pt: '20px' }}
      >
        <Typography variant="h4" gutterBottom>
          {editMode ? 'Editar Oferta' : 'Registrar Oferta'}
        </Typography>

        <Grid container spacing={2} sx={{ pt: 5 }}>
          <Grid item xs />
          <Grid item xs sx={{ minWidth: '400px' }}>
            {/* <Typography variant="body1">Carrera: {nomb_carrera}</Typography> */}
            <Autocomplete
              id="ComboOfertas"
              options={filteredCareers}
              getOptionLabel={(option) => option.nomb_carrera}
              value={selectedCareer}
              onChange={(event, newValue) => {
                setSelectedCareer(newValue);
              }}
              readOnly={editMode}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Carreras disponibles"
                  error={!!errors.career}
                  helperText={errors.career}
                  required
                />
              )}
              noOptionsText={'No hay opciones'}
            />
          </Grid>

          <Grid item xs={3}>
            <TextField
              type={'text'}
              label="Cantidad de plazas"
              variant="outlined"
              value={amountInput}
              onInput={handleAmountInput}
              onChange={(event) => setAmountInput(event.target.value)}
              required
              error={!!errors.amount}
              helperText={errors.amount}
              inputProps={{ maxLength: 3 }}
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
