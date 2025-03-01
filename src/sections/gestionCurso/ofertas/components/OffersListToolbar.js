import { IconButton, InputAdornment, OutlinedInput, Toolbar, Tooltip, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Iconify from '../../../../components/iconify';
import CapacitiesListToolbar from '../../capacidades/components/CapacitiesListToolbar';

const StyledRoot = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {
    width: 320,
    boxShadow: theme.customShadows.z8,
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

// ----------------------------------------------------------------------
CapacitiesListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterValue: PropTypes.string,
  onFilterValue: PropTypes.func,
  handleDelete: PropTypes.func,
};
export default function OffersListToolbar({ numSelected, filterValue, onFilterValue, handleDelete }) {
  return (
    <StyledRoot
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} {numSelected === 1 ? 'seleccionado' : 'seleccionados'}
        </Typography>
      ) : (
        <StyledSearch
          value={filterValue}
          onChange={onFilterValue}
          placeholder="Buscar oferta..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          }
        />
      )}

      {numSelected > 0 && (
        <Tooltip title="Eliminar">
          <IconButton onClick={handleDelete}>
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </Tooltip>
      )}
    </StyledRoot>
  );
}
