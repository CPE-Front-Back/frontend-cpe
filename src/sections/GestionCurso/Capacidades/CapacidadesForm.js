import { Autocomplete, Grid, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

const CapacidadesForm = (
  defaultData = {
    id: '',
    id_faculty: '',
    id_building: '',
    id_classroom: '',
    capacity: '',
    id_priority: '',
  }
) => {
  const [data, setData] = useState(null);
  const [faculties, setFaculties] = useState([]);
  const [edificio, setEdificio] = useState([]);
  const [aula, setAula] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [prioridad, setPrioridad] = useState([]);

  const [autoFacultiesKey, setAutoFacultiesKey] = useState(0);

  useEffect(() => {
    getFaculty().then();
    /* getBuilding().then();
      getClassromm().then();
      getPriority().then(); */

    setData({
      id: defaultData['id'],
      id_faculty: defaultData['id_faculty'],
      id_building: defaultData[' id_building'],
      id_classroom: defaultData['id_classroom'],
      capacity: defaultData['capacity'],
      id_priority: defaultData['id_priority'],
    });
  }, [defaultData]);

  const facultyProps = {
    options: faculties,
    getOptionLabel: (option) => option.faculty,
  };

  const getFacul = () => {
    for (let faculty of faculties) {
      if (faculty.id === defaultData['id_faculty']) {
        return { id: faculty.id, faculty: faculty.name };
      }
    }

    return { id: '', faculty: '' };
  };
  ////getFaculty y facultyProps para cada combo

  const handleAutoChange = (key) => (_event, value) => {
    setData({ ...data, [key]: value.id });
  };

  const getForm = () => {
    return (
      <form style={{ margin: 'auto', width: '90%', padding: '30px' }}>
        <Grid container spacing={5}>
          <Grid item lg={4} md={6} sm={12} xs={12}>
            <Autocomplete
              {...facultyProps}
              key={autoFacultiesKey}
              defaultValue={getFacul()}
              disablePortal
              onChange={handleAutoChange('id_faculty')}
              renderInput={(params) => (
                <TextField fullWidth required {...params} label="Facultdad" style={{ backgroundColor: 'white' }} />
              )}
            />
          </Grid>
          <Grid item lg={4} md={6} sm={12} xs={12}>
            <Autocomplete
              {...facultyProps}
              key={autoFacultiesKey}
              defaultValue={getFacul()}
              disablePortal
              onChange={handleAutoChange('id_building')}
              renderInput={(params) => (
                <TextField fullWidth required {...params} label="Edificio" style={{ backgroundColor: 'white' }} />
              )}
            />
          </Grid>
          <Grid item lg={4} md={6} sm={12} xs={12}>
            <Autocomplete
              {...provinciasProps}
              key={autoProvinciasKey}
              defaultValue={getProv()}
              disablePortal
              disabled={isView}
              onChange={handleAutoChange('id_provincia')}
              renderInput={(params) => (
                <TextField fullWidth required {...params} label="Aula" style={{ backgroundColor: 'white' }} />
              )}
            />
          </Grid>
          <Grid item lg={2} md={6} sm={12} xs={12}>
            <TextField
              fullWidth
              disabled={isView}
              required
              type="number"
              inputProps={{ min: 1, max: 4 }}
              value={data?.anno_escolar}
              label="Capacidad"
              variant="outlined"
              style={{ backgroundColor: 'white' }}
              onChange={handleChange('anno_escolar')}
            />
          </Grid>
          <Grid item lg={4} md={6} sm={12} xs={12}>
            <Autocomplete
              {...provinciasProps}
              key={autoProvinciasKey}
              defaultValue={getProv()}
              disablePortal
              disabled={isView}
              onChange={handleAutoChange('id_provincia')}
              renderInput={(params) => (
                <TextField fullWidth required {...params} label="Prioridad" style={{ backgroundColor: 'white' }} />
              )}
            />
          </Grid>
          <Grid item lg={0} md={0} sm={12} xs={12}>
            <div style={{ padding: '20px' }}></div>
          </Grid>
          <Grid item lg={0} md={0} sm={12} xs={12}>
            <div style={{ padding: '20px' }}></div>
          </Grid>
        </Grid>
      </form>
    );
  };

  return { data, getForm };
};
export default CapacidadesForm;
