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
import setMessage from '../../../../components/messages/messages';
import { getCarreras } from '../../../gestionCodificadores/carreras/store/store';
import { UseActiveCourse } from '../../curso/context/ActiveCourseContext';

import { deleteOffer, getAllOfertasByCurso } from '../store/store';

import Iconify from '../../../../components/iconify';
import Scrollbar from '../../../../components/scrollbar';
import OfertasForm from './OfertasForm';
import OfertasListHead from './OfertasListHead';
import OfertasListToolbar from './OfertasListToolbar';

const TABLE_HEAD = [
  { id: 'nomb_carrera', label: 'Carrera', alignRight: false },
  { id: 'cant_ofertas', label: 'Cantidad de ofertas', alignRight: false },
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
    return filter(
      array,
      (_offer) => String(_offer.nomb_carrera).toLowerCase().indexOf(String(query).toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function OffersPage() {
  const [openInRowMenu, setOpenInRowMenu] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('nomb_carrera');
  const [filterValue, setFilterValue] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [refresh, setRefresh] = useState(0);

  const [OFERTASLIST, setOFERTASLIST] = useState([]);
  const [CARRERASLIST, setCARRERASLIST] = useState([]);

  const [filteredOffers, setFilteredOffers] = useState([]);
  const [isNotFound, setIsNotFound] = useState(false);
  const [rowsNumber, setRowsNumber] = useState(0);

  const { activeCourse } = UseActiveCourse();

  useEffect(() => {
    getCarreras()
      .then((response) => {
        if (response.status === 200) {
          setCARRERASLIST(response.data);
        }
      })
      .catch((error) => {
        console.log('Error al cargar las carreras', error);
      });
  }, []);

  useEffect(() => {
    getAllOfertasByCurso(activeCourse.cod_curso)
      .then((response) => {
        if (response.status === 200) {
          const updatedOfertasList = response.data.map((oferta) => {
            const relatedCarrera = CARRERASLIST.find((carrera) => carrera.cod_carrera === oferta.cod_carrera);
            return {
              ...oferta,
              nomb_carrera: relatedCarrera ? relatedCarrera.nomb_carrera : 'Cargando', // Replace 'Unknown' with a default name
            };
          });
          setOFERTASLIST(updatedOfertasList);
          console.log('Cargar las ofertas', refresh);
        }
      })
      .catch((error) => {
        console.log('Error al cargar ofertas: ', error);
      });
  }, [refresh, CARRERASLIST]);

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
      const newSelecteds = OFERTASLIST.map((n) => n.cod_carrera);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleSelectClick = (event, codCarrera) => {
    const selectedIndex = selected.indexOf(codCarrera);
    let newSelected = [];
    if (selectedIndex === -1) {
      // not found, add element to selected list
      newSelected = newSelected.concat(selected, codCarrera);
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
      const selectedItem = filteredOffers.find((offer) => offer.cod_carrera === selected[0]);
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
      const selectedItem = filteredOffers.find((offer) => offer.cod_oferta === selected[0]);
      if (selectedItem) {
        const confirmed = window.confirm(`Está seguro que desea eliminar la oferta: ${selectedItem.cod_oferta}`);

        if (confirmed) {
          deleteOffer(selectedItem)
            .then((response) => {
              if (response.status === 200) {
                setMessage('success', '¡Oferta eliminada con éxito!');
                setOpenInRowMenu(false);
                setSelected([]);
                setRefresh(refresh + 1);
              }
            })
            .catch((error) => {
              console.log('Error al eliminar la oferta', error);
              setMessage('error', '¡Ha ocurrido un error!');
            });
        }
      }
    }
  };

  const handleRowClick = (codCarrera) => {
    const newSelected = [codCarrera];
    setSelected(newSelected);
  };

  useEffect(() => {
    setRowsNumber(OFERTASLIST.length);
    setFilteredOffers(applySortFilter(OFERTASLIST, getComparator(order, orderBy), filterValue));
    setIsNotFound(!filteredOffers.length && !!filterValue);
  }, [OFERTASLIST, filterValue, order, orderBy]);

  return (
    <>
      <Helmet>
        <title> Ofertas | SAPCE </title>
      </Helmet>

      {isFormVisible ? (
        <OfertasForm
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
              Ofertas
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
              Registrar Oferta
            </Button>
          </Stack>

          <Card>
            <OfertasListToolbar
              numSelected={selected.length}
              filterValue={filterValue}
              onFilterValue={handleFilterByValue}
            />

            <Scrollbar>
              <TableContainer>
                <Table size="small">
                  <OfertasListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={OFERTASLIST.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredOffers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { cod_oferta, cod_carrera, nomb_carrera, cod_curso, cant_ofertas, eliminada } = row;
                      const selectedOffer = selected.indexOf(cod_carrera) !== -1;

                      return (
                        <TableRow
                          onClick={() => handleRowClick(cod_carrera)}
                          hover
                          key={cod_oferta}
                          tabIndex={-1}
                          role="checkbox"
                          selected={selectedOffer}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedOffer}
                              onChange={(event) => handleSelectClick(event, cod_carrera)}
                            />
                          </TableCell>

                          <TableCell align="left">{nomb_carrera}</TableCell>

                          <TableCell align="left">{cant_ofertas}</TableCell>

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
            count={OFERTASLIST.length}
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
            px: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              pl: 1,
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
