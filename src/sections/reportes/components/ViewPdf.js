import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { pdfjs } from 'react-pdf';
import { Button, Container, Grid, Stack, Typography } from '@mui/material';
import setMessage from '../../../components/messages/messages';
import Scrollbar from '../../../components/scrollbar';

export default function ViewPdf({ pdfData, pdfName }) {
  return (
    <Container sx={{ backgroundColor: 'white', pt: '50px' }}>
      <Grid container mb={5}>
        <Grid item xs={12} sm={8} md={8}>
          <Typography variant="h4" gutterBottom textAlign={'center'}>
            {pdfName}
          </Typography>
        </Grid>
        <Grid item xs />
        <Grid item container xs={12} sm={3} md={3} justifyContent="center" alignItems="center">
          <Grid item xs />
          <Grid item xs>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                // You can customize the download logic here
                const link = document.createElement('a');
                link.href = URL.createObjectURL(pdfData);
                link.download = `${pdfName}.pdf`;
                link.click();
                setMessage('success', '¡Reporte creado con éxito!');
              }}
              sx={{ minWidth: '150px' }}
            >
              Download PDF
            </Button>
          </Grid>
          <Grid item xs />
        </Grid>
      </Grid>

      <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}>
        <Viewer fileUrl={URL.createObjectURL(pdfData)} />
      </Worker>
    </Container>
  );
}
