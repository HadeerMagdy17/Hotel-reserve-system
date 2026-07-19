import { Box, Typography, Button, Zoom } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { useNavigate } from 'react-router-dom';

export default function PaymentSuccess() {
    const navigate = useNavigate()
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        p: 3,
        textAlign: 'center'
      }}
    >
      {/* Smooth entrance animation for the success mark */}
      <Zoom in={true} timeout={600}>
        <CheckCircleRoundedIcon 
          sx={{ 
            fontSize: 96, 
            color: 'success.main',
            mb: 2,
            filter: 'drop-shadow(0px 4px 20px rgba(46, 125, 50, 0.2))'
          }} 
        />
      </Zoom>

      {/* Main Success Message */}
      <Typography 
        variant="h4" 
        component="h1" 
        sx={{ 
          fontWeight: 700, 
          color: 'text.primary',
          mb: 1 
        }}
      >
        Successful Payment
      </Typography>

      {/* Secondary Message */}
      <Typography 
        variant="body1" 
        sx={{ 
          color: 'text.secondary', 
          mb: 4,
          maxWidth: 400 
        }}
      >
        Your transaction has been completed successfully.
      </Typography>

      {/* Home Button */}
      <Button
        variant="contained"
        color="primary"
        size="large"
        startIcon={<HomeRoundedIcon />}
        onClick={()=>navigate('/')}
        sx={{ 
          px: 4, 
          py: 1.5, 
          borderRadius: 3, 
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: '0 4px 14px 0 rgba(25, 118, 210, 0.3)'
        }}
      >
        Return to Home
      </Button>
    </Box>
  );
}