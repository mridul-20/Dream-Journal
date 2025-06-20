import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button 
} from '@mui/material';
import { MoreVert, Edit, Delete } from '@mui/icons-material';
import DreamForm from './DreamForm';
import { useDreamContext } from '../context/DreamContext';

const DreamItem = ({ dream }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const { updateDream, deleteDream } = useDreamContext();

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleUpdate = async (updatedData) => {
    await updateDream(dream._id, updatedData);
    setOpenEdit(false);
  };

  const handleDelete = async () => {
    await deleteDream(dream._id);
    setOpenDelete(false);
  };

  return (
    <>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">{dream.title}</Typography>
            <IconButton onClick={handleMenuOpen}>
              <MoreVert />
            </IconButton>
          </div>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {new Date(dream.date).toLocaleDateString()} • {dream.type}
          </Typography>
          
          <Typography paragraph sx={{ mt: 1 }}>{dream.description}</Typography>
          
          <div>
            {dream.emotions.map(emotion => (
              <Chip 
                key={emotion} 
                label={emotion} 
                size="small" 
                sx={{ mr: 1, mb: 1 }} 
              />
            ))}
          </div>
          
          {dream.lucid && (
            <Chip label="Lucid" color="secondary" size="small" sx={{ mr: 1 }} />
          )}
          <Chip 
            label={`Rating: ${dream.rating}`} 
            color="primary" 
            size="small" 
          />
        </CardContent>
      </Card>

      {/* Options Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { setOpenEdit(true); handleMenuClose(); }}>
          <Edit sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={() => { setOpenDelete(true); handleMenuClose(); }}>
          <Delete sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      {/* Edit Dialog */}
      <DreamForm
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        onSubmit={handleUpdate}
        initialData={dream}
      />

      {/* Delete Confirmation */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Delete Dream</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this dream?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button 
            onClick={handleDelete} 
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DreamItem;