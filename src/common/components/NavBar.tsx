import { Box } from "@mui/material"
import avatar from '../../assets/images/avatar.png'

export default function NavBar() {
  return (
    <>
    <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
             <span style={{ fontWeight: 'bold' }}>Hadeer Magdy</span>
             <Box component="img" src={avatar} sx={{ width: 40, height: 40, borderRadius: '50%' }} />
          </Box>
        
    </>
  )
}
