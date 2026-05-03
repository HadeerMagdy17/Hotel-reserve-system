
import { Box, Button, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../api/axiosInstace";
import { toast } from "react-toastify";
import type { IForgotPasswordInputs, IForgotPasswordResponse } from "../../../interface/AuthInterface";


export default function ForgetPassword() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IForgotPasswordInputs>({ defaultValues: { email: "" } });

  const onSubmit = async (data: IForgotPasswordInputs) => {
    try {
      const response = await axiosInstance.post<IForgotPasswordResponse>(
        '/portal/users/forgot-password', 
        data
      );
      
      toast.success(response.data.message || "OTP sent to your email!");
      
      // بنبعت الإيميل في الـ state عشان ميكتبهوش تاني هناك
      navigate("/auth/reset-password", { state: { email: data.email } });

    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    }
  };

  return (
    <Box sx={{ maxWidth: "100%", mx: "auto", mt: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
        Forgot Password
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
        Enter your email to receive a password reset code.
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          error={!!errors.email}
          helperText={errors.email?.message}
          sx={{ mb: 3 }}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
        />

        <Button
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          disabled={isSubmitting} // عشان اليوزر ميدوسش مرتين والطلب لسه بيتنفذ
          sx={{ py: 1.5, fontWeight: "bold" }}
        >
          {isSubmitting ? "Sending..." : "Send Code"}
        </Button>
      </form>
    </Box>
  );
}
