import { Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { UseAuthContext } from '../../auth/context/AuthProvider';

export default function HelpPage() {
  const { auth } = UseAuthContext();
  const [helpText, setHelpText] = useState('');

  useEffect(() => {
    switch (auth.rol) {
      case 'Administrador':
        setHelpText(
          '- Puede modificar los datos de los usuarios, así como sus credenciales de acceso.\n' +
            '- Para modificar la contraseña de un usuario debe proveer y confirmar la nueva contraseña.\n' +
            '- Si no se quiere modificar la contraseña de un usuario se pueden mofificar el resto de los datos dejando en blanco los campos de las contraseñas.'
        );
        break;
      case 'Secretario General':
        setHelpText(
          '- Debe generar el nuevo curso académico proporcionando la fecha en la que iniciará el mismo.\n' +
            '- Luego debe actualizar las ofertas del curso, las solicitudes de los solicitantes, y las capacidades de las aulas.\n' +
            '- Si ya se hizo todo lo anterior, se puede pasar a la asignación de carreras en primera vuelta, luego que se haya efectuado la misma,' +
            ' se podrán asignar las aulas a los solicitantes que no obtuvieron carrera para aplicar el instrumento.\n' +
            '- Realizar la asignación de actas para el instrumento.\n' +
            '- Registrar las calificaciones obtenidas por los solicitantes luego de haber realizado el instrumento.\n' +
            '- Registrar las notas de recalificación de los solicitantes, en caso de existir alguna.\n' +
            '- Realizar la asignación en segunda vuelta (final) de carreras.'
        );
        break;
      case 'Matriculador':
        setHelpText('- Debe actualizar las solicitudes de los solicitantes.');
        break;
      case 'Técnico':
        setHelpText(
          '- Debe de actualizar los codificadores del curso.\n - Debe actualizar las solicitudes de los solicitantes.'
        );
        break;
      default:
        setHelpText('Inicia Sesión');
        break;
    }
  }, [auth.rol]);

  return (
    <>
      <Container sx={{ py: '50px', mt: '50px', bgcolor: 'white', width: '75%' }}>
        <Helmet>
          <title> Contenido de ayuda | SAPCE </title>
        </Helmet>
        <Typography variant="h3" gutterBottom>
          Correcto funcionamiento de la aplicación:
        </Typography>
        <Typography variant="subtitle1">
          {helpText.split('\n').map((line, index) => (
            <span key={index}>
              {line}
              <br />
            </span>
          ))}
        </Typography>
      </Container>
    </>
  );
}
