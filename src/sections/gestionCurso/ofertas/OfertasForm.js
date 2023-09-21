import { Autocomplete, Box, Button, Grid, TextField, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import { getCarreras } from '../../gestionCodificadores/carreras/store/store';
import { UseActiveCourse } from '../curso/context/ActiveCourseContext';
import { getAllOfertasByCurso, insertarOferta, updateOferta } from './store/store';

OfertasForm.propTypes = {
  editMode: PropTypes.bool,
  formData: PropTypes.object,
  onSubmit: PropTypes.func,
};
export default function OfertasForm({ editMode, formData, onSubmit }) {
  const { cod_oferta, cod_carrera, nomb_carrera, cod_curso, cant_ofertas, eliminada } = formData;
  const [numberInput, setNumberInput] = useState(cant_ofertas);
  const { activeCourse } = UseActiveCourse();

  const [ofertasActuales, setOfertasActuales] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [carrerasFiltradas, setCarrerasFiltradas] = useState([]);
  const [selectedCarrera, setSelectedCarrera] = useState(formData.nomb_carrera ? formData : null);

  useEffect(() => {
    // filtrar las carreras disponibles a insertar
    const listaFiltrada = carreras.filter(
      (carrera) =>
        !Object.values(ofertasActuales).some(
          (ofertaActual) => ofertaActual && ofertaActual.nomb_carrera === carrera.nomb_carrera
        )
    );

    setCarrerasFiltradas(listaFiltrada);
  }, [ofertasActuales]);

  useEffect(() => {
    getCarreras()
      .then((response) => {
        if (response.status === 200) {
          setCarreras(response.data);
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
            const relatedCarrera = carreras.find((carrera) => carrera.cod_carrera === oferta.cod_carrera);
            return {
              ...oferta,
              nomb_carrera: relatedCarrera ? relatedCarrera.nomb_carrera : 'Unknown', // Replace 'Unknown' with a default name
            };
          });
          setOfertasActuales(updatedOfertasList);
        }
      })
      .catch((error) => {
        console.log('Error al cargar ofertas: ', error);
      });
  }, [carreras]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (editMode) {
      const updatedData = {
        cod_oferta: formData.cod_oferta,
        cod_carrera: formData.cod_carrera,
        nomb_carrera: formData.nomb_carrera,
        cod_curso: formData.cod_curso,
        cant_ofertas: Number(numberInput),
        eliminada: formData.eliminada,
      };

      updateOferta(updatedData)
        .then((response) => {
          if (response.status === 200) {
            console.log(response.data);
          }
        })
        .catch((error) => {
          console.log('Error al actualizar la oferta: ', error);
        });
    } else {
      const updatedData = {
        cod_oferta: -1,
        cod_carrera: selectedCarrera.cod_carrera,
        nomb_carrera: selectedCarrera.nomb_carrera,
        cod_curso: activeCourse.cod_curso,
        cant_ofertas: Number(numberInput),
        eliminada: false,
      };

      insertarOferta(updatedData)
        .then((response) => {
          if (response.status === 200) {
            console.log(response.data);
          }
        })
        .catch((error) => {
          console.log('Error al registrar la oferta: ', error);
        });

      // console.log('la oferta a insertar: ', updatedData);
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
        <Grid container spacing={2}>
          <Grid item xs sx={{ minWidth: '400px' }}>
            {/* <Typography variant="body1">Carrera: {nomb_carrera}</Typography> */}
            <Autocomplete
              id="ComboOfertas"
              options={carrerasFiltradas}
              getOptionLabel={(option) => option.nomb_carrera}
              value={selectedCarrera}
              onChange={(event, newValue) => {
                setSelectedCarrera(newValue);
              }}
              readOnly={editMode}
              renderInput={(params) => <TextField {...params} label="Carreras disponibles" />}
            />
          </Grid>

          <Grid item xs />

          <Grid item xs>
            <TextField
              type="number"
              label="Cantidad de plazas"
              variant="outlined"
              value={numberInput}
              onChange={(event) => setNumberInput(event.target.value)}
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
