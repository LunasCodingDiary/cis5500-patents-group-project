import { AppBar, Toolbar, Typography, Button } from '@mui/material';
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
      <Button variant="contained" color="primary" style={{ textTransform: 'none' }}>
        Home
      </Button>
    </Link>
    <Link to="/patents" style={{ textDecoration: 'none', color: 'inherit', marginRight: '16px' }}>
      <Button variant="contained" color="primary" style={{ textTransform: 'none' }}>
        Patents
      </Button>
    </Link>
    <Link to="/search_patents" style={{ textDecoration: 'none', color: 'inherit', marginRight: '16px' }}>
      <Button variant="contained" color="primary" style={{ textTransform: 'none' }}>
        Search
      </Button>
    </Link>
    <Link to="/patent_map" style={{ textDecoration: 'none', color: 'inherit', marginRight: '16px' }}>
      <Button variant="contained" color="primary" style={{ textTransform: 'none' }}>
        Map
      </Button>
    </Link>
  </Toolbar>
</AppBar>
  );
}
