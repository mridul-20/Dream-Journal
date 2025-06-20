import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Grid,
} from '@mui/material';

const emotionOptions = [
  'joy', 'fear', 'anger', 'sadness', 'surprise',
  'excitement', 'peace', 'confusion', 'love', 'anxiety', 'freedom'
];

const dreamTypes = [
  'adventure', 'nightmare', 'lucid', 'recurring', 
  'prophetic', 'fantasy', 'realistic', 'abstract'
];

const DreamForm = ({ open, onClose, onSubmit, initialData }) => {
  const [dreamData, setDreamData] = useState({
    title: '',
    description: '',
    emotions: [],
    tags: [],
    type: 'adventure',
    lucid: false,
    rating: 3,
  });

  useEffect(() => {
    if (initialData) {
      setDreamData({
        ...initialData,
        tags: Array.isArray(initialData.tags) ? initialData.tags : (initialData.tags || []).toString().split(',').map(tag => tag.trim()),
        emotions: Array.isArray(initialData.emotions) ? initialData.emotions : (initialData.emotions || []).toString().split(',').map(e => e.trim()),
      });
    } else {
      setDreamData({
        title: '',
        description: '',
        emotions: [],
        tags: [],
        type: 'adventure',
        lucid: false,
        rating: 3,
      });
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setDreamData(prev => ({
      ...prev,
      [name]: name === 'lucid' ? checked : value,
    }));
  };

  const handleEmotionChange = (e) => {
    const { value } = e.target;
    setDreamData(prev => ({
      ...prev,
      emotions: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(dreamData);
    setDreamData({
      title: '',
      description: '',
      emotions: [],
      tags: [],
      type: 'adventure',
      lucid: false,
      rating: 3,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Record Your Dream</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={12} md={12}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={dreamData.title}
              onChange={handleChange}
              sx={{ minWidth: 550, maxWidth: '100%' }}

            />
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <TextField
              fullWidth
              multiline
              rows={6}
              label="Description"
              name="description"
              value={dreamData.description}
              onChange={handleChange}
              sx={{ minWidth: 550, maxWidth: '100%' }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <FormControl fullWidth>
              <InputLabel shrink>Emotions</InputLabel>
              <Select
                fullWidth
                multiple
                name="emotions"
                value={dreamData.emotions}
                onChange={handleEmotionChange}
                renderValue={(selected) => selected.join(', ')}
                label="Emotions"
                sx={{ minWidth: 200, maxWidth: '100%' }}
              >
                {emotionOptions.map((emotion) => (
                  <MenuItem key={emotion} value={emotion}>
                    {emotion}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Tags"
              name="tags"
              value={dreamData.tags}
              onChange={(e) => {
                setDreamData(prev => ({
                  ...prev,
                  tags: e.target.value.split(',').map(tag => tag.trim()),
                }));
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel shrink>Dream Type</InputLabel>
              <Select
                name="type"
                value={dreamData.type}
                onChange={handleChange}
                label="Dream Type"
              >
                {dreamTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  name="lucid"
                  checked={dreamData.lucid}
                  onChange={handleChange}
                />
              }
              label="Lucid Dream"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="number"
              label="Rating"
              name="rating"
              value={dreamData.rating}
              onChange={handleChange}
              inputProps={{ min: 1, max: 5 }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DreamForm;