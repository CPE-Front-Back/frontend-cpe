import { useEffect, useState } from 'react';
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function ProcessingStatusDialog({ open, handleClose, actionName }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    switch (actionName) {
      case 'Asignar carreras 1ra vuelta':
        setTitle('Asignación en 1ra vuelta');
        setContent('El contenido de 1ra veulta.');
        break;
      case 'Asignar carreras 2da vuelta':
        setTitle('Asignación en 2da vuelta');
        setContent('El contenido de 2da veulta.');
        break;
      case 'Asignar aulas':
        setTitle('Asignación de las aulas');
        setContent('El contenido de asignación de las aulas.');
        break;
      case 'Asignar actas':
        setTitle('Asignación de las actas');
        setContent('El contenido de asignación de las actas.');
        break;
      default:
        console.log('Error al cargar datos del dialog');
    }
  }, [actionName]);

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
