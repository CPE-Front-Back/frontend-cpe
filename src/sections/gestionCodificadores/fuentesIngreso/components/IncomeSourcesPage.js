import { mdiDelete, mdiDotsVertical, mdiPencilOutline } from '@mdi/js';
import { Icon } from '@mdi/react';
import {
  Alert,
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
import { useConfirm } from 'material-ui-confirm';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Iconify from '../../../../components/iconify';
import setMessage from '../../../../components/messages/messages';
import Scrollbar from '../../../../components/scrollbar';
import IncomeSourcesForm from './IncomeSourcesForm';
import IncomeSourcesListHead from './IncomeSourcesListHead';
import IncomeSourcesListToolbar from './IncomeSourcesListToolbar';
import { deleteIncomeSource, getIncomeSources } from '../store/store';

const TABLE_HEAD = [{ id: 'nomb_fuente', label: 'Fuente de ingreso', alignRight: false }, { id: '' }];

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
      (_incomeSource) => String(_incomeSource.nomb_fuente).toLowerCase().indexOf(String(query).toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}
export default function IncomeSourcesPage() {
  const [openInRowMenu, setOpenInRowMenu] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('nomb_fuente');
  const [filterValue, setFilterValue] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [refresh, setRefresh] = useState(0);

  const [INCOMESOURCESlIST, setINCOMESOURCESlIST] = useState([]);

  const [filteredIncomeSources, setFilteredIncomeSources] = useState([]);
  const [isNotFound, setIsNotFound] = useState(false);
  const [rowsNumber, setRowsNumber] = useState(0);

  const confirm = useConfirm();

  useEffect(() => {
    getIncomeSources()
      .then((response) => {
        if (response.status === 200) {
          setINCOMESOURCESlIST(response.data);
        }
      })
      .catch((error) => {
        console.log('Error al cargar las fuentes de ingreso', error);
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
      const newSelecteds = INCOMESOURCESlIST.map((n) => n.nomb_facultad);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleSelectClick = (event, incomeSourceCode) => {
    const selectedIndex = selected.indexOf(incomeSourceCode);
    let newSelected = [];
    if (selectedIndex === -1) {
      // not found, add element to selected list
      newSelected = newSelected.concat(selected, incomeSourceCode);
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
      const selectedItem = INCOMESOURCESlIST.find((incomeSource) => incomeSource.cod_fuente === selected[0]);
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
      const selectedItem = filteredIncomeSources.find((incomeSource) => incomeSource.cod_fuente === selected[0]);
      if (selectedItem) {
        confirm({
          content: (
            <Alert severity={'warning'}>{`¿Desea eliminar la fuente de ingreso: ${selectedItem.nomb_fuente} ?`}</Alert>
          ),
        })
          .then(() => {
            deleteIncomeSource(selectedItem)
              .then((response) => {
                if (response.status === 200) {
                  setMessage('success', '¡Fuente de ingreso eliminada con éxito!');
                  setOpenInRowMenu(false);
                  setSelected([]);
                  setRefresh(refresh + 1);
                }
              })
              .catch((error) => {
                console.log('Error al eliminar la fuente de ingreso', error);
                setMessage('error', '¡Ha ocurrido un error!');
              });
          })
          .catch(() => {});
      }
    }
  };

  const handleMultipleDeleteClick = () => {
    if (selected.length > 0) {
      const selectedItems = filteredIncomeSources.filter((incomeSource) => selected.includes(incomeSource.cod_fuente));

      confirm({
        content: (
          <Alert
            severity={'warning'}
          >{`¿Desea eliminar las ${selected.length} fuentes de ingreso seleccionadas?`}</Alert>
        ),
      })
        .then(() => {
          // Perform the deletion of multiple records
          Promise.all(selectedItems.map((selectedItem) => deleteIncomeSource(selectedItem)))
            .then((responses) => {
              const isSuccess = responses.every((response) => response.status === 200);

              if (isSuccess) {
                setMessage('success', `¡${selected.length} fuentes de ingreso eliminadas con éxito!`);
                setOpenInRowMenu(false);
                setSelected([]);
                setRefresh(refresh + 1);
              } else {
                setMessage('warning', '¡Alguna fuente de ingreso no pudo ser eliminada!');
              }
            })
            .catch((error) => {
              console.log('Error al eliminar las fuentes de ingreso', error);
              setMessage('error', '¡Ha ocurrido un error!');
            });
        })
        .catch(() => {});
    }
  };

  const handleRowClick = (incomeSourceCode) => {
    const newSelected = [incomeSourceCode];
    setSelected(newSelected);
  };

  useEffect(() => {
    setRowsNumber(INCOMESOURCESlIST.length);
    setFilteredIncomeSources(applySortFilter(INCOMESOURCESlIST, getComparator(order, orderBy), filterValue));
    setIsNotFound(!filteredIncomeSources.length && !!filterValue);
  }, [INCOMESOURCESlIST, filterValue, order, orderBy]);

  return (
    <>
      <Helmet>
        <title> Fuentes de ingreso | SAPCE </title>
      </Helmet>

      {isFormVisible ? (
        <IncomeSourcesForm
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
              Fuentes de ingreso
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
              Registrar Fuente de Ingreso
            </Button>
          </Stack>

          <Card>
            <IncomeSourcesListToolbar
              numSelected={selected.length}
              filterValue={filterValue}
              onFilterValue={handleFilterByValue}
              handleDelete={handleMultipleDeleteClick}
            />

            <Scrollbar>
              <TableContainer>
                <Table size="small">
                  <IncomeSourcesListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={INCOMESOURCESlIST.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredIncomeSources.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { cod_fuente, nomb_fuente, eliminada } = row;
                      const selectedIncomeSource = selected.indexOf(cod_fuente) !== -1;

                      return (
                        <TableRow
                          onClick={() => handleRowClick(cod_fuente)}
                          hover
                          key={cod_fuente}
                          tabIndex={-1}
                          role="checkbox"
                          selected={selectedIncomeSource}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedIncomeSource}
                              onChange={(event) => handleSelectClick(event, cod_fuente)}
                            />
                          </TableCell>

                          <TableCell align="left">{nomb_fuente}</TableCell>

                          <TableCell align="right">
                            <IconButton size="large" color="inherit" onClick={handleOpenInRowMenu}>
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
            count={INCOMESOURCESlIST.length}
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
