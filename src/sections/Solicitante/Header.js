import { AppBar, Box, Stack, Toolbar, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { bgBlur } from '../../utils/cssStyles';

const HEADER_MOBILE = 64;

const HEADER_DESKTOP = 92;

const StyledRoot = styled(AppBar)(({ theme }) => ({
  ...bgBlur({ color: theme.palette.background.default }),
  boxShadow: 'none',
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

export default function Header() {
  return (
    <>
      <StyledRoot>
        <StyledToolbar>
          <Box sx={{ flexGrow: 1 }} />
          <Stack
            direction="row"
            alignItems="center"
            spacing={{
              xs: 0.5,
              sm: 1,
            }}
          >
            <Typography variant="h4" sx={{ mb: 5 }}>
              Página de solicitante
            </Typography>
          </Stack>
        </StyledToolbar>
      </StyledRoot>
    </>
  );
}
