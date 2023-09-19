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
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import BuildingsForm from '../sections/gestionCodificadores/edificios/BuildingsForm';
import BuildingsListHead from '../sections/gestionCodificadores/edificios/BuildingsListHead';
import BuildingsListToolbar from '../sections/gestionCodificadores/edificios/BuildingsListToolbar';
import { getBuildings } from '../sections/gestionCodificadores/edificios/store/store';
import { getFaculties } from '../sections/gestionCodificadores/facultades/store/store';

const TABLE_HEAD = [
  { id: 'nomb_edif', label: 'Edificio', alignRight: false },
  { id: 'facultad', label: 'Facultad', alignRight: false },
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
      (_building) => String(_building.nomb_edif).toLowerCase().indexOf(String(query).toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function BuildingsPage() {
  const [openInRowMenu, setOpenInRowMenu] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('nomb_edif');
  const [filterValue, setFilterValue] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [refresh, setRefresh] = useState(0);

  const [BUILDINGSLIST, setBUILDINGSLIST] = useState([]);
  const [FACULTIESLIST, setFACULTIESLIST] = useState([]);

  useEffect(() => {
    getFaculties()
      .then((response) => {
        if (response.status === 200) {
          setFACULTIESLIST(response.data);
        }
      })
      .catch((error) => {
        console.log('Error al cargar las facultades', error);
      });
  }, []);

  useEffect(() => {
    getBuildings()
      .then((response) => {
        if (response.status === 200) {
          const updatedBuildingsList = response.data.map((building) => {
            const relatedFaculty = FACULTIESLIST.find((faculty) => faculty.cod_facultad === building.facultad);
            return {
              ...building,
              nomb_facultad: relatedFaculty ? relatedFaculty.nomb_facultad : 'Unknown', // Replace 'Unknown' with a default name
            };
          });
          setBUILDINGSLIST(updatedBuildingsList);
          console.log('Cargar los edificios', refresh);
        }
      })
      .catch((error) => {
        console.log('Error al cargar edificios: ', error);
      });
  }, [refresh, FACULTIESLIST]);

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
      const newSelecteds = BUILDINGSLIST.map((n) => n.cod_edif);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleSelectClick = (event, codEdif) => {
    const selectedIndex = selected.indexOf(codEdif);
    let newSelected = [];
    if (selectedIndex === -1) {
      // not found, add element to selected list
      newSelected = newSelected.concat(selected, codEdif);
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
      const selectedItem = filteredBuildings.find((building) => building.cod_edif === selected[0]);
      if (selectedItem) {
        handleCloseInRowMenu();
        setIsFormVisible(true);
        setEditMode(true);
        setFormData(selectedItem);
      }
    }
  };

  const handleRowClick = (codEdif) => {
    const newSelected = [codEdif];
    setSelected(newSelected);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - BUILDINGSLIST.length) : 0;

  const filteredBuildings = applySortFilter(BUILDINGSLIST, getComparator(order, orderBy), filterValue);

  const isNotFound = !filteredBuildings.length && !!filterValue;

  return (
    <>
      <Helmet>
        <title> Edificios | CPE </title>
      </Helmet>

      {isFormVisible ? (
        <BuildingsForm
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
              Edificios
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
              Registrar Edificio
            </Button>
          </Stack>

          <Card>
            <BuildingsListToolbar
              numSelected={selected.length}
              filterValue={filterValue}
              onFilterValue={handleFilterByValue}
            />

            <Scrollbar>
              <TableContainer>
                <Table size="small">
                  <BuildingsListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={BUILDINGSLIST.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredBuildings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { cod_edif, nomb_edif, nomb_facultad, eliminado } = row;
                      const selectedBuilding = selected.indexOf(cod_edif) !== -1;

                      return (
                        <TableRow
                          onClick={() => handleRowClick(cod_edif)}
                          hover
                          key={cod_edif}
                          tabIndex={-1}
                          role="checkbox"
                          selected={selectedBuilding}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedBuilding}
                              onChange={(event) => handleSelectClick(event, cod_edif)}
                            />
                          </TableCell>

                          <TableCell align="left">{nomb_edif}</TableCell>

                          <TableCell align="left">{nomb_facultad}</TableCell>

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
            count={BUILDINGSLIST.length}
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
