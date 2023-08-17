import { Autocomplete, Grid, TextField, Typography } from '@mui/material';
import PropTypes from 'prop-types';

SolicitudesForm.propTypes = {
  editMode: PropTypes.bool,
  formData: PropTypes.object,
  onSubmit: PropTypes.func,
};

export default function SolicitudesForm({ editMode, formData, onSubmit }) {
  const { codSol, idSol, nombSol, primerApellSol, segundoApellSol, opcion1, opcion2, opcion3, opcion4, opcion5 } =
    formData;
  return (
    <>
      LA VENTANA DE SOLICITUDES PARA {editMode ? 'EDITAR' : 'AÑADIR'} UNA SOLICITUD
      <Typography variant="h2">{nombSol}</Typography>
      {/* <form style={{ margin: 'auto', width: '90%', padding: '30px' }}>
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
      </form> */}
    </>
  );
}
