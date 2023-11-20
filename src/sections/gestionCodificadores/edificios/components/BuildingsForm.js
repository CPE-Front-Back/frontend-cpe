import { Alert, Autocomplete, Box, Button, Grid, TextField, Typography } from '@mui/material';
import { useConfirm } from 'material-ui-confirm';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import setMessage from '../../../../components/messages/messages';
import { getFaculties } from '../../facultades/store/store';
import { insertBuilding, updateBuilding } from '../store/store';

BuildingsForm.propTypes = {
  editMode: PropTypes.bool,
  formData: PropTypes.object,
  onSubmit: PropTypes.func,
};
export default function BuildingsForm({ editMode, formData, onSubmit }) {
  const { cod_edif, nomb_edif, nomb_facultad, eliminado } = formData;
  const [buildingNameInput, setBuildingNameInput] = useState(nomb_edif);
  const [selectedFaculty, setSelectedFaculty] = useState(formData.nomb_facultad ? formData : null);

  const [faculties, setFaculties] = useState([]);
  const confirm = useConfirm();

  const [errors, setErrors] = useState({
    facluty: '',
    buildingName: '',
  });

  useEffect(() => {
    getFaculties()
      .then((response) => {
        if (response.status === 200) {
          setFaculties(response.data);
        }
      })
      .catch((error) => {
        console.log('Error al cargar las facultades', error);
      });
  }, []);

  const validateData = () => {
    const newErrors = {};

    if (!selectedFaculty) {
      newErrors.faculty = 'Facultad requerida';
    }
    if (!buildingNameInput) {
      newErrors.buildingName = 'Nombre requerido';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateData()) {
      const updatedData = {
        cod_edif: formData.cod_edif,
        nomb_edif: buildingNameInput,
        nomb_facultad: selectedFaculty.nomb_facultad,
      };

      if (editMode) {
        updateBuilding(updatedData)
          .then((response) => {
            if (response.status === 200) {
              console.log(response.data);
              setMessage('success', '¡Edificio actualizado con éxito!');
            }
          })
          .catch((error) => {
            console.log('Error al actualizar la oferta: ', error);
            setMessage('error', '¡Ha ocurrido un error!');
          });
      } else {
        insertBuilding(updatedData)
          .then((response) => {
            if (response.status === 200) {
              console.log(response.data);
              setMessage('success', '¡Edificio registrado con éxito!');
            }
          })
          .catch((error) => {
            console.log('Error al insertar la oferta: ', error);
            setMessage('error', '¡Ha ocurrido un error!');
          });
      }

      setTimeout(() => {
        onSubmit();
      }, 500);
    }
  };

  const handleCancel = () => {
    confirm({
      content: <Alert severity={'warning'}>¡Perderá los cambios no guardados! ¿Desea continuar?</Alert>,
    })
      .then(() => {
        onSubmit();
      })
      .catch(() => {});
  };

  const handleNameInput = (event) => {
    // allow only letters
    const inputValue = event.target.value.replace(/[^a-zA-Z]/g, '');
    event.target.value = inputValue;
  };

  return (
    <>
      <Box
        flexGrow={{ flexGrow: 1 }}
        sx={{ backgroundColor: 'white', marginTop: '80px', pr: '100px', pl: '100px', pb: '20px', pt: '20px' }}
      >
        <Typography variant="h4" gutterBottom>
          {editMode ? 'Editar Edificio' : 'Registrar Edificio'}
        </Typography>

        <Grid container spacing={2} sx={{ pt: 5 }}>
          <Grid item xs sx={{ minWidth: '400px' }}>
            <Autocomplete
              id="FacultyCombo"
              options={faculties}
              getOptionLabel={(option) => option.nomb_facultad}
              value={selectedFaculty}
              onChange={(event, newValue) => {
                setSelectedFaculty(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Facultades disponibles"
                  error={!!errors.faculty}
                  helperText={errors.faculty}
                  required
                />
              )}
            />
          </Grid>

          <Grid item xs />

          <Grid item xs={5}>
            <TextField
              type={'text'}
              label="Nombre edificio"
              variant="outlined"
              value={buildingNameInput}
              onInput={handleNameInput}
              onChange={(event) => setBuildingNameInput(event.target.value)}
              error={!!errors.buildingName}
              helperText={errors.buildingName}
              inputProps={{ maxLength: 30 }}
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
          <Grid item xs={2}>
            <Button type="submit" variant="contained" color="primary" onClick={handleCancel}>
              Cancelar
            </Button>
          </Grid>
          <Grid item xs />
        </Grid>
      </Box>
    </>
  );
}
