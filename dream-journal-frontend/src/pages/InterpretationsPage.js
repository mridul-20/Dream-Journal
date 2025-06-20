import { useState } from 'react';
import { Container, TextField, Button, Typography, Paper, Box } from '@mui/material';
import { getRandomInterpretation } from '../api';
import Navbar from '../components/Navbar';

const InterpretationsPage = () => {
  const [keyword, setKeyword] = useState('');
  const [interpretation, setInterpretation] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const { data } = await getRandomInterpretation(keyword);
      setInterpretation(data.data);
    } catch (error) {
      console.error('Error fetching interpretation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRandom = async () => {
    setLoading(true);
    try {
      const { data } = await getRandomInterpretation();
      setInterpretation(data.data);
      setKeyword('');
    } catch (error) {
      console.error('Error fetching random interpretation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Dream Interpretations
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
            <TextField
              label="Search by keyword"
              fullWidth
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={!keyword || loading}
            >
              Search
            </Button>
            <Button
              variant="outlined"
              onClick={handleRandom}
              disabled={loading}
            >
              Random
            </Button>
          </Box>

          {interpretation && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {interpretation.keyword}
              </Typography>
              <Typography paragraph>{interpretation.meaning}</Typography>
              <Typography color="text.secondary">
                Cultural Origin: {interpretation.cultural_origin}
              </Typography>
            </Paper>
          )}
        </Box>
      </Container>
    </>
  );
};

export default InterpretationsPage;