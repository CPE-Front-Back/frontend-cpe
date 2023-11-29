import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { UseActiveCourse } from '../../sections/gestionCurso/curso/context/ActiveCourseContext';
import {
  asignar1raVuelta,
  asignar2daVuelta,
  asignarActas,
  asignarAulas,
} from '../../sections/procesamiento/store/store';
import setMessage from './messages';

export default function ProcessingStatusDialog({ open, handleClose, actionName }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { activeCourse, refreshProcessingStatus, setRefreshProcessingStatus } = UseActiveCourse();

  useEffect(() => {
    switch (actionName) {
      case 'Asignar carreras 1ra vuelta':
        setTitle('¿Desea realizar la asignación en 1ra vuelta?');
        setContent(
          'Después de esta acción no se podrán actualizar las ofertas, ni las solicitudes en el curso.\n' +
            'Tampoco se podrá volver a realizar la asignación en 1ra vuelta.'
        );
        break;
      case 'Asignar carreras 2da vuelta':
        setTitle('¿Desea realizar la asignación en 2da vuelta?');
        setContent(
          'Después de esta acción no se podrá actualizar las calificaciones, ni insertar las recalificaciones de los solicitantes.\n' +
            'Tampoco se podrá volver a realiazr la asignación en 2da vuelta.'
        );
        break;
      case 'Asignar aulas':
        setTitle('¿Desea realizar la asignación de las aulas?');
        setContent(
          'Después de esta acción no se podrá actualizar las capacidades.\n' +
            'Tampoco se podrá volver a asignar las aulas.'
        );
        break;
      case 'Asignar actas':
        setTitle('¿Desea realizar la asignación de las actas?');
        setContent('Después de esta acción no se podrá volver a asignar las actas.');
        break;
      default:
        console.log('Error al cargar datos del dialog');
    }
  }, [actionName]);

  const handleAccept = () => {
    switch (actionName) {
      case 'Asignar carreras 1ra vuelta':
        console.log('aceptando para Asignar carreras 1ra vuelta');

        asignar1raVuelta(activeCourse.cod_curso)
          .then((response) => {
            console.log(response);
            if (response.data) {
              setRefreshProcessingStatus(refreshProcessingStatus + 1);
              setMessage('success', '¡Asignación realizada con éxito!');
              handleClose();
            } else {
              setMessage('error', '¡No se ha podido realizar la asignación!');
            }
          })
          .catch((error) => {
            console.log('Error al asignar primera vuelta', error);
            setMessage('error', '¡Ha ocurrido un error!');
          });
        break;
      case 'Asignar carreras 2da vuelta':
        console.log('aceptando para Asignar carreras 2da vuelta');

        asignar2daVuelta(activeCourse.cod_curso)
          .then((response) => {
            console.log(response);
            if (response.data) {
              setRefreshProcessingStatus(refreshProcessingStatus + 1);
              setMessage('success', '¡Asignación realizada con éxito!');
              handleClose();
            } else {
              setMessage('error', '¡No se ha podido realizar la asignación!');
            }
          })
          .catch((error) => {
            console.log('Error al asignar segunda vuelta', error);
            setMessage('error', '¡Ha ocurrido un error!');
          });
        break;
      case 'Asignar aulas':
        console.log('aceptando para Asignar aulas');

        asignarAulas(activeCourse.cod_curso)
          .then((response) => {
            console.log(response);
            if (response.data) {
              setRefreshProcessingStatus(refreshProcessingStatus + 1);
              setMessage('success', '¡Asignación realizada con éxito!');
              handleClose();
            } else {
              setMessage('error', '¡No se ha podido realizar la asignación!');
            }
          })
          .catch((error) => {
            console.log('Error al asignar las aulas', error);
            setMessage('error', '¡Ha ocurrido un error!');
          });
        break;
      case 'Asignar actas':
        console.log('aceptando para Asignar actas');

        asignarActas(activeCourse.cod_curso)
          .then((response) => {
            console.log(response);
            if (response.data) {
              setRefreshProcessingStatus(refreshProcessingStatus + 1);
              setMessage('success', '¡Asignación realizada con éxito!');
              handleClose();
            } else {
              setMessage('error', '¡No se ha podido realizar la asignación!');
            }
          })
          .catch((error) => {
            console.log('Error al asignar las actas', error);
            setMessage('error', '¡Ha ocurrido un error!');
          });
        break;
      default:
        console.log('Error al determinar la asignación');
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <Box sx={{ bgcolor: 'primary.main', mt: '4px', mx: '4px', borderRadius: 1 }}>
          <DialogTitle id="alert-dialog-title" color={'white'}>
            {title}
          </DialogTitle>
        </Box>
        <DialogContent sx={{ width: '450px' }}>
          <DialogContentText id="alert-dialog-description" sx={{ width: '100%' }}>
            {content.split('\n').map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button variant={'contained'} onClick={handleAccept} autoFocus>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
