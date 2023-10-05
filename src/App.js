import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// routes
import Router from './routes';
import { ActiveCourseProvider } from './sections/gestionCurso/curso/context/ActiveCourseContext';
import { ProcessingStatusProvider } from './sections/procesamiento/context/ProcessingStatus';
// theme
import ThemeProvider from './theme';
// components
// import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ActiveCourseProvider>
          <ProcessingStatusProvider>
            <ThemeProvider>
              <ScrollToTop />

              <Router />
            </ThemeProvider>
          </ProcessingStatusProvider>
        </ActiveCourseProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
