import {LoadingButton} from "@mui/lab";
import {Stack} from "@mui/material";
import {useNavigate} from "react-router-dom";
import SelectAutoWidth from "../../components/ComboBox/ComboBoxAutoWidth";

export default function SolicitanteCarrerOptionsForm () {
   const navigate = useNavigate();
   const handleClick = () => {
      navigate('/dashboard', { replace: true });
   };
   return(
      <Stack spacing={3}>
         <SelectAutoWidth />
         <SelectAutoWidth />
         <SelectAutoWidth />
         <SelectAutoWidth />
         <SelectAutoWidth />
         <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
            Volver
         </LoadingButton>
         <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
            Enviar Solicitud
         </LoadingButton>
      </Stack>
   );
}