import {LoadingButton} from "@mui/lab";
import {Container, Grid, Typography} from "@mui/material";
import {styled} from "@mui/material/styles";
import {useEffect, useState} from "react";
import {Helmet} from "react-helmet-async";
import {useNavigate} from "react-router-dom";
import {AppWidgetSummary} from "../sections/@dashboard/app";
import SolicitanteCarrerOptionsForm from "../sections/Solicitante/SolicitanteCarrerOptionsForm";
import SolicitantePersonalDataForm from "../sections/Solicitante/SolicitantePersonalDataForm";

const StyledRoot = styled('div')(({ theme }) => ({
   [theme.breakpoints.up('md')]: {
      display: 'flex',
   },
}));
export default function SolicitantePage() {
   const navigate = useNavigate();
   const [destino, setDestino] = useState(null);
   
   useEffect(() => {
      handleClick();
   }, [destino]);
   
   const handleClick = () => {
      // navigate(destino, { replace: true });
      switch (destino) {
         case 'prematricula' :
            navigate('/solicitante/formulario-solicitud', { replace: true });
            break;
         case 'login':
            navigate('/login', { replace: true });
            break;
         default:
            console.log("first click is on null")
            break;
      }
   };
   
   return (
      <>
         <Helmet>
            <title> Solicitante | CPE </title>
         </Helmet>
         
         <StyledRoot>
            <Container>
               <Typography variant="h4" sx={{ mb: 5 }}>
                  Página de solicitante
               </Typography>
               
               <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={() => {setDestino("prematricula")}}>
                  Prematrícula
               </LoadingButton>
               
               <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={() => {setDestino("login")}}>
                  Iniciar Sesión
               </LoadingButton>
               
               <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                     <AppWidgetSummary title="Reporte 1" total={100} icon={'ant-design:android-filled'} />
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                     <AppWidgetSummary title="Reporte 2" total={100} icon={'ant-design:android-filled'} />
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                     <AppWidgetSummary title="Reporte 3" total={100} icon={'ant-design:android-filled'} />
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                     <AppWidgetSummary title="Reporte 4" total={100} icon={'ant-design:android-filled'} />
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                     <AppWidgetSummary title="Reporte 5" total={100} icon={'ant-design:android-filled'} />
                  </Grid>
               </Grid>
               
               
               
               
            </Container>
         </StyledRoot>
      </>
   );
}