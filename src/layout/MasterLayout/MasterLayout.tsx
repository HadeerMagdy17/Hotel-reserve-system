import { Box } from '@mui/material';
import SideBar from '../../features/Admin/SideBar/SideBar';
import { Outlet } from 'react-router-dom';
import NavBar from '../../common/components/NavBar';

export default function MasterLayout() {
  return (
    // sidebar left side
    <Box sx={{ display: 'flex',   
      height: '100vh', // تثبيت طول الصفحة بطول الشاشة بالظبط
      width: '100vw', 
      overflow: 'hidden' // منع السكرول الخارجي تماماً 
      }}>
      <Box component="aside" sx={{ height: '100vh', flexShrink: 0 }}>
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
         height: '100vh', // لازم نأكد الطول هنا كمان
          overflow: 'hidden', // منع السكرول في الـ main ككل
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
            flexShrink: 0, // عشان الناف بار ميتضغطش لو المحتوى كتر

          }}
        >
          <NavBar/>
          </Box>

        {/* 3. (Outlet) */}
        <Box
          sx={{
            p: { xs: 2, md: 4 }, 
            flexGrow: 1,
            overflowY: 'auto', // تفعيل السكرول الرأسي هنا فقط
            overflowX: 'hidden', // منع السكرول الأفقي
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}