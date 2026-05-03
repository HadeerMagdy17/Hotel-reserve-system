import { Box, Container, Fade } from "@mui/material";
import authBg from '../../assets/images/resetPass.png'
import { Outlet } from "react-router-dom";
import styles from './AuthLayout.module.css'
export default function AuthLayout() {
  return (
    <Box className={styles.wrapper}>
    <Container maxWidth={false}  className={styles.container}>
       <Fade in timeout={1000}>
          <Box className={styles.card}>
            {/* Left - FORM */}
            <Box className={styles.formSide}>
          <Outlet/>
         </Box>

          {/* Right */}
          <Box  className={styles.imageSide}>
            <Box 
            component={"img"}
            src={authBg}
            alt="auth bg"
              className={styles.image}
            >
            
              
            </Box>
          </Box>
        </Box>
       </Fade>
        
      </Container>
    </Box>
  );
}
