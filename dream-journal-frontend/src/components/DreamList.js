import { List, ListItem, ListItemText, Divider, Chip, Typography, Button, Stack, Paper, Box } from '@mui/material';
import { format } from 'date-fns';

const DreamList = ({ dreams, onUpdate, onDelete }) => {
  if (!dreams || dreams.length === 0) {
    return <Typography>No dreams recorded yet</Typography>;
  }

  return (
    <Stack spacing={2}>
      {dreams.map((dream) => (
        <Paper key={dream._id} elevation={3} sx={{ p: 2, borderRadius: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap">
            <Box flex={1} minWidth={0}>
              <Typography variant="h6" sx={{ wordBreak: 'break-word', fontWeight: 600, color: '#6a1b9a' }}>{dream.title}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {format(new Date(dream.date), 'MMM dd, yyyy')} • {dream.type}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1, wordBreak: 'break-word' }}>{dream.description}</Typography>
              <Box sx={{ mb: 1 }}>
                {dream.emotions.map((emotion) => (
                  <Chip
                    key={emotion}
                    label={emotion}
                    size="small"
                    sx={{ mr: 0.5, mb: 0.5 }}
                  />
                ))}
              </Box>
              <Box>
                <Chip
                  label={`Rating: ${dream.rating}`}
                  color="primary"
                  size="small"
                  sx={{ mr: 1 }}
                />
                {dream.lucid && (
                  <Chip
                    label="Lucid"
                    color="secondary"
                    size="small"
                  />
                )}
              </Box>
            </Box>
            <Stack direction="column" spacing={1} alignItems="flex-end" sx={{ ml: 2, minWidth: 100 }}>
              <Button variant="contained" size="small" onClick={() => onUpdate(dream)} sx={{ minWidth: 90, background: 'linear-gradient(90deg, #6a1b9a 0%, #ffab40 100%)', color: '#fff', fontWeight: 600 }}>Update</Button>
              <Button variant="outlined" color="error" size="small" onClick={() => onDelete(dream._id)} sx={{ minWidth: 90, fontWeight: 600 }}>Delete</Button>
            </Stack>
          </Box>
        </Paper>
      ))}
    </Stack>
  );
};

export default DreamList;