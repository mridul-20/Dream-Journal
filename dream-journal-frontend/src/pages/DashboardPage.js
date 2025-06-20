import { Container, Typography, Box, Paper, Stack } from '@mui/material';
import Navbar from '../components/Navbar';
import DreamStats from '../components/DreamStats';
import { useContext, useEffect, useState } from 'react';
import { getDreamStats, getDreams } from '../api';
import { AuthContext } from '../context/AuthContext';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [dreams, setDreams] = useState([]);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchStats = async () => {
        try {
          const { data } = await getDreamStats();
          setStats(data.data);
        } catch (error) {
          console.error('Error fetching stats:', error);
        }
      };
      const fetchDreams = async () => {
        try {
          const { data } = await getDreams();
          setDreams(data.data);
        } catch (error) {
          console.error('Error fetching dreams:', error);
        }
      };
      fetchStats();
      fetchDreams();
    }
  }, [isAuthenticated]);

  return (
    <>
      <Navbar />
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Poppins, Roboto, Helvetica Neue, Arial, sans-serif',
      }}>
        <Container maxWidth="md" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <Paper elevation={6} sx={{ p: 5, borderRadius: 4, background: 'rgba(255,255,255,0.97)', textAlign: 'center', fontFamily: 'inherit', width: '100%' }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#6a1b9a', textAlign: 'center', fontFamily: 'inherit' }}>
            Your Dream Statistics
            </Typography>
            {stats && (
              <Stack alignItems="center" justifyContent="center" sx={{ width: '100%' }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#333', textAlign: 'center', fontWeight: 600, fontFamily: 'inherit' }}>
                  
                </Typography>
                <DreamStats stats={stats} dreams={dreams} />
              </Stack>
            )}
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default DashboardPage;