import {
  Autocomplete,
  Button,
  Card,
  Container,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Scrollbar from '../../../../components/scrollbar';
import { UseActiveCourse } from '../../../gestionCurso/curso/context/ActiveCourseContext';
import QualificationListHead from './QualificationListHead';

const TABLE_HEAD = [
  { id: 'no_anonimato', label: 'No. Anonimato', alignRight: false },
  { id: 'calificacion', label: 'Calificación', alignRight: false },
  { id: '' },
];

export default function QualificationPage() {
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [requestersList, setRequestersList] = useState([]);

  const [filteredOffers, setFilteredOffers] = useState([
    { no_anonimato: 1, calificacion: 1 },
    { no_anonimato: 2, calificacion: 2 },
  ]);
  const [isNotFound, setIsNotFound] = useState(false);
  const [emptyRows, setEmptyRows] = useState(0);

  const { active_course } = UseActiveCourse();
  // todo: recuperar actas de notas

  return (
    <>
      <Helmet>
        <title> Calificaciones | CPE </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Calificación del instrumento
          </Typography>
        </Stack>

        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ minWidth: '400px' }}>
            <Autocomplete renderInput={(params) => <TextField {...params} label="Actas de notas disponibles" />} />
          </Grid>

          <Grid item xs={12} sx={{ minWidth: '500px' }}>
            <Card>
              <Scrollbar>
                <TableContainer>
                  <Table size="small">
                    <QualificationListHead headLabel={TABLE_HEAD} />

                    <TableBody>
                      {filteredOffers.map((row) => {
                        const { no_anonimato, calificacion } = row;

                        return (
                          <TableRow key={no_anonimato} tabIndex={-1} hover>
                            <TableCell align="left">{no_anonimato}</TableCell>

                            <TableCell align="left" contentEditable>
                              <TextField type={'text'} value={calificacion} />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                          <TableCell colSpan={6}>Nada que mostrar</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Scrollbar>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" onClick={() => {}}>
              Aceptar
            </Button>
            <Button type="submit" variant="contained" color="primary" onClick={() => {}}>
              Cancelar
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
