

import {Box} from '@mui/material'
import SideBar from '../../features/Admin/SideBar/SideBar'
import { Outlet } from 'react-router-dom'
export default function AuthLayout() {
  return (
    <Box>
      auth system
        <Box>
          form and img
          <Box>
            <Outlet/>
          </Box>
        </Box>


    </Box>
  )
}
