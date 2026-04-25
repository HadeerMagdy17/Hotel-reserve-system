
import {Box} from '@mui/material'
import SideBar from '../../features/Admin/SideBar/SideBar'
import { Outlet } from 'react-router-dom'
export default function MasterLayout() {
  return (
    <Box>
      admin dash board 
        <SideBar/>
        <Box>
          Navbarrrr 
          <Box>
            <Outlet/>
          </Box>
        </Box>


    </Box>
  )
}
