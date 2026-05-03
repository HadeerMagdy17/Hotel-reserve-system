import { Box, Button, TextField, Typography, InputAdornment, IconButton, CircularProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { axiosInstance } from "../../../api/axiosInstace";
import { toast } from "react-toastify";
import type { IResetPasswordInputs, IResetPasswordResponse } from "../../../interface/AuthInterface";

export default function ResetPass() {
  const navigate = useNavigate();
  const location = useLocation();
  
 
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const userEmail = location.state?.email || "";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<IResetPasswordInputs>({ 
    defaultValues: { email: userEmail, password: "", confirmPassword: "", seed: "" } 
  });

  const onSubmit = async (data: IResetPasswordInputs) => {
    try {
      const response = await axiosInstance.post<IResetPasswordResponse>(
        '/portal/users/reset-password', 
        data
      );
      toast.success(response.data.message || "Password reset successfully!");

      navigate("/auth/login"); 
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Invalid code or data";
      toast.error(errorMessage);
    }
  };

  return (
    <Box sx={{ maxWidth: "100%", mx: "auto", mt: 4 }}>
      <Typography variant="h4" fontWeight="bold">Reset Password</Typography>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Email Address */}
        <TextField
          fullWidth
          label="Email Address"
          sx={{ mb: 2, mt: 2 }}
          {...register("email", { required: "Email is required" })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        {/* 1. New Password */}
        <TextField
          fullWidth
          label="New Password"
          type={showPassword ? "text" : "password"}
          sx={{ mb: 2 }}
          {...register("password", { 
            required: "Password is required",
            minLength: { value: 6, message: "Min length is 6 characters" }
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

       
        <TextField
          fullWidth
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          sx={{ mb: 2 }}
          {...register("confirmPassword", { 
            required: "Please confirm your password",
            validate: (value) => value === watch('password') || "Passwords do not match"
          })}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        {/* Seed (OTP) */}
        <TextField
          fullWidth
          label="Seed"
          placeholder="Enter OTP code"
          sx={{ mb: 3 }}
          {...register("seed", { required: "OTP code is required" })}
          error={!!errors.seed}
          helperText={errors.seed?.message}
        />

        <Button
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          disabled={isSubmitting}
          sx={{ py: 1.5, fontWeight: "bold", mb: 2 }}
        >
          
         {isSubmitting ? <CircularProgress size={24} /> : "Reset"}
          
        </Button>

        <Box sx={{ textAlign: "center" }}>
          <Link to="/auth/login" style={{ fontWeight: "bold", color: "#1976d2", textDecoration: "none" }}>
            Back to Login
          </Link>
        </Box>
      </form>
    </Box>
  );
}