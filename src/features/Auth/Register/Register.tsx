import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Stack,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Visibility, VisibilityOff, CloudUpload } from "@mui/icons-material";
import { axiosInstance } from "../../../api/axiosInstace";
import { toast } from "react-toastify";
import type { IRegisterInputs } from "../../../interface/AuthInterface";

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<IRegisterInputs>({
    defaultValues: {
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      country: "",
      role: "user",
    },
  });

  const onSubmit = async (data: IRegisterInputs) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      const value = data[key as keyof IRegisterInputs];
      if (key == "profileImage" && value instanceof FileList) {

        if (value[0]) formData.append(key, value[0]);
      } else {
        formData.append(key, value as string);
      }
    });
    try {
       await axiosInstance.post('/portal/users',formData)
       toast.success("account created success")
       navigate('/auth/login')

    } catch (error) {
      toast.error("sorry failed")
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: "white", borderRadius: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 500, my: 1 }}>
        Sign up
      </Typography>
      <Typography variant="body1" sx={{ mb: 2, color: "#666" }}>
        If you have an account login. You can{" "}
        <Link
          to="/auth/login"
          style={{ color: "#7e3af2", textDecoration: "none" }}
        >
          Login here!
        </Link>
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2.5}>
          {/* User Name */}
          <TextField
            fullWidth
            label="Username *"
            {...register("userName", { required: "Username is required" })}
            error={!!errors.userName}
            helperText={errors.userName?.message}
          />

          {/* Phone Number */}
          <TextField
            fullWidth
            label="Phone Number *"
            {...register("phoneNumber", { required: "Phone is required" })}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber?.message}
          />

          {/* Country */}
          <TextField
            fullWidth
            label="Country *"
            {...register("country", { required: "Country is required" })}
            error={!!errors.country}
            helperText={errors.country?.message}
          />

          {/* Email */}
          <TextField
            fullWidth
            label="Email Address *"
            {...register("email", { required: "Email is required" })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          {/* Password */}
          <TextField
            fullWidth
            label="Password *"
            type={showPassword ? "text" : "password"}
            {...register("password", { required: "Password is required" })}
            error={!!errors.password}
            helperText={errors.password?.message}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Confirm Password */}
          <TextField
            fullWidth
            label="Confirm Password *"
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword", {
              required: "Confirm password is required",
              validate: (val) =>
                val === watch("password") || "Passwords do not match",
            })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Choose File Button  */}
          <Box>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUpload />}
              sx={{
                color: "#777",
                borderColor: "#ccc",
                textTransform: "uppercase",
                px: 3,
                py: 1,
              }}
            >
              CHOOSE FILE
              <input type="file" hidden {...register("profileImage")} />
            </Button>

            {watch("profileImage")?.[0] && (
              <Typography variant="caption" sx={{ ml: 2 }}>
                {watch("profileImage")[0].name}
              </Typography>
            )}
          </Box>

          {/* Register Button */}
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{
              bgcolor: "#1a73e8",
              py: 1,
              fontSize: ".8rem",
              fontWeight: "bold",
              mt: 1,
            }}
          >
            {isSubmitting ? "Creating acc..." : " REGISTER"}
          </Button>
        </Stack>
      </form>
    </Box>
  );
}
