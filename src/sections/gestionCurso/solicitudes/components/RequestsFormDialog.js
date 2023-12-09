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
import React, { forwardRef, useEffect, useState } from 'react';
import setMessage from '../../../../components/messages/messages';
import {
  getFuentesIngreso,
  getMunicipiosPorProvincia,
  getMunicipioPorID,
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
  const {
    cod_solicitante,
    num_id,
    nomb_solicitante,
    prim_apellido,
    seg_apellido,
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
  } = Data;
  // INICIO LOGICA PARA LOS DATOS PERSONALES
  const [idNumber, setIdNumber] = useState(num_id);
  const [requesterName, setRequesterName] = useState(nomb_solicitante);
  const [firstLastName, setFirstLastName] = useState(prim_apellido);
  const [secondLastName, setSecondLastName] = useState(seg_apellido);
  const [phoneNumber, setPhoneNumber] = useState(num_telefono);
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [municipalities, setMunicipalities] = useState([]);
  const [selectedMunicipality, setSelectedMunicipality] = useState(null);
  const [incomeSources, setIncomeSources] = useState([]);
  const [selectedIncomeSource, setSelectedIncomeSource] = useState(null);

  const { activeCourse, refreshProcessingStatus, setRefreshProcessingStatus } = UseActiveCourse();

  const [errors, setErrors] = useState({
    idNumber: '',
    requesterName: '',
    firstLastName: '',
    secondLastName: '',
    phoneNumber: '',
    selectedProvince: '',
    selectedMunicipality: '',
    selectedIncomeSource: '',
    selectedOption: '',
  });

  useEffect(() => {
    getProvincias()
      .then((response) => {
        if (response.status === 200) {
          console.log('Provincias: ', response.data);
          setProvinces(response.data);
        }
      })
      .catch((error) => {
        console.log('Error al cargar las provinces', error);
      });
  }, []);

  useEffect(() => {
    if (selectedMunicipality) {
      const prov = provinces.find((p) => p.cod_provincia === selectedMunicipality.cod_provincia);
      setSelectedProvince(prov);
    }
  }, [provinces]);

  useEffect(() => {
    if (cod_municipio) {
      getMunicipioPorID(cod_municipio)
        .then((response) => {
          if (response.data) {
            console.log('Municipio: ', response.data);
            setSelectedMunicipality(response.data);
          }
        })
        .catch((error) => {
          console.log('Error al cargar el municipio', error);
        });
    }
  }, []);

  useEffect(() => {
    if (selectedProvince !== null) {
      getMunicipiosPorProvincia(selectedProvince.cod_provincia)
        .then((response) => {
          if (response.status === 200) {
            console.log('Municipios: ', response.data);
            setMunicipalities(response.data);
          }
        })
        .catch((error) => {
          console.log('Error al cargar los municipalities', error);
        });
    }
  }, [selectedProvince]);

  useEffect(() => {
    getFuentesIngreso()
      .then((response) => {
        if (response.data) {
          console.log('Fuentes de Ingreso: ', response.data);
          setIncomeSources(response.data);
        }
      })
      .catch((error) => {
        console.log('Error al cargar las fuentes de ingreso', error);
      });
  }, []);

  useEffect(() => {
    if (fuente_ingreso) {
      const incomeSource = incomeSources.find((f) => f.cod_fuente === fuente_ingreso);
      setSelectedIncomeSource(incomeSource);
    }
  }, [incomeSources]);

  const validateForm = () => {
    const newErrors = {};

    if (!idNumber) {
      newErrors.idNumber = 'Carnet de identidad es requerido';
    }

    if (!requesterName) {
      newErrors.requesterName = 'Nombre(s) son requeridos';
    }

    if (!firstLastName) {
      newErrors.firstLastName = 'Primer apellido requerido';
    }

    if (!secondLastName) {
      newErrors.secondLastName = 'Segundo apellido requerido';
    }

    if (!phoneNumber) {
      newErrors.phoneNumber = 'Teléfono es requerido';
    }

    if (!selectedProvince) {
      newErrors.selectedProvince = 'Provincia es requerida';
    }

    if (!selectedMunicipality) {
      newErrors.selectedMunicipality = 'Municipio es requerido';
    }

    if (!selectedIncomeSource) {
      newErrors.selectedIncomeSource = 'Fuente de Ingreso es requerida';
    }

    console.log('opciones', selectedOptions);
    if (!selectedOptions?.opcion1) {
      newErrors.selectedOption = 'Debe seleccionar al menos una carrera';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const validateData = () => {
    const newErrors = {};

    const currentYear = new Date().getFullYear();
    const centuryDigit = Number(idNumber.charAt(6));
    const birthYear = Number(idNumber.substring(0, 2)) + (centuryDigit === 9 ? 1800 : centuryDigit < 5 ? 1900 : 2000);
    const age = currentYear - birthYear;
    console.log('currentYear', currentYear, 'century', centuryDigit, 'birth', birthYear, 'age', age);

    if (!/^\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{5}$/.test(idNumber)) {
      newErrors.idNumber = 'Carnet de identidad inválido.';
    } else if (age < 18) {
      newErrors.idNumber = 'La edad mínima es 18 años.';
    } else if (age > 60) {
      newErrors.idNumber = 'La edad máxima es 60 años.';
    }

    if (
      !/^([\wáéíóúüÁÉÍÓÚÜñÑ]+\s)?([\wáéíóúüÁÉÍÓÚÜñÑ]+\s)?([\wáéíóúüÁÉÍÓÚÜñÑ]+\s)?[\wáéíóúüÁÉÍÓÚÜñÑ]+$/.test(
        requesterName
      )
    ) {
      console.log('nombre', requesterName);
      newErrors.requesterName = 'Formato de nombres inválidos.';
    }

    if (
      !/^([\wáéíóúüÁÉÍÓÚÜñÑ]+\s)?([\wáéíóúüÁÉÍÓÚÜñÑ]+\s)?([\wáéíóúüÁÉÍÓÚÜñÑ]+\s)?[\wáéíóúüÁÉÍÓÚÜñÑ]+$/.test(
        firstLastName
      )
    ) {
      console.log('firstLastName', firstLastName);
      newErrors.firstLastName = 'Formato de 1er apellido inválido.';
    }

    if (
      !/^([\wáéíóúüÁÉÍÓÚÜñÑ]+\s)?([\wáéíóúüÁÉÍÓÚÜñÑ]+\s)?([\wáéíóúüÁÉÍÓÚÜñÑ]+\s)?[\wáéíóúüÁÉÍÓÚÜñÑ]+$/.test(
        secondLastName
      )
    ) {
      console.log('secondLastName', secondLastName);
      newErrors.secondLastName = 'Formato de 2do apellido inválido.';
    }

    if (!/^(\+53\s?)?[4-9]\d{7}$/.test(phoneNumber)) {
      newErrors.phoneNumber = 'El teléfono debe ser un número válido.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleEnviarClick = (event) => {
    event.preventDefault();

    const isFormFilled = validateForm();

    if (isFormFilled) {
      const isDataValid = validateData();

      if (isDataValid) {
        const solicitante = {
          cod_solicitante: Data.cod_solicitante,
          num_id: idNumber,
          nomb_solicitante: requesterName,
          prim_apellido: firstLastName,
          seg_apellido: secondLastName,
          cod_municipio: Number(selectedMunicipality.cod_municipio),
          fuente_ingreso: Number(selectedIncomeSource.cod_fuente),
          num_telefono: phoneNumber,
          confirmado: true,
          eliminado: false,
        };

        console.log('solicitante', solicitante);

        if (editMode) {
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
              } else if (response.request.status === 500) {
                console.log('el error', response.request.response);
                setMessage(
                  'error',
                  `EL carnet de identidad: "${solicitante.num_id}" ya tiene solicitudes registradas en este curso.`
                );
              }
            })
            .catch((error) => {
              console.log('Error al actualizar el solicitante.', error);
              setMessage('error', '¡Ha ocurrido un error!');
            });
        } else {
          sendSolicitantePersonalData(solicitante)
            .then((response) => {
              if (response.status === 200) {
                console.log(response.data);
                getSolicitanteById(solicitante.num_id)
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
                  `EL carnet de identidad: "${solicitante.num_id}" ya tiene solicitudes registradas en este curso.`
                );
              }
            })
            .catch((error) => {
              console.log('Error al insertar solicitante.', error);
              setMessage('error', '¡Ha ocurrido un error!');
            });
        }

        console.log('los datos', solicitante);
      }
    }
  };

  const handleLastNamesInput = (event) => {
    // allow only letters
    const inputValue = event.target.value.replace(/[^a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s]+/g, ' ').replace(/^\s+/g, '');
    event.target.value = inputValue;
  };

  const handleNameInput = (event) => {
    // allow only one blank space and letters
    const inputValue = event.target.value.replace(/[^a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s]+/g, ' ').replace(/^\s+/g, '');
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

  const handleOptionChange = (event, newValue, id) => {
    setSelectedOptions((prevState) => {
      if (['opcion1', 'opcion2', 'opcion3', 'opcion4', 'opcion5'].includes(id) && newValue === null) {
        // If id is one of 'opcion2', 'opcion3', 'opcion4', or 'opcion5' and newValue is null
        // Remove the corresponding entry from the selectedOptions list
        const updatedOptions = {};

        // Iterate through the options and include only those with IDs less than or equal to the current one
        ['opcion1', 'opcion2', 'opcion3', 'opcion4', 'opcion5'].forEach((optionId) => {
          if (optionId.localeCompare(id) < 0) {
            updatedOptions[optionId] = prevState[optionId];
          }
        });

        return updatedOptions;
      }

      // Update the value as before for other cases
      return {
        ...prevState,
        [id]: newValue,
      };
    });
  };

  useEffect(() => {
    if (ofertas) {
      const listaFiltrada = ofertas.filter(
        (carrera) =>
          !Object.values(selectedOptions).some(
            (selectedOption) => selectedOption && selectedOption.cod_carrera === carrera.cod_carrera
          )
      );
      console.log('listaFiltrada', listaFiltrada);
      setOfertasFiltradas(listaFiltrada);
    }
  }, [selectedOptions]);

  useEffect(() => {
    if (ofertas) {
      const updatedSelectedOptions = {};

      ['opcion1', 'opcion2', 'opcion3', 'opcion4', 'opcion5'].forEach((optionId) => {
        const selectedOption = ofertas.find((oferta) => oferta.nomb_carrera === Data[optionId]);
        if (selectedOption) {
          updatedSelectedOptions[optionId] = selectedOption;
        }
      });

      setSelectedOptions(updatedSelectedOptions);
    }
  }, [ofertas]);

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
                name="idNumber"
                type={'text'}
                value={idNumber}
                label="Carnet de identidad"
                onChange={(event) => {
                  setErrors((prevState) => {
                    return {
                      ...prevState,
                      idNumber: '',
                    };
                  });
                  setIdNumber(event.target.value);
                }}
                onInput={handleIdInput}
                error={!!errors.idNumber}
                helperText={errors.idNumber}
                inputProps={{ maxLength: 11 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="requesterName"
                type={'text'}
                value={requesterName}
                label="Nombre(s)"
                onChange={(event) => {
                  setErrors((prevState) => {
                    return {
                      ...prevState,
                      requesterName: '',
                    };
                  });
                  setRequesterName(event.target.value);
                }}
                onInput={handleNameInput}
                error={!!errors.requesterName}
                helperText={errors.requesterName}
                inputProps={{ maxLength: 40 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="prim_apellido"
                type={'text'}
                value={firstLastName}
                label="1er apellido"
                onChange={(event) => {
                  setErrors((prevState) => {
                    return {
                      ...prevState,
                      firstLastName: '',
                    };
                  });
                  setFirstLastName(event.target.value);
                }}
                onInput={handleLastNamesInput}
                error={!!errors.firstLastName}
                helperText={errors.firstLastName}
                inputProps={{ maxLength: 25 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                name="secondLastName"
                label="2do apellido"
                value={secondLastName}
                onChange={(event) => {
                  setErrors((prevState) => {
                    return {
                      ...prevState,
                      secondLastName: '',
                    };
                  });
                  setSecondLastName(event.target.value);
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
                name="PhoneNumberInput"
                type="tel"
                value={phoneNumber}
                label="Teléfono"
                onChange={(event) => {
                  setErrors((prevState) => {
                    return {
                      ...prevState,
                      phoneNumber: '',
                    };
                  });
                  setPhoneNumber(event.target.value);
                }}
                onInput={handlePhoneInput}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber}
                inputProps={{ maxLength: 11 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={1}>
              <Autocomplete
                id="ProvincesCombo"
                options={provinces}
                getOptionLabel={(option) => option.nomb_provincia}
                value={selectedProvince}
                onChange={(event, newValue) => {
                  setErrors((prevState) => {
                    return {
                      ...prevState,
                      selectedProvince: '',
                    };
                  });
                  setSelectedProvince(newValue);
                  setSelectedMunicipality(null);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Provincias disponibles"
                    error={!!errors.selectedProvince}
                    helperText={errors.selectedProvince}
                    required
                    sx={{ maxWidth: '80%' }}
                  />
                )}
                noOptionsText={'No hay opciones'}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={1}>
              <Autocomplete
                id="MunicipalitiesCombo"
                options={municipalities}
                getOptionLabel={(option) => option.nomb_municipio}
                value={selectedMunicipality}
                onChange={(event, newValue) => {
                  setErrors((prevState) => {
                    return {
                      ...prevState,
                      selectedMunicipality: '',
                    };
                  });
                  setSelectedMunicipality(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Municipios disponibles"
                    error={!!errors.selectedMunicipality}
                    helperText={errors.selectedMunicipality}
                    required
                    sx={{ maxWidth: '80%' }}
                  />
                )}
                noOptionsText={'Seleccione una provincia'}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={1}>
              <Autocomplete
                id="IncomeSourcesCombo"
                options={incomeSources}
                getOptionLabel={(option) => option.nomb_fuente}
                value={selectedIncomeSource}
                onChange={(event, newValue) => {
                  setErrors((prevState) => {
                    return {
                      ...prevState,
                      selectedIncomeSource: '',
                    };
                  });
                  setSelectedIncomeSource(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Fuentes de ingreso disponibles"
                    error={!!errors.selectedIncomeSource}
                    helperText={errors.selectedIncomeSource}
                    required
                    sx={{ maxWidth: '80%' }}
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
                  value={selectedOptions?.opcion1 ? selectedOptions.opcion1 : null}
                  getOptionLabel={(option) => option.nomb_carrera}
                  onChange={(event, newValue) => {
                    setErrors((prevState) => {
                      return {
                        ...prevState,
                        selectedOption: '',
                      };
                    });
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
                  value={selectedOptions?.opcion2 ? selectedOptions?.opcion2 : null}
                  getOptionLabel={(option) => option.nomb_carrera}
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
                  options={ofertasFiltradas}
                  value={
                    selectedOptions?.opcion3 && selectedOptions?.opcion2 && selectedOptions?.opcion1
                      ? selectedOptions?.opcion3
                      : null
                  }
                  getOptionLabel={(option) => option.nomb_carrera}
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
                  options={ofertasFiltradas}
                  value={
                    selectedOptions?.opcion4 &&
                    selectedOptions?.opcion3 &&
                    selectedOptions?.opcion2 &&
                    selectedOptions?.opcion1
                      ? selectedOptions?.opcion4
                      : null
                  }
                  getOptionLabel={(option) => option.nomb_carrera}
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
                  options={ofertasFiltradas}
                  value={
                    selectedOptions?.opcion5 &&
                    selectedOptions?.opcion4 &&
                    selectedOptions?.opcion3 &&
                    selectedOptions?.opcion2 &&
                    selectedOptions?.opcion1
                      ? selectedOptions?.opcion5
                      : null
                  }
                  getOptionLabel={(option) => option.nomb_carrera}
                  onChange={(event, newValue) => {
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
              <LoadingButton fullWidth size="large" variant="contained" onClick={handleEnviarClick}>
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
