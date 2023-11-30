import { LoadingButton } from '@mui/lab';
import {
  AppBar,
  Autocomplete,
  Dialog,
  Grid,
  IconButton,
  Slide,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import { forwardRef, useEffect, useState } from 'react';
import setMessage from '../../../../components/messages/messages';
import {
  getFuentesIngreso,
  getMunicipiosPorProvincia,
  getMunicipiosPorID,
  getProvincias,
} from '../../../../utils/codificadores/codificadoresStore';
import { getCarreras } from '../../../gestionCodificadores/carreras/store/store';
import {
  getSolicitanteById,
  insertarSolicitudes,
  sendSolicitantePersonalData,
  updateSolicitantePersonalData,
} from '../../../solicitante/store/store';
import { UseActiveCourse } from '../../curso/context/ActiveCourseContext';
import { getAllOfertasByCurso } from '../../ofertas/store/store';
import { eliminarSolicitudesBySolicitante } from '../store/store';

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

RequestsFormDialog.propTypes = {
  open: PropTypes.bool,
  handleCloseClick: PropTypes.func,
  handleCloseAfterAction: PropTypes.func,
  editMode: PropTypes.bool,
  formData: PropTypes.object,
};
export default function RequestsFormDialog({ open, handleCloseClick, handleCLoseAfterAction, editMode, Data }) {
  /* {
    cod_solicitante,
    num_id,
    nomb_solicitante,
    apell_solicitante,
    cod_municipio,
    fuente_ingreso,
    num_telefono,
    confirmado,
    eliminado,
    opcion1,
    opcion2,
    opcion3,
    opcion4,
    opcion5,
  } = Data */
  // INICIO LOGICA PARA LOS DATOS PERSONALES
  const [formData, setFormData] = useState(Data);
  const [provincias, setProvincias] = useState([]);
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState(null);
  const [municipios, setMunicipios] = useState([]);
  const [municipioSeleccionado, setMunicipioSeleccionado] = useState(null);
  const [fuentesIngreso, setFuentesIngreso] = useState([]);
  const [fuenteIngresoSeleccionada, setFuenteIngresoSeleccionada] = useState(null);
  const [firstLN, secondLN] = Data.apell_solicitante ? Data.apell_solicitante.split(' ') : [null, null];
  const [firstLastName, setFirstLastName] = useState(firstLN);
  const [secondLastName, setSecondLastName] = useState(secondLN);
  const [userClickedActionButton, setUserClickedActionButton] = useState(false);

  const { activeCourse, refreshProcessingStatus, setRefreshProcessingStatus } = UseActiveCourse();

  const [errors, setErrors] = useState({
    num_id: '',
    nomb_solicitante: '',
    apell_solicitante: '',
    secondLastName: '',
    num_telefono: '',
    provinciaSeleccionada: '',
    municipioSeleccionado: '',
    fuenteIngresoSeleccionada: '',
    selectedOption: '',
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.num_id) {
      newErrors.num_id = 'Carnet de identidad es requerido';
    }

    if (!formData.nomb_solicitante) {
      newErrors.nomb_solicitante = 'Nombre(s) son requeridos';
    }

    if (!firstLastName) {
      newErrors.apell_solicitante = 'Primer apellido requerido';
    }

    if (!secondLastName) {
      newErrors.secondLastName = 'Segundo apellido requerido';
    }

    if (!formData.num_telefono) {
      newErrors.num_telefono = 'Teléfono es requerido';
    }

    if (!provinciaSeleccionada) {
      newErrors.provinciaSeleccionada = 'Provincia es requerida';
    }

    if (!municipioSeleccionado) {
      newErrors.municipioSeleccionado = 'Municipio es requerido';
    }

    if (!fuenteIngresoSeleccionada) {
      newErrors.fuenteIngresoSeleccionada = 'Fuente de Ingreso es requerida';
    }

    if (!selectedOptions.opcion1) {
      newErrors.selectedOption = 'Debe seleccionar al menos una carrera';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleNameInputChange = (event) => {
    const { name } = event.target;
    const names = event.target.value;
    setFormData((prevData) => ({
      ...prevData,
      [name]: names,
    }));
  };

  const handleInputsChange = (event) => {
    const { name } = event.target;
    const value = event.target.value.trim();
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEnviarClick = async () => {
    const isValid = validateForm();

    if (isValid) {
      const currentYear = new Date().getFullYear();
      const centuryDigit = Number(formData.num_id.charAt(6));
      const birthYear =
        Number(formData.num_id.substring(0, 2)) + (centuryDigit === 9 ? 1800 : centuryDigit < 5 ? 1900 : 2000);
      const age = currentYear - birthYear;
      console.log('currentYear', currentYear, 'century', centuryDigit, 'birth', birthYear, 'age', age);

      if (!/^\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{5}$/.test(formData.num_id)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          num_id: 'Carnet de Identidad inválido.',
        }));
      } else if (age < 18) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          num_id: 'La edad mínima es 18 años.',
        }));
      } else if (!/^(\w+\s)?(\w+\s)?(\w+\s)?\w+$/.test(formData.nomb_solicitante)) {
        console.log('nombre', formData.nomb_solicitante);
        setErrors((prevErrors) => ({
          ...prevErrors,
          nomb_solicitante: 'Formato de nombres inválidos.',
        }));
      } else if (!/^(\+53\s?)?[4-9]\d{7}$/.test(formData.num_telefono)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          num_telefono: 'El teléfono debe ser un número válido.',
        }));
      } else {
        await concatLastNames();
      }
    }
  };

  const concatLastNames = () => {
    setFormData({
      ...formData,
      apell_solicitante: `${firstLastName} ${secondLastName}`,
      confirmado: true,
    });
  };

  useEffect(() => {
    if (formData.apell_solicitante && userClickedActionButton) {
      if (secondLastName !== '' && formData.apell_solicitante.includes(secondLastName) && formData.confirmado) {
        console.log(formData);
        if (editMode) {
          const {
            apell_solicitante,
            cod_municipio,
            cod_solicitante,
            confirmado,
            eliminado,
            fuente_ingreso,
            nomb_solicitante,
            num_id,
            num_telefono,
          } = formData;

          const solicitante = {
            apell_solicitante,
            cod_municipio,
            cod_solicitante,
            confirmado,
            eliminado,
            fuente_ingreso,
            nomb_solicitante,
            num_id,
            num_telefono,
          };

          updateSolicitantePersonalData(solicitante)
            .then((response) => {
              if (response.status === 200) {
                getSolicitanteById(solicitante.num_id)
                  .then((response) => {
                    if (response.status === 200) {
                      const cod_Sol = response.data.cod_solicitante;
                      eliminarSolicitudesBySolicitante(cod_Sol)
                        .then((response) => {
                          if (response.status === 200) {
                            console.log(response.data);
                            console.log(cod_Sol);
                            insertarSolicitudes(selectedOptions, cod_Sol)
                              .then((response) => {
                                if (response) {
                                  console.log('Insertadas: ', response);
                                  setMessage('success', '¡Solicitante actualizado con éxito!');

                                  setTimeout(() => {
                                    setRefreshProcessingStatus(refreshProcessingStatus + 1);
                                    handleCLoseAfterAction();
                                  }, 500);
                                }
                              })
                              .catch((error) => {
                                console.log('Error al insertar las solicitudes', error);
                              });
                          }
                        })
                        .catch((error) => {
                          console.log('Error al eliminar las solicitudes del solicitante.', error);
                        });
                    }
                  })
                  .catch((error) => {
                    console.log('Error al obtener el solicitante actualizado.', error);
                  });
              }
            })
            .catch((error) => {
              console.log('Error al actualizar el solicitante.', error);
              setMessage('error', '¡Ha ocurrido un error!');
            });
        } else {
          console.log(selectedOptions);
          sendSolicitantePersonalData(formData)
            .then((response) => {
              if (response.status === 200) {
                console.log(response.data);
                getSolicitanteById(formData.num_id)
                  .then((response) => {
                    if (response.status === 200) {
                      insertarSolicitudes(selectedOptions, response.data.cod_solicitante)
                        .then((response) => {
                          if (response) {
                            console.log('Insertadas: ', response);
                            setMessage('success', '¡Solicitante confirmado con éxito!');

                            setRefreshProcessingStatus(refreshProcessingStatus + 1);
                            handleCLoseAfterAction();
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
                  `EL carnet de identidad: "${formData.num_id}" ya tiene solicitudes registradas en este curso.`
                );
              }
            })
            .catch((error) => {
              console.log('Error al insertar solicitante.', error);
              setMessage('error', '¡Ha ocurrido un error!');
            });
        }
      }
    }
  }, [formData, userClickedActionButton]);

  useEffect(() => {
    if (municipioSeleccionado) {
      const prov = provincias.find((p) => p.cod_provincia === municipioSeleccionado.cod_provincia);
      setProvinciaSeleccionada(prov);
    }
  }, [provincias]);

  useEffect(() => {
    if (Data.cod_municipio) {
      getMunicipiosPorID(Data.cod_municipio)
        .then((response) => {
          if (response.data) {
            console.log('Municipio: ', response.data);
            setMunicipioSeleccionado(response.data);
          }
        })
        .catch((error) => {
          console.log('Error al cargar el municipio', error);
        });
    }
  }, []);

  useEffect(() => {
    if (Data.fuente_ingreso) {
      const fuenteIngreso = fuentesIngreso.find((f) => f.cod_fuente === Data.fuente_ingreso);
      setFuenteIngresoSeleccionada(fuenteIngreso);
    }
  }, [fuentesIngreso]);

  useEffect(() => {
    getProvincias()
      .then((response) => {
        if (response.status === 200) {
          console.log('Provincias: ', response.data);
          setProvincias(response.data);
        }
      })
      .catch((error) => {
        console.log('Error al cargar las provincias', error);
      });
  }, []);

  useEffect(() => {
    if (provinciaSeleccionada !== null) {
      getMunicipiosPorProvincia(provinciaSeleccionada.cod_provincia)
        .then((response) => {
          if (response.status === 200) {
            console.log('Municipios: ', response.data);
            setMunicipios(response.data);
          }
        })
        .catch((error) => {
          console.log('Error al cargar los municipios', error);
        });
    }
  }, [provinciaSeleccionada]);

  useEffect(() => {
    getFuentesIngreso()
      .then((response) => {
        if (response.data) {
          console.log('Fuentes de Ingreso: ', response.data);
          setFuentesIngreso(response.data);
        }
      })
      .catch((error) => {
        console.log('Error al cargar las fuentes de ingreso', error);
      });
  }, []);

  const ProvinceProps = {
    options: provincias,
    getOptionLabel: (option) => option.nomb_provincia,
  };

  const MunicipioProps = {
    options: municipios,
    getOptionLabel: (option) => option.nomb_municipio,
  };

  const FuenteIngresoProps = {
    options: fuentesIngreso,
    getOptionLabel: (option) => option.nomb_fuente,
  };

  const handleLastNamesInput = (event) => {
    // allow only letters
    const inputValue = event.target.value.replace(/[^a-zA-Z]/g, '');
    event.target.value = inputValue;
  };

  const handleNameInput = (event) => {
    // allow only one blank space and letters
    const inputValue = event.target.value.replace(/[^a-zA-Z\s]/g, '');
    event.target.value = inputValue;
  };

  const handlePhoneInput = (event) => {
    // Allow only numbers and the plus (+) symbol
    const inputValue = event.target.value.replace(/[^0-9+]/g, '');
    event.target.value = inputValue;
  };

  const handleIdInput = (event) => {
    // Allow only numbers
    const inputValue = event.target.value.replace(/[^0-9]/g, '');
    event.target.value = inputValue;
  };

  // FINAL DE LA LOGICA PARA LOS DATOS DE LOS SOLICITANTES

  // INICIO DE LA LOGICA PARA LAS ******CARRERAS******

  const [ofertas, setOfertas] = useState([]);
  const [ofertasFiltradas, setOfertasFiltradas] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState(null);
  const [carreras, setCarreras] = useState([]);

  const [opcion1, setOpcion1] = useState(null);
  const [opcion2, setOpcion2] = useState(null);
  const [opcion3, setOpcion3] = useState(null);
  const [opcion4, setOpcion4] = useState(null);
  const [opcion5, setOpcion5] = useState(null);

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

  const handleOptionChange = (event, newValue, id) => {
    setSelectedOptions((prevState) => ({
      ...prevState,
      [id]: newValue,
    }));
  };

  useEffect(() => {
    if (ofertas) {
      const listaFiltrada = ofertas.filter(
        (carrera) =>
          !Object.values(selectedOptions).some(
            (selectedOption) => selectedOption && selectedOption.cod_carrera === carrera.cod_carrera
          )
      );
      setOfertasFiltradas(listaFiltrada);
    }
  }, [selectedOptions]);

  useEffect(() => {
    if (ofertas) {
      const op1 = ofertas.find((oferta) => oferta.nomb_carrera === Data.opcion1);
      const op2 = ofertas.find((oferta) => oferta.nomb_carrera === Data.opcion2);
      const op3 = ofertas.find((oferta) => oferta.nomb_carrera === Data.opcion3);
      const op4 = ofertas.find((oferta) => oferta.nomb_carrera === Data.opcion4);
      const op5 = ofertas.find((oferta) => oferta.nomb_carrera === Data.opcion5);

      setOpcion1(op1 ?? null);
      setOpcion2(op2 ?? null);
      setOpcion3(op3 ?? null);
      setOpcion4(op4 ?? null);
      setOpcion5(op5 ?? null);
    }
  }, [ofertas]);

  useEffect(() => {
    if (ofertas) {
      const findOfertaByName = (name) => ofertas.find((oferta) => oferta.nomb_carrera === name);

      const updatedSelectedOptions = {
        opcion1: findOfertaByName(Data.opcion1),
        opcion2: findOfertaByName(Data.opcion2),
        opcion3: findOfertaByName(Data.opcion3),
        opcion4: findOfertaByName(Data.opcion4),
        opcion5: findOfertaByName(Data.opcion5),
      };

      setSelectedOptions(updatedSelectedOptions);
    }
  }, [ofertas, Data]);

  // FINAL DE LA LOGICA PARA LAS ******CARRERAS******

  return (
    <>
      <Dialog fullScreen open={open} onClose={handleCloseClick} TransitionComponent={Transition}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {editMode ? 'Confirmar Solicitante' : 'Registrar Solicitante'}
            </Typography>

            <IconButton edge="end" color="inherit" onClick={handleCloseClick} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Grid container sx={{ height: '100%', width: '90%', margin: 'auto' }}>
          <Grid item container spacyng={3} sx={{ pb: '50px', pt: '23px' }}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="num_id"
                type="text"
                value={formData.num_id}
                label="Carnet de identidad"
                onChange={handleInputsChange}
                onInput={handleIdInput}
                error={!!errors.num_id}
                helperText={errors.num_id}
                inputProps={{ maxLength: 11 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="nomb_solicitante"
                type={'text'}
                value={formData.nomb_solicitante}
                label="Nombres"
                onChange={handleNameInputChange}
                onInput={handleNameInput}
                error={!!errors.nomb_solicitante}
                helperText={errors.nomb_solicitante}
                inputProps={{ maxLength: 40 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="apell_solicitante"
                type={'text'}
                value={firstLastName}
                label="1er apellido"
                onChange={(event) => {
                  setFirstLastName(event.target.value.trim());
                }}
                onInput={handleLastNamesInput}
                error={!!errors.apell_solicitante}
                helperText={errors.apell_solicitante}
                inputProps={{ maxLength: 25 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="secondLastName"
                label="2do apellido"
                value={secondLastName}
                onChange={(event) => {
                  setSecondLastName(event.target.value.trim());
                }}
                onInput={handleLastNamesInput}
                error={!!errors.secondLastName}
                helperText={errors.secondLastName}
                inputProps={{ maxLength: 25 }}
              />
            </Grid>
          </Grid>

          <Grid item container spacyng={1} columns={{ xs: 12, sm: 12, md: 4 }}>
            <Grid item xs={12} sm={6} md={1}>
              <TextField
                name="num_telefono"
                type="tel"
                value={formData.num_telefono}
                label="Teléfono"
                onChange={handleInputsChange}
                onInput={handlePhoneInput}
                error={!!errors.num_telefono}
                helperText={errors.num_telefono}
                inputProps={{ maxLength: 11 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={1}>
              <Autocomplete
                id="ComboProvincia"
                {...ProvinceProps}
                value={provinciaSeleccionada}
                onChange={(event, newValue) => {
                  setProvinciaSeleccionada(newValue);
                  setMunicipioSeleccionado(null);
                }}
                sx={{ maxWidth: '240px' }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Provincia"
                    error={!!errors.provinciaSeleccionada}
                    helperText={errors.provinciaSeleccionada}
                  />
                )}
                noOptionsText={'No hay opciones'}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={1}>
              <Autocomplete
                id="ComboMunicipio"
                {...MunicipioProps}
                value={municipioSeleccionado}
                onChange={(event, newValue) => {
                  setMunicipioSeleccionado(newValue);
                  setFormData((prevData) => ({
                    ...prevData,
                    cod_municipio: newValue ? newValue.cod_municipio : null,
                  }));
                }}
                sx={{ maxWidth: '240px' }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Municipio"
                    error={!!errors.municipioSeleccionado}
                    helperText={errors.municipioSeleccionado}
                  />
                )}
                noOptionsText={'Seleccione una provincia'}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={1}>
              <Autocomplete
                id="ComboFuentesIngreso"
                {...FuenteIngresoProps}
                value={fuenteIngresoSeleccionada}
                onChange={(event, newValue) => {
                  setFuenteIngresoSeleccionada(newValue);
                  setFormData((prevData) => ({
                    ...prevData,
                    fuente_ingreso: newValue ? newValue.cod_fuente : null,
                  }));
                }}
                sx={{ maxWidth: '240px' }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Fuente de Ingreso"
                    error={!!errors.fuenteIngresoSeleccionada}
                    helperText={errors.fuenteIngresoSeleccionada}
                  />
                )}
                noOptionsText={'No hay opciones'}
              />
            </Grid>
          </Grid>

          <Grid item container>
            <Stack container sx={{ mt: 5, width: '50%', margin: 'auto' }} spacing={2}>
              <Grid item textAlign={'center'}>
                <Autocomplete
                  id="opcion1"
                  options={ofertasFiltradas}
                  value={opcion1}
                  getOptionLabel={(option) => option.nomb_carrera}
                  onChange={(event, newValue) => {
                    setOpcion1(newValue);
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
                  options={ofertasFiltradas}
                  value={opcion2}
                  getOptionLabel={(option) => option.nomb_carrera}
                  onChange={(event, newValue) => {
                    setOpcion2(newValue);
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
                  options={ofertasFiltradas}
                  getOptionLabel={(option) => option.nomb_carrera}
                  value={opcion3}
                  onChange={(event, newValue) => {
                    setOpcion3(newValue);
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
                  options={ofertasFiltradas}
                  value={opcion4}
                  getOptionLabel={(option) => option.nomb_carrera}
                  onChange={(event, newValue) => {
                    setOpcion4(newValue);
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
                  options={ofertasFiltradas}
                  value={opcion5}
                  getOptionLabel={(option) => option.nomb_carrera}
                  onChange={(event, newValue) => {
                    setOpcion5(newValue);
                    handleOptionChange(event, newValue, 'opcion5');
                  }}
                  disabled={!selectedOptions?.opcion4}
                  renderInput={(params) => <TextField {...params} label="Carrera en 5ta opción" />}
                  noOptionsText={'No hay opciones'}
                />
              </Grid>
            </Stack>
          </Grid>

          <Grid item container spacing={2}>
            <Grid item xs />
            <Grid item xs>
              <LoadingButton fullWidth size="large" variant="contained" onClick={handleCloseClick}>
                Cancelar
              </LoadingButton>
            </Grid>
            <Grid item xs>
              <LoadingButton
                fullWidth
                size="large"
                variant="contained"
                onClick={() => {
                  setUserClickedActionButton(true);
                  handleEnviarClick().then(() => {});
                }}
              >
                {editMode ? 'Confirmar' : 'Registrar'}
              </LoadingButton>
            </Grid>
            <Grid item xs />
          </Grid>
        </Grid>
      </Dialog>
    </>
  );
}
