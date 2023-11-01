import { Grid, TableCell, TableHead, TableRow } from '@mui/material';
import PropTypes from 'prop-types';

QualificationListHead.propTypes = {
  headLabel: PropTypes.array,
};

export default function QualificationListHead({ headLabel }) {
  return (
    <TableHead>
      <TableRow>
        {headLabel.map((headCell) => (
          <TableCell key={headCell.id} align={'center'}>
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
