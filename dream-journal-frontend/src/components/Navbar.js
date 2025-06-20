import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <AppBar position="static" sx={{
      background: 'rgba(106,27,154,0.85)',
      backdropFilter: 'blur(6px)',
      boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08)',
      py: 1
    }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 1 }}>
          <Button color="inherit" component={Link} to="/" sx={{ fontSize: 22, fontWeight: 700, textTransform: 'none', letterSpacing: 1 }}>
            Dream Journal
          </Button>
        </Typography>
        <Box>
          {isAuthenticated ? (
            <>
              <Button color="inherit" component={Link} to="/dashboard" sx={{ fontWeight: 600 }}>
                Dashboard
              </Button>
              <Button color="inherit" component={Link} to="/dreams" sx={{ fontWeight: 600 }}>
                My Dreams
              </Button>
              <Button color="inherit" onClick={logout} sx={{ fontWeight: 600 }}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login" sx={{ fontWeight: 600 }}>
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register" sx={{ fontWeight: 600 }}>
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;