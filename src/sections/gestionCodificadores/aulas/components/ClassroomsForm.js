import { Alert, Autocomplete, Box, Button, Grid, TextField, Typography } from '@mui/material';
import { useConfirm } from 'material-ui-confirm';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import setMessage from '../../../../components/messages/messages';
import { getBuildingsByFaclulty } from '../../edificios/store/store';
import { getFaculties } from '../../facultades/store/store';
import { insertClassroom, updateClassroom } from '../store/store';

ClassroomsForm.propTypes = {
  editMode: PropTypes.bool,
  formData: PropTypes.object,
  onSubmit: PropTypes.func,
};
export default function ClassroomsForm({ editMode, formData, onSubmit }) {
  const { cod_aula, nomb_aula, cod_edif, nomb_edif, nomb_facultad, eliminada } = formData;
  const [classroomNameInput, setClassroomNameInput] = useState(nomb_aula);
  const [selectedFaculty, setSelectedFaculty] = useState(formData.nomb_facultad ? formData : null);
  const [selectedBuilding, setSelectedBuilding] = useState(formData.nomb_edif ? formData : null);

  const [faculties, setFaculties] = useState([]);
  const [buildings, setBuildings] = useState([]);

  const confirm = useConfirm();

  const [errors, setErrors] = useState({
    facluty: '',
    building: '',
    classroomName: '',
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

  useEffect(() => {
    if (formData.nomb_facultad) {
      const faculty = faculties.find((faculty) => faculty.nomb_facultad === formData.nomb_facultad);
      setSelectedFaculty(faculty);
    }
  }, [faculties]);

  useEffect(() => {
    if (selectedFaculty) {
      getBuildingsByFaclulty(selectedFaculty.cod_facultad)
        .then((response) => {
          if (response.status === 200) {
            setBuildings(response.data);
          }
        })
        .catch((error) => {
          console.log('Error al cargar los edificios por facultad', error);
        });
    }
  }, [selectedFaculty]);

  const validateData = () => {
    const newErrors = {};

    if (!selectedFaculty) {
      newErrors.faculty = 'Facultad requerida';
    }
    if (!selectedBuilding) {
      newErrors.building = 'Edificio requerido';
    }
    if (!classroomNameInput) {
      newErrors.classroomName = 'Nombre requerido';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validateData()) {
      const updatedData = {
        cod_aula: formData.cod_aula,
        nomb_aula: classroomNameInput,
        cod_edif: selectedBuilding.cod_edif,
        eliminada: false,
      };

      if (editMode) {
        updateClassroom(updatedData)
          .then((response) => {
            if (response.status === 200) {
              console.log(response.data);
              setMessage('success', '¡Aula actualizada con éxito!');

              setTimeout(() => {
                onSubmit();
              }, 500);
            } else if (response.request.status === 500) {
              console.log('el error', response.request.response);
              setMessage('error', `Ya se encuentra registrada el aula ${classroomNameInput}.`);
            }
          })
          .catch((error) => {
            console.log('Error al actualizar el aula: ', error);
            setMessage('error', '¡Ha ocurrido un error!');
          });
      } else {
        insertClassroom(updatedData)
          .then((response) => {
            if (response.status === 200) {
              console.log(response.data);
              setMessage('success', '¡Aula registrada con éxito!');

              setTimeout(() => {
                onSubmit();
              }, 500);
            } else if (response.request.status === 500) {
              console.log('el error', response.request.response);
              setMessage('error', `Ya se encuentra registrada el aula ${classroomNameInput}.`);
            }
          })
          .catch((error) => {
            console.log('Error al registrar el aula: ', error);
            setMessage('error', '¡Ha ocurrido un error!');
          });
      }
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

  const handleClassroomNameInput = (event) => {
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
          {editMode ? 'Editar Aula' : 'Registrar Aula'}
        </Typography>

        <Grid container spacing={2} sx={{ pt: 5 }}>
          <Grid item xs sx={{ minWidth: '200px' }}>
            <Autocomplete
              id="FacultyCombo"
              options={faculties}
              getOptionLabel={(option) => option.nomb_facultad}
              value={selectedFaculty}
              onChange={(event, newValue) => {
                setSelectedFaculty(newValue);
                setSelectedBuilding(null);
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
              noOptionsText={'No hay opciones'}
              readOnly={editMode}
            />
          </Grid>
          <Grid item xs sx={{ minWidth: '200px' }}>
            <Autocomplete
              id="BuildingCombo"
              options={buildings}
              getOptionLabel={(option) => option.nomb_edif}
              value={selectedBuilding}
              onChange={(event, newValue) => {
                setSelectedBuilding(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Edificios disponibles"
                  error={!!errors.building}
                  helperText={errors.building}
                  required
                />
              )}
              noOptionsText={'Seleccione una facultad'}
              readOnly={editMode}
            />
          </Grid>
          <Grid item xs>
            <TextField
              type={'text'}
              label="Nombre Aula"
              variant="outlined"
              value={classroomNameInput}
              onInput={handleClassroomNameInput}
              onChange={(event) => setClassroomNameInput(event.target.value)}
              required
              inputProps={{ maxLength: 10 }}
              error={!!errors.classroomName}
              helperText={errors.classroomName}
            />
          </Grid>
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
