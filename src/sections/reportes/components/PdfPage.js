import { Backdrop, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getProvinciasReport } from '../store/store';
import ViewPdf from './ViewPdf';

PdfPage.propTypes = {
  pdfName: PropTypes.string,
};

export default function PdfPage() {
  const [pdfData, setPdfData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProvinciasReport()
      .then((response) => {
        if (response.status === 200) {
          const blob = new Blob([response.data], { type: 'application/pdf' });

          setPdfData(blob);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log('Error al cargar el pdf', error);
      });
  }, []);

  return (
    <>
      {!loading && <ViewPdf pdfData={pdfData} />}
      {loading && (
        <Backdrop sx={{ bgcolor: 'white' }} open={loading}>
          <CircularProgress color="primary" />
        </Backdrop>
      )}
    </>
  );
}
