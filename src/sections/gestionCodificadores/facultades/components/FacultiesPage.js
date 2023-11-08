import { mdiDelete, mdiDotsVertical, mdiPencilOutline } from '@mdi/js';
import { Icon } from '@mdi/react';
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
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Iconify from '../../../../components/iconify';
import setMessage from '../../../../components/messages/messages';
import Scrollbar from '../../../../components/scrollbar';
import FacultadesForm from './FacultadesForm';
import FacultadesListHead from './FacultadesListHead';
import FacultadesListToolbar from './FacultadesListToolbar';
import { deleteFaculty, getFaculties } from '../store/store';

const TABLE_HEAD = [{ id: 'nomb_facultad', label: 'Facultad', alignRight: false }, { id: '' }];

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
    return filter(
      array,
      (_faculty) => String(_faculty.nomb_facultad).toLowerCase().indexOf(String(query).toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}
export default function FacultiesPage() {
  const [openInRowMenu, setOpenInRowMenu] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('nomb_facultad');
  const [filterValue, setFilterValue] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [refresh, setRefresh] = useState(0);

  const [FACULTADESlIST, setFACULTADESlIST] = useState([]);

  const [filteredFaculties, setFilteredFaculties] = useState([]);
  const [isNotFound, setIsNotFound] = useState(false);
  const [rowsNumber, setRowsNumber] = useState(0);

  useEffect(() => {
    getFaculties()
      .then((response) => {
        if (response.status === 200) {
          setFACULTADESlIST(response.data);
        }
      })
      .catch((error) => {
        console.log('Error al cargar las facultades', error);
      });
  }, [refresh]);

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
      const newSelecteds = FACULTADESlIST.map((n) => n.nomb_facultad);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleSelectClick = (event, codFacultad) => {
    const selectedIndex = selected.indexOf(codFacultad);
    let newSelected = [];
    if (selectedIndex === -1) {
      // not found, add element to selected list
      newSelected = newSelected.concat(selected, codFacultad);
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
      const selectedItem = FACULTADESlIST.find((faculty) => faculty.cod_facultad === selected[0]);
      if (selectedItem) {
        handleCloseInRowMenu();
        setIsFormVisible(true);
        setEditMode(true);
        setFormData(selectedItem);
      }
    }
  };

  const handleDeleteClick = () => {
    if (selected.length === 1) {
      const selectedItem = filteredFaculties.find((faculty) => faculty.cod_facultad === selected[0]);
      if (selectedItem) {
        const confirmed = window.confirm(`Está seguro que desea eliminar la facultad: ${selectedItem.nomb_facultad} ?`);

        if (confirmed) {
          deleteFaculty(selectedItem)
            .then((response) => {
              if (response.status === 200) {
                setMessage('success', '¡Facultad eliminada con éxito!');
                setOpenInRowMenu(false);
                setSelected([]);
                setRefresh(refresh + 1);
              }
            })
            .catch((error) => {
              console.log('Error al eliminar la facultad', error);
              setMessage('error', '¡Ha ocurrido un error!');
            });
        }
      }
    }
  };

  const handleRowClick = (codFaculty) => {
    const newSelected = [codFaculty];
    setSelected(newSelected);
  };

  useEffect(() => {
    setRowsNumber(FACULTADESlIST.length);
    setFilteredFaculties(applySortFilter(FACULTADESlIST, getComparator(order, orderBy), filterValue));
    setIsNotFound(!filteredFaculties.length && !!filterValue);
  }, [FACULTADESlIST, filterValue, order, orderBy]);

  return (
    <>
      <Helmet>
        <title> Facultades | CPE </title>
      </Helmet>

      {isFormVisible ? (
        <FacultadesForm
          formData={formData}
          editMode={editMode}
          onSubmit={() => {
            setRefresh(refresh + 1);
            setEditMode(false);
            setFormData({});
            setIsFormVisible(false);
          }}
        />
      ) : (
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              Facultades
            </Typography>
            <Button
              variant="contained"
              style={{ textTransform: 'none' }}
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => {
                setIsFormVisible(true);
                setEditMode(false);
                setFormData({});
              }}
            >
              Registrar Facultad
            </Button>
          </Stack>

          <Card>
            <FacultadesListToolbar
              numSelected={selected.length}
              filterValue={filterValue}
              onFilterValue={handleFilterByValue}
            />

            <Scrollbar>
              <TableContainer>
                <Table size="small">
                  <FacultadesListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={FACULTADESlIST.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredFaculties.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { cod_facultad, nomb_facultad, eliminada } = row;
                      const selectedFaculty = selected.indexOf(cod_facultad) !== -1;

                      return (
                        <TableRow
                          onClick={() => handleRowClick(cod_facultad)}
                          hover
                          key={cod_facultad}
                          tabIndex={-1}
                          role="checkbox"
                          selected={selectedFaculty}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedFaculty}
                              onChange={(event) => handleSelectClick(event, cod_facultad)}
                            />
                          </TableCell>

                          <TableCell align="left">{nomb_facultad}</TableCell>

                          <TableCell align="right">
                            <IconButton size="medium" color="inherit" onClick={handleOpenInRowMenu}>
                              <Icon size={1} path={mdiDotsVertical} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {rowsNumber === 0 && (
                      <TableRow style={{ height: 53 * rowsNumber }}>
                        <TableCell colSpan={6} sx={{ textAlign: 'center' }}>
                          Nada que mostrar
                        </TableCell>
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
            count={FACULTADESlIST.length}
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
          <Icon size={1} path={mdiPencilOutline} />
          <span style={{ marginLeft: 15 }}>Editar</span>
        </MenuItem>

        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <Icon size={1} path={mdiDelete} />
          <span style={{ marginLeft: 15 }}>Eliminar</span>
        </MenuItem>
      </Popover>
    </>
  );
}
