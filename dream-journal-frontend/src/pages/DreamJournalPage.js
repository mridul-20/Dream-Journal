import { useState, useEffect, useContext } from 'react';
import { Container, Typography, Button, Grid, Paper, Stack, Box } from '@mui/material';
import { Add as AddIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import DreamForm from '../components/DreamForm';
import DreamList from '../components/DreamList';
import { AuthContext } from '../context/AuthContext';
import { getDreams, createDream, getDreamStats, updateDream, deleteDream } from '../api';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const DreamJournalPage = () => {
  const [dreams, setDreams] = useState([]);
  const [stats, setStats] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [editingDream, setEditingDream] = useState(null);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      fetchDreams();
      fetchStats();
    }
  }, [isAuthenticated]);

  const fetchDreams = async () => {
    try {
      const { data } = await getDreams();
      setDreams(data.data);
    } catch (error) {
      console.error('Error fetching dreams:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await getDreamStats();
      setStats(data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleCreateDream = async (dreamData) => {
    try {
      await createDream(dreamData);
      setOpenForm(false);
      fetchDreams();
      fetchStats();
    } catch (error) {
      console.error('Error creating dream:', error);
    }
  };

  const handleUpdateDream = async (dreamData) => {
    try {
      await updateDream(editingDream._id, dreamData);
      setEditingDream(null);
      setOpenForm(false);
      fetchDreams();
      fetchStats();
    } catch (error) {
      console.error('Error updating dream:', error);
    }
  };

  const handleDeleteDream = async (id) => {
    try {
      await deleteDream(id);
      fetchDreams();
      fetchStats();
    } catch (error) {
      console.error('Error deleting dream:', error);
    }
  };

  const handleOpenEdit = (dream) => {
    setEditingDream(dream);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingDream(null);
  };

  return (
    <>
      <Navbar />
      <Box sx={{
        minHeight: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
        fontFamily: 'Poppins, Roboto, Helvetica Neue, Arial, sans-serif',
        position: 'relative',
      }}>
        {/* Floating Back Button */}
        
        <Container maxWidth="md" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <Paper elevation={6} sx={{ p: 4, borderRadius: 4, background: 'rgba(255,255,255,0.97)', width: '100%', textAlign: 'center', fontFamily: 'inherit' }}>
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 2, width: '100%' }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: '#6a1b9a', flex: 1, textAlign: 'center', fontFamily: 'inherit' }}>
                Dream Journal
              </Typography>
            </Stack>
            <Grid container spacing={3} justifyContent="center" alignItems="flex-start">
              <Grid item xs={12} md={8} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Paper elevation={0} sx={{ p: 2, background: 'transparent', width: '100%', textAlign: 'center' }}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#333', fontFamily: 'inherit' }}>
                    Your Dream Journal
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => { setOpenForm(true); setEditingDream(null); }}
                    sx={{ mb: 2, fontWeight: 600, background: 'linear-gradient(90deg, #6a1b9a 0%, #ffab40 100%)', fontFamily: 'inherit' }}
                  >
                    Add New Dream
                  </Button>
                  <DreamList
                    dreams={dreams}
                    onUpdate={handleOpenEdit}
                    onDelete={handleDeleteDream}
                  />
                </Paper>
              </Grid>
            </Grid>
          </Paper>
          <DreamForm
            open={openForm}
            onClose={handleCloseForm}
            onSubmit={editingDream ? handleUpdateDream : handleCreateDream}
            initialData={editingDream}
          />
        </Container>
      </Box>
    </>
  );
};

export default DreamJournalPage;