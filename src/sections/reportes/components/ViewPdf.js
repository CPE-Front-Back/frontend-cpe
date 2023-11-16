import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { pdfjs } from 'react-pdf';
import { Button, Container, Stack, Typography } from '@mui/material';
import Scrollbar from '../../../components/scrollbar';

export default function ViewPdf({ pdfData, pdfName }) {
  return (
    <Container sx={{ backgroundColor: 'white', pt: '50px' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          {pdfName}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            // You can customize the download logic here
            const link = document.createElement('a');
            link.href = URL.createObjectURL(pdfData);
            link.download = `${pdfName}.pdf`;
            link.click();
          }}
        >
          Download PDF
        </Button>
      </Stack>
      <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}>
        <Viewer fileUrl={URL.createObjectURL(pdfData)} />
      </Worker>
    </Container>
  );
}
