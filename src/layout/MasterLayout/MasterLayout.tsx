import { Box } from '@mui/material';
import SideBar from '../../features/Admin/SideBar/SideBar';
import { Outlet } from 'react-router-dom';
import NavBar from '../../common/components/NavBar';

export default function MasterLayout() {
  return (
    // sidebar left side
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      <Box component="aside">
        <SideBar />
      </Box>

      {/* 2.  right side (Navbar + Content) */}
     
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#f8f9fa',  
          width: '100%',
          overflowX: 'hidden',
        }}
      >
        <Box
          sx={{
            height: '64px',
            backgroundColor: '#fff',
            display: 'flex',
            alignItems: 'center',
            px: 3,
            borderBottom: '1px solid #ddd',
            position: 'sticky', // يفضل ثابت فوق وأنتِ بتعملي Scroll
            top: 0,
            zIndex: 10,
          }}
        >
          <NavBar/>
          </Box>

        {/* 3. (Outlet) */}
        <Box
          sx={{
            p: { xs: 2, md: 4 }, 
            flexGrow: 1,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}