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
import Iconify from '../../../components/iconify';
import setMessage from '../../../components/messages/messages';
import Scrollbar from '../../../components/scrollbar';
import { UseAuthContext } from '../../auth/context/AuthProvider';
import { UseActiveCourse } from '../../gestionCurso/curso/context/ActiveCourseContext';
import { deleteOffer } from '../../gestionCurso/ofertas/store/store';
import { getAllUsersExceptCurrent } from '../store/store';
import AdminForm from './AdminForm';
import AdminListHead from './AdminListHead';
import AdminListToolbar from './AdminListToolbar';

const TABLE_HEAD = [
  { id: 'username', label: 'Usuario', alignRight: false },
  { id: 'name', label: 'Nombre usuario', alignRight: false },
  { id: 'rol', label: 'Rol', alignRight: false },
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
    return filter(array, (_offer) => String(_offer.name).toLowerCase().indexOf(String(query).toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function AdminPage() {
  const [openInRowMenu, setOpenInRowMenu] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterValue, setFilterValue] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [refresh, setRefresh] = useState(0);

  const [UsersList, setUsersList] = useState([]);

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isNotFound, setIsNotFound] = useState(false);
  const [rowsNumber, setRowsNumber] = useState(0);

  const { auth } = UseAuthContext();

  useEffect(() => {
    getAllUsersExceptCurrent(auth.username)
      .then((response) => {
        if (response.status === 200) {
          const users = response.data;
          setUsersList(users);
          console.log('los usuarios', users);
        }
      })
      .catch((error) => {
        console.log('Error al cargar los usuarios', error);
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
      const newSelecteds = UsersList.map((n) => n.cod_usuario);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleSelectClick = (event, codUsuario) => {
    const selectedIndex = selected.indexOf(codUsuario);
    let newSelected = [];
    if (selectedIndex === -1) {
      // not found, add element to selected list
      newSelected = newSelected.concat(selected, codUsuario);
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
      const selectedItem = filteredUsers.find((user) => user.cod_usuario === selected[0]);
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
      const selectedItem = filteredUsers.find((user) => user.cod_usuario === selected[0]);
      if (selectedItem) {
        const confirmed = window.confirm(`Está seguro que desea eliminar el usuario: ${selectedItem.username}`);

        if (confirmed) {
          deleteOffer(selectedItem)
            .then((response) => {
              if (response.status === 200) {
                setMessage('success', '¡Usuario eliminado con éxito!');
                setOpenInRowMenu(false);
                setSelected([]);
                setRefresh(refresh + 1);
              }
            })
            .catch((error) => {
              console.log('Error al eliminar el usuario', error);
              setMessage('error', '¡Ha ocurrido un error!');
            });
        }
      }
    }
  };

  const handleRowClick = (userCode) => {
    const newSelected = [userCode];
    setSelected(newSelected);
  };

  useEffect(() => {
    setRowsNumber(UsersList.length);
    setFilteredUsers(applySortFilter(UsersList, getComparator(order, orderBy), filterValue));
    setIsNotFound(!filteredUsers.length && !!filterValue);
  }, [UsersList, filterValue, order, orderBy]);

  return (
    <>
      <Helmet>
        <title> Usuarios | SAPCE </title>
      </Helmet>

      {isFormVisible ? (
        <AdminForm
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
              Usuarios
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
              Registrar Usuario
            </Button>
          </Stack>

          <Card>
            <AdminListToolbar
              numSelected={selected.length}
              filterValue={filterValue}
              onFilterValue={handleFilterByValue}
            />

            <Scrollbar>
              <TableContainer>
                <Table size="small">
                  <AdminListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={UsersList.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { cod_usuario, email, name, password, rol, username } = row;
                      const selectedUser = selected.indexOf(cod_usuario) !== -1;

                      return (
                        <TableRow
                          onClick={() => handleRowClick(cod_usuario)}
                          hover
                          key={cod_usuario}
                          tabIndex={-1}
                          role="checkbox"
                          selected={selectedUser}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedUser}
                              onChange={(event) => handleSelectClick(event, cod_usuario)}
                            />
                          </TableCell>

                          <TableCell align="left">{username}</TableCell>

                          <TableCell align="left">{name}</TableCell>

                          <TableCell align="left">{rol}</TableCell>

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
            count={UsersList.length}
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
