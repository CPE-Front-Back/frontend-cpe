import {FormControl} from "@mui/base";
import {LoadingButton} from "@mui/lab";
import { InputLabel, MenuItem, Select, Stack, TextField} from "@mui/material";
import {useNavigate} from "react-router-dom";
import SelectAutoWidth from "../../components/ComboBox/ComboBoxAutoWidth";

export default function SolicitantePersonalDataForm () {
   const navigate = useNavigate();
   const sex = '';
   const handleChange = () => null;
   
   const handleClick = () => {
      navigate('/dashboard', { replace: true });
   };
   
   return (
      <>
         <Stack spacing={3}>
            <TextField name="numID" label="Carnet de identidad" />
            <TextField name="names" type='text' label="Nombres" />
            <TextField name="firtsLastName" label="1er apellido" />
            <TextField name="secondLastName" label="2do apellido" />
            <TextField name="phoneNumber" type= 'tel' label="Teléfono" />
            <SelectAutoWidth />
            <SelectAutoWidth />
            
            <FormControl fullWidth>
               <InputLabel id="sexLabel">Sexo</InputLabel>
               <Select
                  labelId="sexLabel"
                  id="sex"
                  value={sex}
                  label="Sex"
                  onChange={handleChange}
               >
                  <MenuItem value={1}>Masculino</MenuItem>
                  <MenuItem value={2}>Femenino</MenuItem>
               </Select>
            </FormControl>
            <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
               Avanzar
            </LoadingButton>
         </Stack>
         
      </>
   );
}