import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';
import setMessage from '../../../components/messages/messages';
import { UseActiveCourse } from '../../gestionCurso/curso/context/ActiveCourseContext';
import { UseAuthContext } from '../context/AuthProvider';
import { getUserData, login } from '../store/store';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const { setAuth } = UseAuthContext();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState({
    username: '',
    password: '',
  });

  const navigate = useNavigate();
  const destino = '/dashboard';
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    const loginData = { username, password };

    login(loginData)
      .then((response) => {
        if (response.status === 200) {
          const userAuth = response.data;

          setAuth({ ...userAuth });

          setMessage('success', `¡Bienvenido ${userAuth.name}!`);

          navigate(destino, { replace: true });
        } else if (response.request.status === 401) {
          const newErrors = {};

          newErrors.username = 'error';
          newErrors.password = 'error';
          setErrors(newErrors);

          setMessage('error', `¡Credenciales Incorrectas!`);
        }
      })
      .catch((error) => {
        console.log('Error al realizar el login', error);
        setMessage('error', `¡Ha ocurrido un error!`);
      });
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField
          name="username"
          label="Nombre de usuario"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          error={!!errors.username}
          required
        />

        <TextField
          name="password"
          label="Contraseña"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          error={!!errors.password}
          required
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Link variant="subtitle2" underline="hover">
          Olvidaste tú contraseña?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        onClick={handleLogin}
        sx={{ textTransform: 'none' }}
      >
        Iniciar sesión
      </LoadingButton>
    </>
  );
}
