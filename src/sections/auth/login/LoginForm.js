import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import {Link, Stack, IconButton, InputAdornment, TextField, Checkbox, FormControlLabel} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const [destino, setDestino] = useState("/dashboard")
  const [showPassword, setShowPassword] = useState(false);

  const handleClick = () => {
    navigate(destino , { replace: true });
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField name="username" label="Nombre de usuario" />

        <TextField
          name="password"
          label="Contraseña"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <FormControlLabel control={<Checkbox name="remember" />} label="Remember Me" />
        <Link variant="subtitle2" underline="hover">
          Olvidaste tú contraseña?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
        Login
      </LoadingButton>
    </>
  );
}
