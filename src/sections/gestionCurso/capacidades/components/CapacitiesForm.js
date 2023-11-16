import { Autocomplete, Box, Button, Grid, TextField, Typography } from '@mui/material';
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

  const [faculties, setFaculties] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
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

  const handleSubmit = (event) => {
    event.preventDefault();
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

    if (editMode) {
      updateCapacity(updatedData)
        .then((response) => {
          if (response.status === 200) {
            console.log(response.data);
            setMessage('success', '¡Capacidad actualizada con éxito!');
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
          }
        })
        .catch((error) => {
          console.log('Error al insertar la capacidad: ', error);
          setMessage('error', '¡Ha ocurrido un error!');
        });
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
              renderInput={(params) => <TextField {...params} label="Facultades disponibles" />}
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
              renderInput={(params) => <TextField {...params} label="Edificios disponibles" />}
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
              renderInput={(params) => <TextField {...params} label="Aulas disponibles" />}
              noOptionsText={'Seleccione un edificio'}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ pt: 5 }}>
          <Grid item xs />
          <Grid item xs sx={{ minWidth: '200px' }}>
            <TextField
              type="number"
              label="Capacidad aula"
              variant="outlined"
              value={capacityInput}
              onChange={(event) => setCapacityInput(event.target.value)}
              required
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
              renderInput={(params) => <TextField {...params} label="Prioridades disponibles" />}
            />
          </Grid>
          <Grid item xs />
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
