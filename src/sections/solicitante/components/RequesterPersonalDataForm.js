import { LoadingButton } from '@mui/lab';
import { Alert, Autocomplete, Container, Grid, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useConfirm } from 'material-ui-confirm';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import {
  getFuentesIngreso,
  getMunicipiosPorProvincia,
  getProvincias,
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
    paddingTop: APP_BAR_MOBILE - 60,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

RequesterPersonalDataForm.propTypes = {
  togleFormVisibility: PropTypes.func,
};
export default function RequesterPersonalDataForm({ togleFormVisibility }) {
  const [isCarrersFormVisible, setIsCarrersFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    cod_solicitante: '',
    num_id: '',
    nomb_solicitante: '',
    apell_solicitante: '',
    cod_municipio: '',
    fuente_ingreso: '',
    num_telefono: '',
    confirmado: '',
    eliminado: '',
  });
  const [provincias, setProvincias] = useState([]);
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState(null);
  const [municipios, setMunicipios] = useState([]);
  const [municipioSeleccionado, setMunicipioSeleccionado] = useState(null);
  const [fuentesIngreso, setFuentesIngreso] = useState([]);
  const [fuenteIngresoSeleccionada, setFuenteIngresoSeleccionada] = useState(null);
  // const [num_id, setNum_id] = useState('');
  // const [nomb_solicitante, setNomb_solicitante] = useState('');
  const [firstLastName, setFirstLastName] = useState('');
  const [secondLastName, setSecondLastName] = useState('');

  const confirm = useConfirm();

  const [errors, setErrors] = useState({
    num_id: '',
    nomb_solicitante: '',
    apell_solicitante: '',
    secondLastName: '',
    num_telefono: '',
    provinciaSeleccionada: '',
    municipioSeleccionado: '',
    fuenteIngresoSeleccionada: '',
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

  const handleAvanzarClick = async () => {
    const isValid = validateForm();

    if (isValid) {
      if (formData.num_id.length !== 11) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          num_id: 'El carnet de identidad debe tener 11 dígitos.',
        }));
      } else if (!/^[0-9]*$/.test(formData.num_id)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          num_id: 'El carnet de identidad debe contener solo números.',
        }));
      } else if (!/^(\w+\s)?(\w+\s)?(\w+\s)?\w+$/.test(formData.nomb_solicitante)) {
        console.log('nombre', formData.nomb_solicitante);
        setErrors((prevErrors) => ({
          ...prevErrors,
          nomb_solicitante: 'Formato de nombres inválidos.',
        }));
      } else if (!/^(\+53\s?)?[5-9]\d{7}$/.test(formData.num_telefono)) {
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
    });
  };

  // esta es la funcion que abre el formulario de las carreras
  useEffect(() => {
    if (secondLastName !== '' && formData.apell_solicitante.includes(secondLastName)) {
      console.log('datos del formulario', formData);
      setIsCarrersFormVisible(!isCarrersFormVisible);
    }
  }, [formData]);

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
    const inputValue = event.target.value.replace(/[^a-z][\s]/g, '');
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
      <StyledRoot>
        <Main>
          <Container sx={{ backgroundColor: 'white' }}>
            {!isCarrersFormVisible ? (
              <>
                <Typography variant="h4" sx={{ textAlign: 'center' }}>
                  Introduzca sus datos personales
                </Typography>
                <Grid container spacing={3} sx={{ pb: '25px', mt: '10px' }}>
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
                      type="text"
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

                <Grid container spacing={3} columns={{ xs: 12, sm: 12, md: 4 }}>
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

                <LoadingButton
                  fullWidth
                  size="large"
                  variant="contained"
                  onClick={handleAvanzarClick}
                  sx={{ mt: '30px', mb: '30px' }}
                >
                  Avanzar
                </LoadingButton>
              </>
            ) : (
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
                      setFormData({
                        ...formData,
                        apell_solicitante: ``,
                      });
                    })
                    .catch(() => {});
                }}
                onEnviar={() => togleFormVisibility()}
              />
            )}
          </Container>
        </Main>
      </StyledRoot>
    </>
  );
}
