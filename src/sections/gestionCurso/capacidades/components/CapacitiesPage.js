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
import Scrollbar from '../../../../components/scrollbar';
import CapacitiesForm from './CapacitiesForm';
import CapacitiesListHead from './CapacitiesListHead';
import CapacitiesListToolbar from './CapacitiesListToolbar';
import { getCapacities } from '../store/store';
import { UseActiveCourse } from '../../curso/context/ActiveCourseContext';

const TABLE_HEAD = [
  { id: 'nomb_aula', label: 'Aula', alignRight: false },
  { id: 'nomb_edif', label: 'Edificio', alignRight: false },
  { id: 'nomb_facultad', label: 'Facultad', alignRight: false },
  { id: 'capacidad', label: 'Capacidad', alignRight: false },
  { id: 'prioridad', label: 'Prioridad', alignRight: false },
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
      (capacity) => String(capacity.nomb_aula).toLowerCase().indexOf(String(query).toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function CapacitiesPage() {
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

  const [CAPACITIESLIST, setCAPACITIESLIST] = useState([]);
  const [BUILDINGSLIST, setBUILDINGSLIST] = useState([]);
  const [FACULTIESLIST, setFACULTIESLIST] = useState([]);

  const { activeCourse } = UseActiveCourse();

  const [filteredCapacities, setFilteredCapacities] = useState([]);
  const [isNotFound, setIsNotFound] = useState(false);
  const [emptyRows, setEmptyRows] = useState(0);

  useEffect(() => {
    getCapacities(activeCourse.cod_curso)
      .then((response) => {
        if (response.status === 200) {
          setCAPACITIESLIST(response.data);
        }
      })
      .catch((error) => {
        console.log('Error al cargar las capacidades', error);
      });
  }, [refresh, activeCourse]);

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
      const newSelecteds = CAPACITIESLIST.map((n) => n.cod_capacidad);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleSelectClick = (event, capacityCode) => {
    const selectedIndex = selected.indexOf(capacityCode);
    let newSelected = [];
    if (selectedIndex === -1) {
      // not found, add element to selected list
      newSelected = newSelected.concat(selected, capacityCode);
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
      const selectedItem = filteredCapacities.find((capacity) => capacity.cod_capacidad === selected[0]);
      if (selectedItem) {
        handleCloseInRowMenu();
        setIsFormVisible(true);
        setEditMode(true);
        setFormData(selectedItem);
      }
    }
  };

  const handleRowClick = (capacityCode) => {
    const newSelected = [capacityCode];
    setSelected(newSelected);
  };

  useEffect(() => {
    setEmptyRows(page > 0 ? Math.max(0, (1 + page) * rowsPerPage - CAPACITIESLIST.length) : 0);
    setFilteredCapacities(applySortFilter(CAPACITIESLIST, getComparator(order, orderBy), filterValue));
    setIsNotFound(!filteredCapacities.length && !!filterValue);
  }, [CAPACITIESLIST, filterValue, order, orderBy]);

  return (
    <>
      <Helmet>
        <title> Capacidades | CPE </title>
      </Helmet>

      {isFormVisible ? (
        <CapacitiesForm
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
              Capacidades
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
              Registrar Capacidad
            </Button>
          </Stack>

          <Card>
            <CapacitiesListToolbar
              numSelected={selected.length}
              filterValue={filterValue}
              onFilterValue={handleFilterByValue}
            />

            <Scrollbar>
              <TableContainer>
                <Table size="small">
                  <CapacitiesListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={CAPACITIESLIST.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredCapacities.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const {
                        cod_capacidad,
                        cod_aula,
                        nomb_aula,
                        nomb_edificio,
                        nomb_facultad,
                        capacidad,
                        prioridad,
                        eliminada,
                      } = row;
                      const selectedClassroom = selected.indexOf(cod_capacidad) !== -1;

                      return (
                        <TableRow
                          onClick={() => handleRowClick(cod_capacidad)}
                          hover
                          key={cod_aula}
                          tabIndex={-1}
                          role="checkbox"
                          selected={selectedClassroom}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedClassroom}
                              onChange={(event) => handleSelectClick(event, cod_capacidad)}
                            />
                          </TableCell>

                          <TableCell align="left">{nomb_aula}</TableCell>

                          <TableCell align="left">{nomb_edificio}</TableCell>

                          <TableCell align="left">{nomb_facultad}</TableCell>

                          <TableCell align="left">{capacidad}</TableCell>

                          <TableCell align="left">{prioridad}</TableCell>

                          <TableCell align="right">
                            <IconButton size="medium" color="inherit" onClick={handleOpenInRowMenu}>
                              <Icon size={1} path={mdiDotsVertical} />
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
            count={CAPACITIESLIST.length}
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

        <MenuItem sx={{ color: 'error.main' }}>
          <Icon size={1} path={mdiDelete} />
          <span style={{ marginLeft: 15 }}>Eliminar</span>
        </MenuItem>
      </Popover>
    </>
  );
}
