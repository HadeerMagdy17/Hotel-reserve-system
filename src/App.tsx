
import { RouterProvider } from 'react-router-dom'
import './App.css'
import { router } from './routes'
import {ToastContainer} from 'react-toastify'
import { CssBaseline, ThemeProvider } from '@mui/material'
import{theme} from './theme/theme'

function App() {
 

  return (
   <>
  <ThemeProvider theme={theme}>
    <CssBaseline/>
     <ToastContainer/>
   <RouterProvider router={router}/>
  </ThemeProvider>
   </>
  )
}

export default App
