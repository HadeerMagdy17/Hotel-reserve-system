import { Modal, Box, Typography, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const navigate = useNavigate();

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="login-modal-title">
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: { xs: "90%", sm: 400 }, 
        bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 3, textAlign: 'center',
        outline: "none"
      }}>
        <Typography id="login-modal-title" variant="h5" fontWeight={700} m={2} color="primary.main">
          🔑 Hey Login Required  🔑
        </Typography>
        <Typography id="login-modal-title" variant="h6" fontWeight={700} m={2} color="primary.main">
          🔑 you need access  🔑
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{margin:"1rem"}}>
          To unlock full access, book vacations, and explore fine details, please log in to your account.
        </Typography>
        
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="outlined" color="inherit" onClick={onClose} fullWidth>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={() => navigate("/auth/login")} 
            sx={{ bgcolor: "#3252DF", '&:hover': { bgcolor: "#243eb2" } }}
            fullWidth
          >
            Go to Login
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}