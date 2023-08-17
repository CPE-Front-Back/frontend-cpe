import { FormControl } from '@mui/base';
import { LoadingButton } from '@mui/lab';
import { Container, Grid, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import SelectAutoWidth from '../../components/ComboBox/ComboBoxAutoWidth';

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));
export default function SolicitantePersonalDataForm() {
  const navigate = useNavigate();
  const sex = '';
  const handleChange = () => null;

  const handleClick = () => {
    navigate('/dashboard', { replace: true });
  };

  return (
    <>
      <StyledRoot>
        <Container>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField name="numID" type={'number'} label="Carnet de identidad" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField name="names" type="text" label="Nombres" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField name="firtsLastName" label="1er apellido" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField name="secondLastName" label="2do apellido" />
            </Grid>
          </Grid>

          <Grid container spacyng={3}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField name="phoneNumber" type="tel" label="Teléfono" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SelectAutoWidth />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SelectAutoWidth />
            </Grid>
          </Grid>

          <FormControl fullWidth>
            <InputLabel id="sexLabel">Sexo</InputLabel>
            <Select labelId="sexLabel" id="sex" value={sex} label="Sex" onChange={handleChange}>
              <MenuItem value={1}>Masculino</MenuItem>
              <MenuItem value={2}>Femenino</MenuItem>
            </Select>
          </FormControl>

          <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
            Avanzar
          </LoadingButton>
        </Container>
      </StyledRoot>
    </>
  );
}
