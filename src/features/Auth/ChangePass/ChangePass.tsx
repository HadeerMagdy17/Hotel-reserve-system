import { Box, Button, TextField, Typography, Stack, InputAdornment, IconButton } from "@mui/material";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { axiosInstance } from "../../../api/axiosInstace";
import { toast } from "react-toastify";
import type { IChangePassword } from "../../../interface/AuthInterface";


export default function ChangePassword() {
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IChangePassword>();

  
  const onSubmit = async (data:IChangePassword) => {
    try {
      await axiosInstance.post('/portal/users/change-password', data);
      toast.success("Password changed successfully!");
      reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 500, mx: "auto", bgcolor: "white", borderRadius: 2 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>Change Password</Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          
          {/* 1. Old Password */}
          <TextField
            fullWidth
            type={showOldPass ? "text" : "password"}
            label="Old Password"
            {...register("oldPassword", { required: "Old password is required" })}
            error={!!errors.oldPassword}
            helperText={errors.oldPassword?.message}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowOldPass(!showOldPass)} edge="end">
                      {showOldPass ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* 2. New Password */}
          <TextField
            fullWidth
            type={showNewPass ? "text" : "password"}
            label="New Password"
            {...register("newPassword", { 
                required: "New password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" }
            })}
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowNewPass(!showNewPass)} edge="end">
                      {showNewPass ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* 3. Confirm Password */}
          <TextField
            fullWidth
            type={showConfirmPass ? "text" : "password"}
            label="Confirm New Password"
            {...register("confirmPassword", { 
              required: "Please confirm your password",
              validate: (val) => val === watch("newPassword") || "Passwords do not match"
            })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPass(!showConfirmPass)} edge="end">
                      {showConfirmPass ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{ py: 1.5, fontWeight: "bold", bgcolor: "#1a73e8" }}
          >
            {isSubmitting ? "Changing..." : "Change Password"}
          </Button>

        </Stack>
      </form>
    </Box>
  );
}