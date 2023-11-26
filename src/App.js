import { AppBar, Typography } from '@mui/material';
import { ConfirmProvider } from 'material-ui-confirm';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import MainToastContainer from './components/messages/MainToastContainer';
// routes
import Router from './routes';
import { ActiveCourseProvider } from './sections/gestionCurso/curso/context/ActiveCourseContext';
import { ProcessingStatusProvider } from './sections/procesamiento/context/ProcessingStatus';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/scroll-to-top';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ActiveCourseProvider>
          <ProcessingStatusProvider>
            <ThemeProvider>
              <ConfirmProvider
                defaultOptions={{
                  confirmationText: 'Sí',
                  cancellationText: 'No',
                  cancellationButtonProps: {
                    // autoFocus: true,
                    variant: 'contained',
                    color: 'inherit',
                    sx: { minWidth: 100 },
                  },
                  confirmationButtonProps: {
                    variant: 'contained',
                    color: 'primary',
                    sx: { minWidth: 100 },
                    autoFocus: true,
                  },
                  titleProps: { style: { margin: '5px', padding: 0, marginBottom: '30px' } },
                  title: (
                    <AppBar sx={{ position: 'relative', px: 3, borderRadius: 1, height: '40px' }}>
                      <Typography variant="h5" sx={{ marginTop: '4px' }}>
                        Confirmar
                      </Typography>
                    </AppBar>
                  ),
                }}
              >
                <ScrollToTop />

                <Router />
              </ConfirmProvider>
            </ThemeProvider>
          </ProcessingStatusProvider>
        </ActiveCourseProvider>
      </BrowserRouter>
      <MainToastContainer />
    </HelmetProvider>
  );
}
