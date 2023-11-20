import { Box, Checkbox, Grid, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

export default function RolePermissionsTable({ rol }) {
  const [gestUsuarios, setGestUsuarios] = useState(false);
  const [gestCurso, setGestCurso] = useState(false);
  const [gestSolicitudes, setGestSolicitudes] = useState(false);
  const [gestCodificadores, setGestCodificadores] = useState(false);
  const [asignarPlazas, setAsignarPlazas] = useState(false);
  const [verReportes, setVerReportes] = useState(false);

  useEffect(() => {
    switch (rol) {
      case 'Administrador':
        setGestUsuarios(true);
        setGestCurso(false);
        setGestSolicitudes(false);
        setGestCodificadores(false);
        setAsignarPlazas(false);
        setVerReportes(false);
        break;
      case 'Secretario General':
        setGestUsuarios(false);
        setGestCurso(true);
        setGestSolicitudes(true);
        setGestCodificadores(false);
        setAsignarPlazas(true);
        setVerReportes(true);
        break;
      case 'Técnico':
        setGestUsuarios(false);
        setGestCurso(false);
        setGestSolicitudes(true);
        setGestCodificadores(true);
        setAsignarPlazas(false);
        setVerReportes(true);
        break;
      case 'Matriculador':
        setGestUsuarios(false);
        setGestCurso(false);
        setGestSolicitudes(true);
        setGestCodificadores(false);
        setAsignarPlazas(false);
        setVerReportes(false);
        break;
      default:
        setGestUsuarios(false);
        setGestCurso(false);
        setGestSolicitudes(false);
        setGestCodificadores(false);
        setAsignarPlazas(false);
        setVerReportes(false);
        break;
    }
  }, [rol]);

  return (
    <>
      <Box sx={{ width: '220px', border: '1px solid grey', borderRadius: 1 }}>
        <Typography variant="subtitle1" textAlign={'center'}>
          Permisos
        </Typography>

        <Grid container>
          <Stack direction={'row'} alignItems="center">
            <Checkbox checked={gestUsuarios} readOnly disableTouchRipple disableFocusRipple />
            <Typography variant="body1" sx={{ fontWeight: 'none' }}>
              Gestión de usuarios
            </Typography>
          </Stack>
          <Stack direction={'row'} alignItems="center">
            <Checkbox checked={gestSolicitudes} readOnly disableTouchRipple disableFocusRipple />
            <Typography variant="body1">Gestión de solicitudes</Typography>
          </Stack>
          <Stack direction={'row'} alignItems="center">
            <Checkbox checked={gestCodificadores} readOnly disableTouchRipple disableFocusRipple />
            <Typography variant="body1">Gestión de codificadores</Typography>
          </Stack>
          <Stack direction={'row'} alignItems="center">
            <Checkbox checked={gestCurso} readOnly disableTouchRipple disableFocusRipple />
            <Typography variant="body1">Gestión de curso</Typography>
          </Stack>
          <Stack direction={'row'} alignItems="center">
            <Checkbox checked={asignarPlazas} readOnly disableTouchRipple disableFocusRipple />
            <Typography variant="body1">Asignación de plazas</Typography>
          </Stack>
          <Stack direction={'row'} alignItems="center">
            <Checkbox checked={verReportes} readOnly disableTouchRipple disableFocusRipple />
            <Typography variant="body1">Ver reportes</Typography>
          </Stack>
        </Grid>
      </Box>
    </>
  );
}
