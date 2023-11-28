import { Container, Typography } from '@mui/material';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { UseAuthContext } from '../../auth/context/AuthProvider';

export default function HelpPage() {
  const { auth } = UseAuthContext();
  const [helpText, setHelpText] = useState('');

  switch (auth.rol) {
    case 'Administrador':
      setHelpText();
      break;
    case 'Secretario General':
      setHelpText();
      break;
    case 'Matriculador':
      setHelpText();
      break;
    case 'Técnico':
      setHelpText();
      break;
    default:
      setHelpText('Inicia Sesión');
      break;
  }

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
