
import { createTheme } from '@mui/material/styles';
export const theme= createTheme({
    palette:{
        primary:{
            main:"#df430a"
        },
        secondary:{
            main:'rgb(57, 203, 228)'
        }
    },
    typography:{
        fontFamily:"'Poppins',sans-serif",
        h1:{fontWeight:700}
    },
    components:{
        MuiButton:{
            styleOverrides:{
                root:{
                    borderRadius:'8px'
                }
            }
        }
    }
})