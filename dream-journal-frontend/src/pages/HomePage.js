import { Container, Typography, Button, Paper, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const HomePage = () => {
  return (
    <>
      <Navbar />
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Container maxWidth="sm">
          <Paper elevation={6} sx={{ p: 5, borderRadius: 4, textAlign: 'center', background: 'rgba(255,255,255,0.95)' }}>
            <Typography variant="h2" gutterBottom sx={{ fontWeight: 700, color: '#6a1b9a' }}>
              Welcome to Dream Journal
            </Typography>
            <Typography variant="body1" paragraph sx={{ color: '#333', mb: 4 }}>
              Record and analyze your dreams to discover patterns and meanings.
            </Typography>
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/register"
              sx={{ mr: 2, px: 4, py: 1.5, fontWeight: 600, background: 'linear-gradient(90deg, #6a1b9a 0%, #ffab40 100%)' }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/interpretations"
              sx={{ px: 4, py: 1.5, fontWeight: 600, borderColor: '#6a1b9a', color: '#6a1b9a' }}
            >
              Explore Interpretations
            </Button>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default HomePage;