import {
   Avatar,
   Button, Checkbox,
   Container,
   Grid, IconButton, Paper,
   Stack,
   Table,
   TableBody, TableCell,
   TableContainer,
   TablePagination, TableRow,
   Typography
} from "@mui/material";
import {sentenceCase} from "change-case";
import {filter} from "lodash";
import {useState} from "react";
import {Helmet} from "react-helmet-async";
import USERLIST from "../_mock/user";
import Iconify from "../components/iconify";
import Label from "../components/label";
import Scrollbar from "../components/scrollbar";

const TABLE_HEAD = [
   { id: 'name', label: 'Name', alignRight: false },
   { id: 'company', label: 'Company', alignRight: false },
   { id: 'role', label: 'Role', alignRight: false },
   { id: 'isVerified', label: 'Verified', alignRight: false },
   { id: 'status', label: 'Status', alignRight: false },
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
      return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
   }
   return stabilizedThis.map((el) => el[0]);
}

export default function UserPage() {
   const [open, setOpen] = useState(null);
   
   const [page, setPage] = useState(0);
   
   const [order, setOrder] = useState('asc');
   
   const [selected, setSelected] = useState([]);
   
   const [orderBy, setOrderBy] = useState('name');
   
   const [filterName, setFilterName] = useState('');
   
   const [rowsPerPage, setRowsPerPage] = useState(5);
   
   const handleOpenMenu = (event) => {
      setOpen(event.currentTarget);
   };
   
   const handleCloseMenu = () => {
      setOpen(null);
   };
   
   const handleRequestSort = (event, property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
   };
   
   const handleSelectAllClick = (event) => {
      if (event.target.checked) {
         const newSelecteds = USERLIST.map((n) => n.name);
         setSelected(newSelecteds);
         return;
      }
      setSelected([]);
   };
   
   const handleClick = (event, name) => {
      const selectedIndex = selected.indexOf(name);
      let newSelected = [];
      if (selectedIndex === -1) {
         newSelected = newSelected.concat(selected, name);
      } else if (selectedIndex === 0) {
         newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
         newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
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
   
   const handleFilterByName = (event) => {
      setPage(0);
      setFilterName(event.target.value);
   };
   
   const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;
   
   const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);
   
   const isNotFound = !filteredUsers.length && !!filterName;
   
   return (
      <>
         <Helmet>
            <title> Capacidades | Minimal UI </title>
         </Helmet>
         
         <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
               <Typography variant="h4" gutterBottom>
                  Capacidades
               </Typography>
               <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
                  Insertar Capacidad
               </Button>
            </Stack>
            
            <Grid>
               {/* Toolbar */}
               
               <Scrollbar>
                  <TableContainer>
                     <Table>
                        {/* CapaciadedesListHead */}
                        
                        <TableBody>
                           {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                              const { cod_capacidad, aula, edificio, facultad, capacidad, prioridad } = row;
                              const selectedCapacity = selected.indexOf(cod_capacidad) !== -1;
                              
                              return (
                                 <TableRow hover key={cod_capacidad} tabIndex={-1} role="checkbox" selected={selectedCapacity}>
                                    <TableCell padding="checkbox">
                                       <Checkbox checked={selectedCapacity} onChange={(event) => handleClick(event, cod_capacidad)} />
                                    </TableCell>
                                    
                                    <TableCell align="left">{aula}</TableCell>
                                    
                                    <TableCell align="left">{edificio}</TableCell>
                                    
                                    <TableCell align="left">{facultad}</TableCell>
                                    
                                    <TableCell align="left">{capacidad}</TableCell>
                                    
                                    <TableCell align="left">{prioridad}</TableCell>
                                    
                                    <TableCell align="right">
                                       <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
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
                     </Table>
                     
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
                                       Not found
                                    </Typography>
                                    
                                    <Typography variant="body2">
                                       No results found for &nbsp;
                                       <strong>&quot;{filterName}&quot;</strong>.
                                       <br /> Try checking for typos or using complete words.
                                    </Typography>
                                 </Paper>
                              </TableCell>
                           </TableRow>
                        </TableBody>
                     )}
                  </TableContainer>
               </Scrollbar>
               
               <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={USERLIST.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
               />
            </Grid>
         </Container>
      </>
   );
}