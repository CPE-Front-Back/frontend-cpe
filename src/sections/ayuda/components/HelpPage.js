import { Container, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';

export default function HelpPage() {
  const helpText = `- Primeramente, debe haber un curso activado.
- Luego se deben de actualizar las capacidades de las aulas, las ofertas y las solicitudes de los solicitantes, en caso de que exista ese solicitante, si no existe, se registra el mismo primero y luego sus solicitudes.
- Si ya se hizo todo lo anterior, se puede pasar a la asignación de carreras en primera vuelta, luego que se haya efectuado la misma, se podrán asignar las aulas a los solicitantes que no obtuvieron carrera para aplicar el instrumento.
- Realizar la asignación de actas para el instrumento.
- Registrar las calificaciones obtenidas por los solicitantes luego de haber realizado el instrumento.
- Registrar las notas de recalificación obtenidas por los solicitantes.
- Realizar la asignación final de carreras.`;

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
