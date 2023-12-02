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
import PropTypes from 'prop-types';
import Iconify from '../../../../components/iconify';
import setMessage from '../../../../components/messages/messages';
import Scrollbar from '../../../../components/scrollbar';
import { getCarreras } from '../../../gestionCodificadores/carreras/store/store';
import { UseActiveCourse } from '../../curso/context/ActiveCourseContext';
import { getAllOfertasByCurso } from '../../ofertas/store/store';
import RequestsFormDialog from './RequestsFormDialog';
import RequestsListHead from './RequestsListHead';
import RequestsListToolbar from './RequestsListToolbar';
import { deleteRequester, getSolicitantesByCurso, getSolicitudesByCurso } from '../store/store';

const TABLE_HEAD = [
  { id: 'num_id', label: 'No. Identidad', alignRight: false },
  { id: 'nomb_solicitante', label: 'Nombre', alignRight: false },
  { id: 'prim_apellido', label: '1er Apellido', alignRight: false },
  { id: 'seg_apellido', label: '2do Apellido', alignRight: false },
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
    return filter(array, (_offer) => _offer.nomb_solicitante.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

RequestsPage.propTypes = {
  solicitantesConfirmados: PropTypes.bool,
};
export default function RequestsPage(solicitantesConfirmados) {
  const [openInRowMenu, setOpenInRowMenu] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterValue, setFilterValue] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [isFormDialogVisible, setIsFormDialogVisible] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const { activeCourse } = UseActiveCourse();
  const confirm = useConfirm();

  const [SOLICITANTESSLIST, setSOLICITANTESSLIST] = useState([]);
  const [SOLICITUDESLIST, setSOLICITUDESLIST] = useState([]);
  const [OFERTASLIST, setOFERTASLIST] = useState([]);
  const [CARRERASLIST, setCARRERASLIST] = useState([]);

  useEffect(() => {
    getSolicitudesByCurso(activeCourse.cod_curso, solicitantesConfirmados.solicitantesConfirmados)
      .then((response) => {
        if (response.status === 200) {
          setSOLICITUDESLIST(response.data);
        }
      })
      .catch((error) => {
        console.log('Error al cargar las solicitudes', error);
      });
  }, [solicitantesConfirmados]);

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
              nomb_carrera: relatedCarrera ? relatedCarrera.nomb_carrera : 'Unknown', // Replace 'Unknown' with a default name
            };
          });
          setOFERTASLIST(updatedOfertasList);
        }
      })
      .catch((error) => {
        console.log('Error al cargar ofertas: ', error);
      });
  }, [CARRERASLIST]);

  useEffect(() => {
    getSolicitantesByCurso(activeCourse.cod_curso, solicitantesConfirmados.solicitantesConfirmados)
      .then((response) => {
        if (response.status === 200 && SOLICITUDESLIST.length > 0 && OFERTASLIST.length > 0) {
          const updatedSOLICITANTESLIST = response.data.map((solicitante) => {
            const relatedSolicitudes = SOLICITUDESLIST.filter(
              (solicitud) => solicitud.cod_solicitante === solicitante.cod_solicitante
            );

            const updatedOptions = Array.from({ length: 5 }, (_, index) => {
              const optionIndex = index + 1;
              const relatedSolicitud = relatedSolicitudes.find((solicitud) => solicitud.opcion === optionIndex);
              if (relatedSolicitud) {
                const relatedOferta = OFERTASLIST.find((oferta) => oferta.cod_oferta === relatedSolicitud.cod_oferta);
                return relatedOferta ? relatedOferta.nomb_carrera : 'no solicitada';
              }
              return 'no solicitada';
            });

            return {
              ...solicitante,
              opcion1: updatedOptions[0],
              opcion2: updatedOptions[1],
              opcion3: updatedOptions[2],
              opcion4: updatedOptions[3],
              opcion5: updatedOptions[4],
            };
          });

          setSOLICITANTESSLIST(updatedSOLICITANTESLIST);
        }
      })
      .catch((error) => {
        console.log('Error al cargar solicitantes en curso', error);
      });
  }, [refresh, SOLICITUDESLIST, OFERTASLIST, solicitantesConfirmados]);

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
      const newSelecteds = SOLICITANTESSLIST.map((s) => s.cod_solicitante);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleSelectClick = (event, cod_solicitante) => {
    const selectedIndex = selected.indexOf(cod_solicitante);
    let newSelected = [];
    if (selectedIndex === -1) {
      // not found, add element to selected list
      newSelected = newSelected.concat(selected, cod_solicitante);
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

  const handleConfirmClick = () => {
    if (selected.length === 1) {
      const selectedItem = filteredRequests.find((solicitud) => solicitud.cod_solicitante === selected[0]);
      if (selectedItem) {
        setIsFormDialogVisible(true);
        setEditMode(true);
        setFormData(selectedItem);
        handleCloseInRowMenu();
      }
    }
  };

  const handleDeleteClick = () => {
    if (selected.length === 1) {
      const selectedItem = filteredRequests.find((requester) => requester.cod_solicitante === selected[0]);
      if (selectedItem) {
        confirm({
          content: (
            <Alert severity={'warning'}>
              {`¿Desea eliminar la solicitud del solicitante: ${selectedItem.nomb_solicitante} ${selectedItem.prim_apellido} ${selectedItem.seg_apellido} ?`}
            </Alert>
          ),
        })
          .then(() => {
            deleteRequester(selectedItem)
              .then((response) => {
                if (response.status === 200) {
                  setMessage('success', '¡Solicitud eliminada con éxito!');
                  setOpenInRowMenu(false);
                  setSelected([]);
                  setRefresh(refresh + 1);
                }
              })
              .catch((error) => {
                console.log('Error al eliminar el solicitante', error);
                setMessage('error', '¡Ha ocurrido un error!');
              });
          })
          .catch(() => {});
      }
    }
  };

  const handleMultipleDeleteClick = () => {
    if (selected.length > 0) {
      const selectedItems = filteredRequests.filter((request) => selected.includes(request.cod_solicitante));

      confirm({
        content: (
          <Alert severity={'warning'}>{`¿Desea eliminar las ${selected.length} solicitudes seleccionadas?`}</Alert>
        ),
      })
        .then(() => {
          // Perform the deletion of multiple records
          Promise.all(selectedItems.map((selectedItem) => deleteRequester(selectedItem)))
            .then((responses) => {
              const isSuccess = responses.every((response) => response.status === 200);

              if (isSuccess) {
                setMessage('success', `¡${selected.length} solicitudes eliminadas con éxito!`);
                setOpenInRowMenu(false);
                setSelected([]);
                setRefresh(refresh + 1);
              } else {
                setMessage('warning', '¡Alguna solicitud no pudo ser eliminada!');
              }
            })
            .catch((error) => {
              console.log('Error al eliminar las solicitudes', error);
              setMessage('error', '¡Ha ocurrido un error!');
            });
        })
        .catch(() => {});
    }
  };

  const handleClose = () => {
    confirm({
      content: <Alert severity={'warning'}>¡Perderá los cambios no guardados! ¿Desea continuar?</Alert>,
    })
      .then(() => {
        setRefresh(refresh + 1);
        setIsFormDialogVisible(false);
        setEditMode(false);
        setFormData({});
      })
      .catch(() => {});
  };

  const handleCloseAfterAction = () => {
    setRefresh(refresh + 1);
    setIsFormDialogVisible(false);
    setEditMode(false);
    setFormData({});
  };

  const handleRowClick = (codSol) => {
    const newSelected = [codSol];
    setSelected(newSelected);
  };

  const rowsNumber = SOLICITANTESSLIST.length;

  const filteredRequests = applySortFilter(SOLICITANTESSLIST, getComparator(order, orderBy), filterValue);

  const isNotFound = !filteredRequests.length && !!filterValue;

  return (
    <>
      <Helmet>
        <title> Solicitudes | SAPCE </title>
      </Helmet>

      {isFormDialogVisible ? (
        <RequestsFormDialog
          open={isFormDialogVisible}
          handleCloseClick={handleClose}
          handleCLoseAfterAction={handleCloseAfterAction}
          Data={formData}
          editMode={editMode}
        />
      ) : (
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              {solicitantesConfirmados.solicitantesConfirmados
                ? 'Solicitudes confirmadas'
                : 'Solicitudes sin confirmar'}
            </Typography>
            <Button
              variant="contained"
              style={{ textTransform: 'none' }}
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => {
                setIsFormDialogVisible(true);
                setEditMode(false);
                setFormData({});
              }}
            >
              Registrar Solicitud confirmada
            </Button>
          </Stack>

          <Card sx={{ minWidth: '101%' }}>
            <RequestsListToolbar
              numSelected={selected.length}
              filterValue={filterValue}
              onFilterValue={handleFilterByValue}
              handleDelete={handleMultipleDeleteClick}
            />

            <Scrollbar>
              <TableContainer>
                <Table size="small">
                  <RequestsListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={SOLICITANTESSLIST.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredRequests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const {
                        cod_solicitante,
                        num_id,
                        nomb_solicitante,
                        prim_apellido,
                        seg_apellido,
                        cod_municipio,
                        fuente_ingreso,
                        num_telefono,
                        confirmado,
                        eliminado,
                        opcion1,
                        opcion2,
                        opcion3,
                        opcion4,
                        opcion5,
                      } = row;
                      const selectedSolicitud = selected.indexOf(cod_solicitante) !== -1;

                      return (
                        <TableRow
                          onClick={() => handleRowClick(cod_solicitante)}
                          hover
                          key={cod_solicitante}
                          tabIndex={-1}
                          role="checkbox"
                          selected={selectedSolicitud}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedSolicitud}
                              onChange={(event) => handleSelectClick(event, cod_solicitante)}
                            />
                          </TableCell>

                          <TableCell align="left">{num_id}</TableCell>
                          <TableCell align="left">{nomb_solicitante}</TableCell>
                          <TableCell align="left">{prim_apellido}</TableCell>
                          <TableCell align="left">{seg_apellido}</TableCell>
                          <TableCell align="left">{opcion1}</TableCell>
                          <TableCell align="left">{opcion2}</TableCell>
                          <TableCell align="left">{opcion3}</TableCell>
                          <TableCell align="left">{opcion4}</TableCell>
                          <TableCell align="left">{opcion5}</TableCell>

                          <TableCell align="right">
                            <IconButton size="small" color="inherit" onClick={handleOpenInRowMenu}>
                              <Icon size={1} path={mdiDotsVertical} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {rowsNumber === 0 && (
                      <TableRow style={{ height: 53 * rowsNumber }}>
                        <TableCell colSpan={10} sx={{ textAlign: 'center' }}>
                          Nada que mostrar
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                  {isNotFound && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={10} sx={{ py: 3 }}>
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
            count={SOLICITANTESSLIST.length}
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
        <MenuItem onClick={handleConfirmClick}>
          <Icon size={1} path={mdiPencilOutline} />
          <span style={{ marginLeft: 15 }}>
            {solicitantesConfirmados.solicitantesConfirmados ? 'Editar' : 'Confirmar'}
          </span>
        </MenuItem>

        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <Icon size={1} path={mdiDelete} />
          <span style={{ marginLeft: 15 }}>Eliminar</span>
        </MenuItem>
      </Popover>
    </>
  );
}
