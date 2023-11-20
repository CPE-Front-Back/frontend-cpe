import { LoadingButton } from '@mui/lab';
import { Autocomplete, Grid, Stack, TextField, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import setMessage from '../../../components/messages/messages';
import useResponsive from '../../../hooks/useResponsive';

import { getCarreras } from '../../gestionCodificadores/carreras/store/store';
import { UseActiveCourse } from '../../gestionCurso/curso/context/ActiveCourseContext';
import { getAllOfertasByCurso } from '../../gestionCurso/ofertas/store/store';
import { getSolicitanteById, insertarSolicitudes, sendSolicitantePersonalData } from '../store/store';

RequesterCarrerOptionsForm.propTypes = {
  personalData: PropTypes.object,
  onVolver: PropTypes.func,
  onEnviar: PropTypes.func,
};
export default function RequesterCarrerOptionsForm({ personalData, options, onVolver, onEnviar }) {
  const [ofertas, setOfertas] = useState([]);
  const [ofertasFiltradas, setOfertasFiltradas] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState(null);
  const [carreras, setCarreras] = useState([]);

  const { activeCourse } = UseActiveCourse();

  const isPhoneSize = useResponsive('down', 'sm');
  const mtSize = isPhoneSize ? '-10px' : '-140px';

  const [errors, setErrors] = useState({
    selectedOption: '',
  });

  const validateForm = () => {
    const newErrors = {};

    if (!selectedOptions) {
      newErrors.selectedOption = 'Debe seleccionar al menos una carrera';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    getAllOfertasByCurso(activeCourse.cod_curso)
      .then((response) => {
        console.log(response.data);
        if (response.status === 200) {
          const updatedOfertasList = response.data.map((oferta) => {
            const relatedCarrera = carreras.find((carrera) => carrera.cod_carrera === oferta.cod_carrera);
            return {
              ...oferta,
              nomb_carrera: relatedCarrera ? relatedCarrera.nomb_carrera : 'Unknown', // Replace 'Unknown' with a default name
            };
          });
          setOfertas(updatedOfertasList);
          setOfertasFiltradas(updatedOfertasList);
        }
      })
      .catch((error) => {
        console.log('Error al cargar ofertas: ', error);
      });
  }, [carreras]);

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

  const handleVolverClick = () => {
    onVolver();
  };

  const handleSubmitClick = () => {
    const isValid = validateForm();

    if (isValid) {
      console.log('Datos del solicitante', personalData);
      console.log('Solicitudes', selectedOptions);

      sendSolicitantePersonalData(personalData)
        .then((response) => {
          if (response.status === 200) {
            console.log(response.data);
            getSolicitanteById(personalData.num_id)
              .then((response) => {
                if (response.status === 200) {
                  insertarSolicitudes(selectedOptions, response.data.cod_solicitante)
                    .then((response) => {
                      if (response) {
                        console.log('Insertadas: ', response);
                        setMessage('success', '¡Su solicitud ha sido creada con éxito!');

                        onEnviar();
                      }
                    })
                    .catch((error) => {
                      console.log('Error al insertar las solicitudes', error);
                    });
                }
              })
              .catch((error) => {
                console.log('Error al obtener el solicitante insertado', error);
              });
          }
        })
        .catch((error) => {
          console.log('Error al insertar solicitante.', error);
          setMessage('error', '¡Ha ocurrido un error!');
        });
    }
  };

  const handleOptionChange = (event, newValue, id) => {
    setSelectedOptions((prevState) => ({
      ...prevState,
      [id]: newValue,
    }));
  };

  useEffect(() => {
    const listaFiltrada = ofertas.filter(
      (carrera) =>
        !Object.values(selectedOptions).some(
          (selectedOption) => selectedOption && selectedOption.cod_carrera === carrera.cod_carrera
        )
    );
    setOfertasFiltradas(listaFiltrada);
  }, [selectedOptions]);

  const opcion1Props = {
    options: ofertasFiltradas,
    getOptionLabel: (option) => option.nomb_carrera,
  };
  const opcion2Props = {
    options: ofertasFiltradas,
    getOptionLabel: (option) => option.nomb_carrera,
  };
  const opcion3Props = {
    options: ofertasFiltradas,
    getOptionLabel: (option) => option.nomb_carrera,
  };
  const opcion4Props = {
    options: ofertasFiltradas,
    getOptionLabel: (option) => option.nomb_carrera,
  };
  const opcion5Props = {
    options: ofertasFiltradas,
    getOptionLabel: (option) => option.nomb_carrera,
  };

  useEffect(() => {
    console.log('selectedOptions', selectedOptions);
  }, [selectedOptions]);

  return (
    <Grid container sx={{ mt: mtSize, pt: '30px' }}>
      <Grid item xs />
      <Grid item xs={6}>
        <Typography variant="h4" sx={{ textAlign: 'center' }}>
          Listado de solicitudes
        </Typography>
      </Grid>
      <Grid item xs />

      <Stack container sx={{ mt: 5, width: '100%' }} spacing={2}>
        <Grid item textAlign={'center'}>
          <Autocomplete
            id="opcion1"
            {...opcion1Props}
            onChange={(event, newValue) => {
              handleOptionChange(event, newValue, 'opcion1');
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Carrera en 1ra opción"
                error={!!errors.selectedOption}
                helperText={errors.selectedOption}
              />
            )}
            noOptionsText={'No hay opciones'}
          />
        </Grid>
        <Grid item xs>
          <Autocomplete
            id="opcion2"
            {...opcion2Props}
            onChange={(event, newValue) => {
              handleOptionChange(event, newValue, 'opcion2');
            }}
            disabled={!selectedOptions?.opcion1}
            renderInput={(params) => <TextField {...params} label="Carrera en 2da opción" />}
            noOptionsText={'No hay opciones'}
          />
        </Grid>
        <Grid item xs>
          <Autocomplete
            id="opcion3"
            {...opcion3Props}
            onChange={(event, newValue) => {
              handleOptionChange(event, newValue, 'opcion3');
            }}
            disabled={!selectedOptions?.opcion2}
            renderInput={(params) => <TextField {...params} label="Carrera en 3ra opción" />}
            noOptionsText={'No hay opciones'}
          />
        </Grid>
        <Grid item xs>
          <Autocomplete
            id="opcion4"
            {...opcion4Props}
            onChange={(event, newValue) => {
              handleOptionChange(event, newValue, 'opcion4');
            }}
            disabled={!selectedOptions?.opcion3}
            renderInput={(params) => <TextField {...params} label="Carrera en 4ta opción" />}
            noOptionsText={'No hay opciones'}
          />
        </Grid>
        <Grid item xs>
          <Autocomplete
            id="opcion5"
            {...opcion5Props}
            onChange={(event, newValue) => {
              handleOptionChange(event, newValue, 'opcion5');
            }}
            disabled={!selectedOptions?.opcion4}
            renderInput={(params) => <TextField {...params} label="Carrera en 5ta opción" />}
            noOptionsText={'No hay opciones'}
          />
        </Grid>
      </Stack>

      <Grid container columnSpacing={4} sx={{ mt: 5 }}>
        <Grid item xs>
          <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleVolverClick}>
            Volver
          </LoadingButton>
        </Grid>
        <Grid item xs>
          <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleSubmitClick}>
            Enviar Solicitud
          </LoadingButton>
        </Grid>
      </Grid>
    </Grid>
  );
}
