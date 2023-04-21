import { AppBar, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Patent Explorer
          </Link>
        </Typography>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit', marginRight: '16px' }}>
          Home
        </Link>
        <Link to="/patents" style={{ textDecoration: 'none', color: 'inherit' }}>
          Patents
        </Link>
      </Toolbar>
    </AppBar>
  );
}
