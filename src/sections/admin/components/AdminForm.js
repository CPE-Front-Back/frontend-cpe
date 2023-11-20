import { Autocomplete, Box, Button, Grid, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { isNaN } from 'lodash';
import { useEffect, useState } from 'react';
import Iconify from '../../../components/iconify';
import setMessage from '../../../components/messages/messages';
import {
  getAllRoles,
  getInsertedUserByUserName,
  getUserByUserName,
  getUserRoleByUserAndRol,
  insertUser,
  insertUserRole,
  updateUser,
  updateUserRol,
} from '../store/store';
import RolePermissionsTable from './RolePermissionsTable';

const rolePermissions = {
  Administrador: {
    gestUsuarios: true,
    gestSolicitudes: false,
    gestCodificadores: false,
    gestCursos: false,
    procesamiento: false,
    reportes: false,
  },
  SecretarioGeneral: {
    gestUsuarios: false,
    gestSolicitudes: true,
    gestCodificadores: false,
    gestCursos: true,
    procesamiento: true,
    reportes: true,
  },
  Matriculador: {
    gestUsuarios: false,
    gestSolicitudes: true,
    gestCodificadores: false,
    gestCursos: false,
    procesamiento: false,
    reportes: false,
  },
  Tecnico: {
    gestUsuarios: false,
    gestSolicitudes: true,
    gestCodificadores: true,
    gestCursos: false,
    procesamiento: false,
    reportes: true,
  },
};

export default function AdminForm({ editMode, formData, onSubmit }) {
  const { cod_usuario, email, name, password, rol, username } = formData;
  const [nameInput, setNameInput] = useState(name);
  const [userInput, setUserInput] = useState(username);
  const [pwd, setPwd] = useState(null);
  const [pwdConfirm, setPwdConfirm] = useState(null);
  const [showPwd, setShowPwd] = useState(false);
  const [rolesList, setRolesList] = useState([]);
  const [selectedRole, setSelectedRole] = useState(formData?.rol ? { ...formData, description: formData.rol } : null);

  const [errors, setErrors] = useState({
    name: '',
    role: '',
    userName: '',
    pwd: '',
    pwdConfirm: '',
  });

  useEffect(() => {
    getAllRoles()
      .then((response) => {
        if (response.status === 200) {
          setRolesList(response.data);
        }
      })
      .catch((error) => {
        console.log('Error al cargar las carreras', error);
      });
  }, []);

  const validateData = () => {
    const newErrors = {};

    if (!nameInput) {
      newErrors.name = 'Nombre requerido';
    }
    if (!selectedRole) {
      newErrors.role = 'Rol requerido';
    }
    if (!userInput) {
      newErrors.userName = 'Nombre de usuario requerido';
    }
    if (!pwd && !editMode) {
      newErrors.pwd = 'Contraseña requerida';
    }
    if (!pwdConfirm && !editMode) {
      newErrors.pwdConfirm = 'Confirmación requerida';
    }
    if (pwd !== pwdConfirm) {
      newErrors.pwdConfirm = 'Deben coincidir las contraseñas';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateData()) {
      setMessage('success', 'Datos válidos');
      const user = {
        cod_usuario,
        name: nameInput,
        username: userInput,
        password: pwd,
        email,
        rol: selectedRole.description,
      };

      let permissions;
      switch (user.rol) {
        case 'Administrador':
          permissions = rolePermissions.Administrador;
          break;
        case 'Secretario General':
          permissions = rolePermissions.SecretarioGeneral;
          break;
        case 'Técnico':
          permissions = rolePermissions.Tecnico;
          break;
        case 'Matriculador':
          permissions = rolePermissions.Matriculador;
          break;
        default:
          break;
      }

      console.log('el usuario', user, 'Los permisos', permissions);

      if (editMode) {
        console.log('el id del usuairo', user.cod_usuario);
        updateUser(user)
          .then((response) => {
            if (response.status === 200) {
              const roleId = rolesList.find((r) => r.description === user.rol)?.rol;
              getUserRoleByUserAndRol(user.cod_usuario, roleId)
                .then((response) => {
                  if (response.status === 200) {
                    const recuperedUserRol = response.data;
                    const userRole = {
                      cod_rol_usuario: recuperedUserRol.cod_rol_usuario,
                      cod_usuario: user.cod_usuario,
                      cod_rol: roleId,
                      ...permissions,
                    };

                    updateUserRol(userRole)
                      .then((response) => {
                        if (response.status === 200) {
                          setMessage('success', '¡Usuario actualizado con éxito!');
                        }
                      })
                      .catch((error) => {
                        console.log('Error al actulizar el UserRol', error);
                        setMessage('error', '¡Ha ocurrido un error!');
                      });
                  }
                })
                .catch((error) => {
                  console.log('Error al obtener el UserRol', error);
                  setMessage('error', '¡Ha ocurrido un error!');
                });
            }
          })
          .catch((error) => {
            console.log('Error al actulizar el usuario', error);
            setMessage('error', '¡Ha ocurrido un error!');
          });
      } else {
        insertUser(user)
          .then((response) => {
            if (response.status === 200) {
              getInsertedUserByUserName(user.username)
                .then((response) => {
                  if (response.status === 200) {
                    const insertedUser = response.data;
                    const roleId = rolesList.find((r) => r.description === user.rol)?.rol;
                    const userRole = { cod_usuario: insertedUser.cod_usuario, cod_rol: roleId, ...permissions };
                    console.log(insertedUser, roleId, userRole);
                    insertUserRole(userRole)
                      .then((response) => {
                        if (response.status === 200) {
                          setMessage('success', '¡Usuario insertado con éxito!');
                        }
                      })
                      .catch((error) => {
                        console.log('Error al insertar el usuarioRol', error);
                        setMessage('error', '¡Ha ocurrido un error!');
                      });
                  }
                })
                .catch((error) => {
                  console.log('Error al recuperar el usuario insertado', error);
                  setMessage('error', '¡Ha ocurrido un error!');
                });
            }
          })
          .catch((error) => {
            console.log('Error al insertar el usuario', error);
            setMessage('error', '¡Ha ocurrido un error!');
          });
      }

      setTimeout(() => {
        onSubmit();
      }, 500);
    }
  };

  const handleCancel = () => {
    const confrimed = window.confirm('Está a punto de perder los cambios no guardados! ¿Desea continuar?');

    if (confrimed) {
      onSubmit();
    }
  };

  const handleNameInput = (event) => {
    // allow only letters
    const inputValue = event.target.value.replace(/[^a-zA-Z]/g, '');
    event.target.value = inputValue;
  };

  const handleUserInput = (event) => {
    // allow only letters and numbers
    const inputValue = event.target.value.replace(/[^a-zA-Z0-9]/g, '');
    event.target.value = inputValue;
  };

  return (
    <>
      <Box
        flexGrow={{ flexGrow: 1 }}
        sx={{ backgroundColor: 'white', marginTop: '80px', pr: '100px', pl: '100px', pb: '20px', pt: '20px' }}
      >
        <Typography variant="h4" gutterBottom>
          {editMode ? 'Editar Usuario' : 'Registrar Usuario'}
        </Typography>

        <Grid container>
          <Grid item container xs={8} spacing={2} sx={{ pt: 5 }}>
            <Grid container item spacing={2} sx={{ pt: 5 }}>
              <Grid item xs />
              <Grid item xs>
                <TextField
                  type={'text'}
                  label="Nombre"
                  variant="outlined"
                  value={nameInput}
                  onInput={handleNameInput}
                  onChange={(event) => setNameInput(event.target.value)}
                  required
                  error={!!errors.name}
                  helperText={errors.name}
                  inputProps={{ maxLength: 45 }}
                />
              </Grid>

              <Grid item xs={4}>
                <Autocomplete
                  id="RolesCombo"
                  options={rolesList}
                  getOptionLabel={(option) => option.description}
                  value={selectedRole}
                  onChange={(event, newValue) => {
                    setSelectedRole(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Roles disponibles"
                      required
                      error={!!errors.role}
                      helperText={errors.role}
                    />
                  )}
                  noOptionsText={'No hay opciones'}
                />
              </Grid>
              <Grid item xs />
            </Grid>

            <Grid container item spacing={2}>
              <Grid item xs>
                <TextField
                  type={'text'}
                  label="Usuario"
                  variant="outlined"
                  value={userInput}
                  onInput={handleUserInput}
                  onChange={(event) => setUserInput(event.target.value)}
                  required
                  error={!!errors.userName}
                  helperText={errors.userName}
                  inputProps={{ maxLength: 15 }}
                />
              </Grid>

              <Grid item xs>
                <TextField
                  type={showPwd ? 'text' : 'password'}
                  label="Contraseña"
                  variant="outlined"
                  value={pwd}
                  onChange={(event) => {
                    setPwd(event.target.value ? event.target.value : null);
                    setErrors({
                      name: '',
                      role: '',
                      userName: '',
                      pwd: '',
                      pwdConfirm: '',
                    });
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPwd(!showPwd)} edge="end">
                          <Iconify icon={showPwd ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{ maxLength: 20 }}
                  required
                  error={!!errors.pwd}
                  helperText={errors.pwd}
                />
              </Grid>
              <Grid item xs>
                <TextField
                  type={showPwd ? 'text' : 'password'}
                  label="Confirmar Contraseña"
                  variant="outlined"
                  value={pwdConfirm}
                  onChange={(event) => setPwdConfirm(event.target.value ? event.target.value : null)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPwd(!showPwd)} edge="end">
                          <Iconify icon={showPwd ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{ maxLength: 20 }}
                  required
                  error={!!errors.pwdConfirm}
                  helperText={errors.pwdConfirm}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs />

          <Grid item xs>
            <RolePermissionsTable rol={selectedRole?.description} />
          </Grid>
        </Grid>

        <Grid container spacing={1} sx={{ pt: 5 }}>
          <Grid item xs />
          <Grid item xs={2}>
            <Button type="submit" variant="contained" color="primary" onClick={handleSubmit}>
              {editMode ? 'Modificar' : 'Registrar'}
            </Button>
          </Grid>
          <Grid item xs={2}>
            <Button type="submit" variant="contained" color="primary" onClick={handleCancel}>
              Cancelar
            </Button>
          </Grid>
          <Grid item xs />
        </Grid>
      </Box>
    </>
  );
}
