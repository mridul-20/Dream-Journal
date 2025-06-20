import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Alert, Paper } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(formData);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || 'Login failed');
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Container maxWidth="sm">
          <Paper elevation={6} sx={{ p: 5, borderRadius: 4, background: 'rgba(255,255,255,0.97)' }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#6a1b9a', textAlign: 'center' }}>
              Login
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <form onSubmit={handleSubmit}>
              <TextField
                label="Email"
                name="email"
                type="email"
                fullWidth
                margin="normal"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                fullWidth
                margin="normal"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 3, py: 1.5, fontWeight: 600, background: 'linear-gradient(90deg, #6a1b9a 0%, #ffab40 100%)' }}
              >
                Login
              </Button>
            </form>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default LoginPage;