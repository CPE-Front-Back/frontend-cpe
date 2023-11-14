import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { pdfjs } from 'react-pdf';
import { Button, Container, Typography } from '@mui/material';

const ViewPdf = ({ pdfData }) => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        PDF Viewer
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          // You can customize the download logic here
          const link = document.createElement('a');
          link.href = URL.createObjectURL(pdfData);
          link.download = 'ProvinciasReport.pdf';
          link.click();
        }}
      >
        Download PDF
      </Button>

      <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}>
        <Viewer fileUrl={URL.createObjectURL(pdfData)} />
      </Worker>
    </Container>
  );
};

export default ViewPdf;
