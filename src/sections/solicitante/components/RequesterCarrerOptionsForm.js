import { LoadingButton } from '@mui/lab';
import { Autocomplete, Grid, Stack, TextField, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import setMessage from '../../../components/messages/messages';
import useResponsive from '../../../hooks/useResponsive';

import { getCarrerasRequester } from '../../gestionCodificadores/carreras/store/store';
import { UseActiveCourse } from '../../gestionCurso/curso/context/ActiveCourseContext';
import { getAllOfertasByCursoRequester } from '../../gestionCurso/ofertas/store/store';
import {
  getSolicitanteByIdRequester,
  insertarSolicitudesRequester,
  sendSolicitantePersonalDataRequester,
} from '../store/store';

RequesterCarrerOptionsForm.propTypes = {
  personalData: PropTypes.object,
  onVolver: PropTypes.func,
  onEnviar: PropTypes.func,
};
export default function RequesterCarrerOptionsForm({ personalData, options, onVolver }) {
  const [ofertas, setOfertas] = useState([]);
  const [ofertasFiltradas, setOfertasFiltradas] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState(null);
  const [carreras, setCarreras] = useState([]);

  const { activeCourse } = UseActiveCourse();
  const navigate = useNavigate();
  const location = useLocation();

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
    getAllOfertasByCursoRequester(activeCourse.cod_curso)
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
    getCarrerasRequester()
      .then((response) => {
        if (response.status === 200) {
          setCarreras(response.data);
        }
      })
      .catch((error) => {
        console.log('Error al cargar las carreras', error);
      });
  }, []);

  const onEnviar = () => {
    navigate('/requester', { state: { from: location }, replace: true });
  };

  const handleVolverClick = () => {
    onVolver();
  };

  const handleSubmitClick = () => {
    const isValid = validateForm();

    if (isValid) {
      console.log('Datos del solicitante', personalData);
      console.log('Solicitudes', selectedOptions);

      sendSolicitantePersonalDataRequester(personalData)
        .then((response) => {
          if (response.status === 200) {
            console.log(response.data);
            getSolicitanteByIdRequester(personalData.num_id)
              .then((response) => {
                if (response.status === 200) {
                  insertarSolicitudesRequester(selectedOptions, response.data.cod_solicitante)
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
          } else if (response.request.status === 500) {
            console.log('el error', response.request.response);
            setMessage(
              'error',
              `EL carnet de identidad: "${personalData.num_id}" ya tiene solicitudes registradas en este curso.`
            );
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
    <Grid container sx={{ margin: 'auto', mb: '20px', maxWidth: '700px' }}>
      <Grid item xs />
      <Grid item xs={10}>
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

      <Grid container rowSpacing={2} columnSpacing={2} sx={{ mt: '20px' }}>
        <Grid item xs={12} sm={6}>
          <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleVolverClick}>
            Volver
          </LoadingButton>
        </Grid>
        <Grid item xs={12} sm={6}>
          <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleSubmitClick}>
            Enviar Solicitud
          </LoadingButton>
        </Grid>
      </Grid>
    </Grid>
  );
}
