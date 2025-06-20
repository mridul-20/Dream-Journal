import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Alert, Paper } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await register(formData);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || 'Registration failed');
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #a6c1ee 0%, #fbc2eb 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Container maxWidth="sm">
          <Paper elevation={6} sx={{ p: 5, borderRadius: 4, background: 'rgba(255,255,255,0.97)' }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#6a1b9a', textAlign: 'center' }}>
              Register
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <form onSubmit={handleSubmit}>
              <TextField
                label="Username"
                name="username"
                fullWidth
                margin="normal"
                value={formData.username}
                onChange={handleChange}
                required
              />
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
                Register
              </Button>
            </form>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default RegisterPage;