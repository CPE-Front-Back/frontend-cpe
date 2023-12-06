import { Alert, Autocomplete, Box, Button, Grid, TextField, Typography } from '@mui/material';
import { isNaN } from 'lodash';
import { useConfirm } from 'material-ui-confirm';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import setMessage from '../../../../components/messages/messages';
import { getClassroomsByBuilding } from '../../../gestionCodificadores/aulas/store/store';
import { getBuildingsByFaclulty } from '../../../gestionCodificadores/edificios/store/store';
import { getFaculties } from '../../../gestionCodificadores/facultades/store/store';
import { UseActiveCourse } from '../../curso/context/ActiveCourseContext';
import { insertCapacity, updateCapacity } from '../store/store';

CapacitiesForm.propTypes = {
  editMode: PropTypes.bool,
  formData: PropTypes.object,
  onSubmit: PropTypes.func,
};
export default function CapacitiesForm({ editMode, formData, onSubmit }) {
  const { cod_aula, nomb_aula, nomb_edificio, nomb_facultad, capacidad, prioridad, eliminada } = formData;
  const [selectedFaculty, setSelectedFaculty] = useState(formData.nomb_facultad ? formData : null);
  const [selectedBuilding, setSelectedBuilding] = useState(formData.nomb_edificio ? formData : null);
  const [selectedClassroom, setSelectedClassroom] = useState(formData.nomb_aula ? formData : null);
  const [selectedPriority, setSelectedPriority] = useState(formData.prioridad ? formData : null);
  const [capacityInput, setCapacityInput] = useState(capacidad);
  const { activeCourse } = UseActiveCourse();
  const confirm = useConfirm();

  const [faculties, setFaculties] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [classrooms, setClassrooms] = useState([]);

  const [errors, setErrors] = useState({
    facluty: '',
    building: '',
    classroom: '',
    capacity: '',
    priority: '',
  });

  const priorities = [
    { prioridad: '1' },
    { prioridad: '2' },
    { prioridad: '3' },
    { prioridad: '4' },
    { prioridad: '5' },
  ];

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

  useEffect(() => {
    if (formData.nomb_edificio) {
      const building = buildings.find((building) => building.nomb_edif === formData.nomb_edificio);
      setSelectedBuilding(building);
    }
  }, [buildings]);

  useEffect(() => {
    if (selectedBuilding) {
      getClassroomsByBuilding(selectedBuilding.cod_edif)
        .then((response) => {
          if (response.status === 200) {
            setClassrooms(response.data);
          }
        })
        .catch((error) => {
          console.log('Error al cargar las aulas por edificio', error);
        });
    }
  }, [selectedBuilding]);

  const validateData = () => {
    const newErrors = {};

    if (!selectedFaculty) {
      newErrors.faculty = 'Facultad requerida';
    }
    if (!selectedBuilding) {
      newErrors.building = 'Edificio requerido';
    }
    if (!selectedClassroom) {
      newErrors.classroom = 'Aula requerida';
    }
    if (!selectedPriority) {
      newErrors.priority = 'Prioridad requerida';
    }
    if (!capacityInput) {
      newErrors.capacity = 'Capacidad requerida';
    } else if (isNaN(Number(capacityInput)) || capacityInput < 1 || capacityInput > 30) {
      newErrors.capacity = 'La capacidad debe estar entre 1 y 30.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateData()) {
      const updatedData = {
        cod_capacidad: formData.cod_capacidad,
        cod_aula: selectedClassroom.cod_aula,
        cod_curso: editMode ? formData.cod_curso : activeCourse.cod_curso,
        capacidad: Number(capacityInput),
        prioridad: Number(selectedPriority.prioridad),
        eliminada: false,
        nomb_aula: '',
        nomb_edificio: '',
        nomb_facultad: '',
      };

      console.log('el codigo de la cap');
      if (editMode) {
        updateCapacity(updatedData)
          .then((response) => {
            if (response.status === 200) {
              console.log(response.data);
              setMessage('success', '¡Capacidad actualizada con éxito!');

              setTimeout(() => {
                onSubmit();
              }, 500);
            } else if (response.request.status === 500) {
              console.log('el error', response.request.response);
              setMessage(
                'error',
                `Ya se encuentra registrada una capacidad para el aula ${selectedClassroom.nomb_aula}.`
              );
            }
          })
          .catch((error) => {
            console.log('Error al actualizar la capacidad: ', error);
            setMessage('error', '¡Ha ocurrido un error!');
          });
      } else {
        insertCapacity(updatedData)
          .then((response) => {
            if (response.status === 200) {
              console.log(response.data);
              setMessage('success', '¡Capacidad registrada con éxito!');

              setTimeout(() => {
                onSubmit();
              }, 500);
            } else if (response.request.status === 500) {
              console.log('el error', response.request.response);
              setMessage(
                'error',
                `Ya se encuentra registrada una capacidad para el aula ${selectedClassroom.nomb_aula}.`
              );
            }
          })
          .catch((error) => {
            console.log('Error al insertar la capacidad: ', error);
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

  const handleCapacityInput = (event) => {
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
          {editMode ? 'Editar Capacidad' : 'Registrar Capacidad'}
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
              disabled={editMode}
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
          <Grid item xs sx={{ minWidth: '200px' }}>
            <Autocomplete
              id="BuildingCombo"
              options={buildings}
              getOptionLabel={(option) => option.nomb_edif}
              value={selectedBuilding}
              onChange={(event, newValue) => {
                setSelectedBuilding(newValue);
              }}
              disabled={editMode}
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
            />
          </Grid>
          <Grid item xs sx={{ minWidth: '200px' }}>
            <Autocomplete
              id="ClassroomCombo"
              options={classrooms}
              getOptionLabel={(option) => option.nomb_aula}
              value={selectedClassroom}
              onChange={(event, newValue) => {
                setSelectedClassroom(newValue);
              }}
              disabled={editMode}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Aulas disponibles"
                  error={!!errors.classroom}
                  helperText={errors.classroom}
                  required
                />
              )}
              noOptionsText={'Seleccione un edificio'}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ pt: 5 }}>
          <Grid item xs />
          <Grid item xs sx={{ minWidth: '200px' }}>
            <TextField
              type={'text'}
              label="Capacidad aula"
              variant="outlined"
              value={capacityInput}
              onChange={(event) => setCapacityInput(event.target.value)}
              onInput={handleCapacityInput}
              required
              error={!!errors.capacity}
              helperText={errors.capacity}
              inputProps={{ maxLength: 3 }}
            />
          </Grid>
          <Grid item xs sx={{ minWidth: '200px' }}>
            <Autocomplete
              id="PriorityCombo"
              options={priorities}
              getOptionLabel={(option) => option.prioridad}
              value={selectedPriority}
              onChange={(event, newValue) => {
                setSelectedPriority(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Prioridades disponibles"
                  error={!!errors.priority}
                  helperText={errors.priority}
                  required
                />
              )}
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
