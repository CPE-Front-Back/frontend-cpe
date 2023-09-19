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
import ClassroomsForm from '../sections/gestionCodificadores/aulas/ClassroomsForm';
import ClassroomsListHead from '../sections/gestionCodificadores/aulas/ClassroomsListHead';
import ClassroomsListToolbar from '../sections/gestionCodificadores/aulas/ClassroomsListToolbar';
import { getClassrooms } from '../sections/gestionCodificadores/aulas/store/store';
import { getBuildings } from '../sections/gestionCodificadores/edificios/store/store';
import { getFaculties } from '../sections/gestionCodificadores/facultades/store/store';

const TABLE_HEAD = [
  { id: 'nomb_aula', label: 'Aula', alignRight: false },
  { id: 'nomb_edif', label: 'Edificio', alignRight: false },
  { id: 'nomb_facultad', label: 'Facultad', alignRight: false },
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
      (_calssroom) => String(_calssroom.nomb_aula).toLowerCase().indexOf(String(query).toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function ClassroomsPage() {
  const [openInRowMenu, setOpenInRowMenu] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('nomb_aula');
  const [filterValue, setFilterValue] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [refresh, setRefresh] = useState(0);

  const [CLASSROOMSLIST, setCLASSROOMSLIST] = useState([]);
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
          setBUILDINGSLIST(response.data);
        }
      })
      .catch((error) => {
        console.log('Error al cargar los edificios', error);
      });
  }, []);

  useEffect(() => {
    getClassrooms()
      .then((response) => {
        if (response.status === 200 && BUILDINGSLIST.length > 0 && FACULTIESLIST.length > 0) {
          const updatedClassroomsList = response.data.map((classroom) => {
            const relatedBuilding = BUILDINGSLIST.find((building) => building.cod_edif === classroom.cod_edif);

            const relatedFaculty = FACULTIESLIST.find((faculty) => faculty.cod_facultad === relatedBuilding.facultad);

            return {
              ...classroom,
              nomb_edif: relatedBuilding ? relatedBuilding.nomb_edif : 'Unknown',
              nomb_facultad: relatedFaculty ? relatedFaculty.nomb_facultad : 'Unknown',
            };
          });

          setCLASSROOMSLIST(updatedClassroomsList);
        }
      })
      .catch((error) => {
        console.log('Error al cargar las aulas', error);
      });
  }, [BUILDINGSLIST, FACULTIESLIST]);

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
      const newSelecteds = CLASSROOMSLIST.map((n) => n.cod_aula);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleSelectClick = (event, classroomCode) => {
    const selectedIndex = selected.indexOf(classroomCode);
    let newSelected = [];
    if (selectedIndex === -1) {
      // not found, add element to selected list
      newSelected = newSelected.concat(selected, classroomCode);
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
      const selectedItem = filteredClassrooms.find((classroom) => classroom.cod_aula === selected[0]);
      if (selectedItem) {
        handleCloseInRowMenu();
        setIsFormVisible(true);
        setEditMode(true);
        setFormData(selectedItem);
      }
    }
  };

  const handleRowClick = (classroomCode) => {
    const newSelected = [classroomCode];
    setSelected(newSelected);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - CLASSROOMSLIST.length) : 0;

  const filteredClassrooms = applySortFilter(CLASSROOMSLIST, getComparator(order, orderBy), filterValue);

  const isNotFound = !filteredClassrooms.length && !!filterValue;

  return (
    <>
      <Helmet>
        <title> Aulas | CPE </title>
      </Helmet>

      {isFormVisible ? (
        <ClassroomsForm
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
              Aulas
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
              Registrar Aula
            </Button>
          </Stack>

          <Card>
            <ClassroomsListToolbar
              numSelected={selected.length}
              filterValue={filterValue}
              onFilterValue={handleFilterByValue}
            />

            <Scrollbar>
              <TableContainer>
                <Table size="small">
                  <ClassroomsListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={CLASSROOMSLIST.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredClassrooms.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { cod_aula, nomb_aula, cod_edif, nomb_edif, nomb_facultad, eliminada } = row;
                      const selectedClassroom = selected.indexOf(cod_aula) !== -1;

                      return (
                        <TableRow
                          onClick={() => handleRowClick(cod_aula)}
                          hover
                          key={cod_aula}
                          tabIndex={-1}
                          role="checkbox"
                          selected={selectedClassroom}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedClassroom}
                              onChange={(event) => handleSelectClick(event, cod_aula)}
                            />
                          </TableCell>

                          <TableCell align="left">{nomb_aula}</TableCell>

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
            count={CLASSROOMSLIST.length}
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
