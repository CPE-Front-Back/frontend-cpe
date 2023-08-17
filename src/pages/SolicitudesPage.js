import { faker } from '@faker-js/faker';
import {
  Button,
  Card,
  Checkbox,
  Container,
  IconButton,
  MenuItem,
  Paper,
  Popover,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { filter } from 'lodash';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import OFFERSLIST from '../_mock/oferta';
import SOLICITUDESlIST from '../_mock/solicitud';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import SolicitudesForm from '../sections/GestionCurso/Solicitudes/SolicitudesForm';
import SolicitudesListHead from '../sections/GestionCurso/Solicitudes/SolicitudesListHead';
import SolicitudesListToolbar from '../sections/GestionCurso/Solicitudes/SolicitudesListToolbar';

const TABLE_HEAD = [
  { id: 'idSol', label: 'No. Identidad', alignRight: false },
  { id: 'nombSol', label: 'Nombre', alignRight: false },
  { id: 'primerApellSol', label: '1er Apellido', alignRight: false },
  { id: 'segundoApellSol', label: '2do Apellido', alignRight: false },
  { id: 'opcion1', label: 'Opción 1', alignRight: false },
  { id: 'opcion2', label: 'Opción 2', alignRight: false },
  { id: 'opcion3', label: 'Opción 3', alignRight: false },
  { id: 'opcion4', label: 'Opción 4', alignRight: false },
  { id: 'opcion5', label: 'Opción 5', alignRight: false },
  { id: '' },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_offer) => _offer.nombSol.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function SolicitudesPage() {
  const [openInRowMenu, setOpenInRowMenu] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterValue, setFilterValue] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  const [datos, setDatos] = useState([]);

  const handleOpenInRowMenu = (event) => {
    setOpenInRowMenu(event.currentTarget);
  };

  const handleCloseInRowMenu = () => {
    setOpenInRowMenu(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = SOLICITUDESlIST.map((n) => n.codSol);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleSelectClick = (event, codSol) => {
    const selectedIndex = selected.indexOf(codSol);
    let newSelected = [];
    if (selectedIndex === -1) {
      // not found, add element to selected list
      newSelected = newSelected.concat(selected, codSol);
    } else if (selectedIndex === 0) {
      // found at start, remove first element
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      // found at end, remove the last element
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      // found in the middle, remove that position
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByValue = (event) => {
    setPage(0);
    setFilterValue(event.target.value);
  };

  const handleEditClick = () => {
    if (selected.length === 1) {
      const selectedItem = filteredSolicitudes.find((solicitud) => solicitud.codSol === selected[0]);
      if (selectedItem) {
        setIsFormVisible(true);
        setEditMode(true);
        setFormData(selectedItem);
        handleCloseInRowMenu();
      }
    }
  };

  const handleRowClick = (codSol) => {
    const newSelected = [codSol];
    setSelected(newSelected);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - SOLICITUDESlIST.length) : 0;

  const filteredSolicitudes = applySortFilter(SOLICITUDESlIST, getComparator(order, orderBy), filterValue);

  const isNotFound = !filteredSolicitudes.length && !!filterValue;

  return (
    <>
      <Helmet>
        <title> Solicitudes | CPE </title>
      </Helmet>

      {isFormVisible ? (
        <SolicitudesForm
          formData={formData}
          editMode={editMode}
          onSubmit={(data) => {
            setIsFormVisible(false);
            setEditMode(false);
            setFormData({});
          }}
        />
      ) : (
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              Solicitudes
            </Typography>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => {
                setIsFormVisible(true);
                setEditMode(false);
                setFormData({});
              }}
            >
              Registrar Solicitud
            </Button>
          </Stack>

          <Card>
            <SolicitudesListToolbar
              numSelected={selected.length}
              filterValue={filterValue}
              onFilterValue={handleFilterByValue}
            />

            <Scrollbar>
              <TableContainer>
                <Table>
                  <SolicitudesListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={SOLICITUDESlIST.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredSolicitudes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const {
                        codSol,
                        idSol,
                        nombSol,
                        primerApellSol,
                        segundoApellSol,
                        opcion1,
                        opcion2,
                        opcion3,
                        opcion4,
                        opcion5,
                      } = row;
                      const selectedSolicitud = selected.indexOf(codSol) !== -1;

                      return (
                        <TableRow
                          onClick={() => handleRowClick(codSol)}
                          hover
                          key={codSol}
                          tabIndex={-1}
                          role="checkbox"
                          selected={selectedSolicitud}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedSolicitud}
                              onChange={(event) => handleSelectClick(event, codSol)}
                            />
                          </TableCell>

                          <TableCell align="left">{idSol}</TableCell>
                          <TableCell align="left">{nombSol}</TableCell>
                          <TableCell align="left">{primerApellSol}</TableCell>
                          <TableCell align="left">{segundoApellSol}</TableCell>
                          <TableCell align="left">{opcion1}</TableCell>
                          <TableCell align="left">{opcion2}</TableCell>
                          <TableCell align="left">{opcion3}</TableCell>
                          <TableCell align="left">{opcion4}</TableCell>
                          <TableCell align="left">{opcion5}</TableCell>

                          <TableCell align="right">
                            <IconButton size="large" color="inherit" onClick={handleOpenInRowMenu}>
                              <Iconify icon={'eva:more-vertical-fill'} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                  {isNotFound && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                          <Paper
                            sx={{
                              textAlign: 'center',
                            }}
                          >
                            <Typography variant="h6" paragraph>
                              No encontrado
                            </Typography>

                            <Typography variant="body2">
                              No se encuentran resultados para &nbsp;
                              <strong>&quot;{filterValue}&quot;</strong>.
                              <br /> Intente verificar el término o usar palabras completas.
                            </Typography>
                          </Paper>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
            </Scrollbar>
          </Card>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={SOLICITUDESlIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            labelRowsPerPage={'Filas por página'}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Container>
      )}
      <Popover
        open={Boolean(openInRowMenu)}
        anchorEl={openInRowMenu}
        onClose={handleCloseInRowMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={handleEditClick}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Editar
        </MenuItem>

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Eliminar
        </MenuItem>
      </Popover>
    </>
  );
}
