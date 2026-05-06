import { Box, TextField } from "@mui/material";



interface Iprops{
    label:string;
    name:string;
    register:any;
    validation:any;
    error:any;
    type:string

}

export default function AppTextField({label,name,register,validation,error,type="text"}:Iprops) {
  return (
    <Box>
        <TextField
                  fullWidth
                  label={label}
                  type={type}
                  margin="normal"
                  {...register(name, validation)}
                  error={error}
                  helperText={error?.message}
                />
    </Box>
  )
}
