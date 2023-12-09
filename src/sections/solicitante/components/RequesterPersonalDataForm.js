import { LoadingButton } from '@mui/lab';
import { Alert, Autocomplete, Container, Grid, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useConfirm } from 'material-ui-confirm';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  getFuentesIngresoRequester,
  getMunicipiosPorProvinciaRequester,
  getProvinciasRequester,
} from '../../../utils/codificadores/codificadoresStore';
import RequesterCarrerOptionsForm from './RequesterCarrerOptionsForm';

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    minHeight: '100%',
    overflow: 'hidden',
  },
}));

const APP_BAR_MOBILE = 82;
const APP_BAR_DESKTOP = 92;

const Main = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 100,
  paddingBottom: theme.spacing(0),
  [theme.breakpoints.up('md')]: {
    paddingTop: APP_BAR_DESKTOP + 100,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  [theme.breakpoints.down('sm')]: {
    paddingTop: APP_BAR_MOBILE + 40,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

RequesterPersonalDataForm.propTypes = {
  togleFormVisibility: PropTypes.func,
};
export default function RequesterPersonalDataForm() {
  const [isCarrersFormVisible, setIsCarrersFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    cod_solicitante: 0,
    num_id: '',
    nomb_solicitante: '',
    prim_apellido: '',
    seg_apellido: '',
    cod_municipio: 0,
    fuente_ingreso: 0,
    num_telefono: '',
    confirmado: false,
    eliminado: false,
  });
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [municipalities, setMunicipalities] = useState([]);
  const [selectedMunicipality, setSelectedMunicipality] = useState(null);
  const [incomeSources, setIncomeSources] = useState([]);
  const [selectedIncomeSource, setSelectedIncomeSource] = useState(null);
  const [requesterName, setRequesterName] = useState(null);
  const [idNumber, setIdNumber] = useState(null);
  const [firstLastName, setFirstLastName] = useState(null);
  const [secondLastName, setSecondLastName] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  const confirm = useConfirm();
  const navigate = useNavigate();
  const location = useLocation();

  const [errors, setErrors] = useState({
    idNumber: '',
    requesterName: '',
    firstLastName: '',
    secondLastName: '',
    phoneNumber: '',
    selectedProvince: '',
    selectedMunicipality: '',
    selectedIncomeSource: '',
  });

  useEffect(() => {
    getProvinciasRequester()
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
    if (selectedProvince !== null) {
      getMunicipiosPorProvinciaRequester(selectedProvince.cod_provincia)
        .then((response) => {
          if (response.status === 200) {
            console.log('Municipios: ', response.data);
            setMunicipalities(response.data);
          }
        })
        .catch((error) => {
          console.log('Error al cargar los municipios', error);
        });
    }
  }, [selectedProvince]);

  useEffect(() => {
    getFuentesIngresoRequester()
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

  const handleAvanzarClick = (event) => {
    event.preventDefault();

    const isFormFilled = validateForm();

    if (isFormFilled) {
      const isDataValid = validateData();

      if (isDataValid) {
        const updateData = {
          cod_solicitante: 0,
          num_id: idNumber,
          nomb_solicitante: requesterName,
          prim_apellido: firstLastName,
          seg_apellido: secondLastName,
          cod_municipio: Number(selectedMunicipality.cod_municipio),
          fuente_ingreso: Number(selectedIncomeSource.cod_fuente),
          num_telefono: phoneNumber,
          confirmado: false,
          eliminado: false,
        };

        setFormData(updateData);

        setIsCarrersFormVisible(true);
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

  return (
    <>
      {!isCarrersFormVisible ? (
        <StyledRoot>
          <Main>
            <Container sx={{ backgroundColor: 'white', mb: '20px' }}>
              <Grid container spacing={2}>
                <Grid item container sx={{ mb: '30px' }}>
                  <Grid item xs>
                    <Typography variant="h4" sx={{ textAlign: 'center' }}>
                      Introduzca sus datos personales
                    </Typography>
                  </Grid>
                </Grid>

                <Grid item container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      name="idNumber"
                      fullWidth
                      type="text"
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

                  <Grid item xs={12} sm={3}>
                    <TextField
                      name="requesterName"
                      fullWidth
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
                      sx={{ textAlign: 'center' }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <TextField
                      name="prim_apellido"
                      fullWidth
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
                      sx={{ margin: 'auto' }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <TextField
                      name="secondLastName"
                      fullWidth
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
                      sx={{ margin: 'auto' }}
                    />
                  </Grid>
                </Grid>

                <Grid item container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      name="PhoneNumberInput"
                      fullWidth
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
                      sx={{ margin: 'auto' }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
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
                        />
                      )}
                      noOptionsText={'No hay opciones'}
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
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
                        />
                      )}
                      noOptionsText={'Seleccione una provincia'}
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
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
                        />
                      )}
                      noOptionsText={'No hay opciones'}
                    />
                  </Grid>
                </Grid>

                <Grid item container rowSpacing={2} columnSpacing={2}>
                  <Grid item xs={12} sm={6} sx={{ mt: '10px' }}>
                    <LoadingButton
                      fullWidth
                      size="large"
                      variant="contained"
                      onClick={() => {
                        confirm({
                          content: (
                            <Alert severity={'warning'}>¡Perderá los cambios no guardados! ¿Desea continuar?</Alert>
                          ),
                        })
                          .then(() => {
                            navigate('/requester', { state: { from: location }, replace: true });
                          })
                          .catch(() => {});
                      }}
                    >
                      Cancelar
                    </LoadingButton>
                  </Grid>

                  <Grid item xs={12} sm={6} sx={{ mb: '10px', mt: '10px' }}>
                    <LoadingButton fullWidth size="large" variant="contained" onClick={handleAvanzarClick}>
                      Avanzar
                    </LoadingButton>
                  </Grid>
                </Grid>
              </Grid>
            </Container>
          </Main>
        </StyledRoot>
      ) : (
        <StyledRoot>
          <Main>
            <RequesterCarrerOptionsForm
              personalData={formData}
              onVolver={() => {
                confirm({
                  content: (
                    <Alert severity={'warning'}>
                      ¡Perderá los cambios no guardados! ¿Desea volver a sus datos personales?
                    </Alert>
                  ),
                })
                  .then(() => {
                    setIsCarrersFormVisible(!isCarrersFormVisible);
                  })
                  .catch(() => {});
              }}
            />
          </Main>
        </StyledRoot>
      )}
    </>
  );
}
