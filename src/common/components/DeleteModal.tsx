import React from 'react';
import { Dialog, Box, Typography, Button } from '@mui/material';
import deleteImg from '../../assets/images/noData.png'

interface IProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void; // الفانكشن اللي هتنفذ المسح فعلياً
  title: string;
}

const DeleteModal: React.FC<IProps> = ({ open, onClose, onConfirm, title }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Box sx={{ mb: 2 }}>
          <img src={deleteImg} alt="delete" style={{ width: '80px' }} />
        </Box>
        <Typography variant="h6" fontWeight="bold">{title}?</Typography>
        <Typography variant="body2" color="textSecondary" sx={{ my: 2 }}>
          Are you sure you want to delete this item?
        </Typography>
        <Button 
          variant="contained" 
          color="error" 
          fullWidth 
          onClick={onConfirm}
          sx={{ mt: 2, borderRadius: '8px' }}
        >
          Delete
        </Button>
        <Button 
          variant="outlined" 
          color="secondary" 
          fullWidth 
          onClick={onClose}
          sx={{ my: 2, borderRadius: '8px' }}
        >
          Cancel
        </Button>
      </Box>
    </Dialog>
  );
};

export default DeleteModal;