import { Button, Typography } from '@mui/material';
import { filter } from 'lodash';
import { useEffect, useState } from 'react';
import { UseActiveCourse } from '../../gestionCurso/curso/context/ActiveCourseContext';

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
  const [UsersNamesList, setUsersNamesList] = useState();
  const [RolesList, setRolesList] = useState([]);

  const [filteredOffers, setFilteredOffers] = useState([]);
  const [isNotFound, setIsNotFound] = useState(false);
  const [rowsNumber, setRowsNumber] = useState(0);

  const { activeCourse } = UseActiveCourse();

  return (
    <>
      <>ashfkjashflk</>
      <>aksnflanfd</>
    </>
  );
}
