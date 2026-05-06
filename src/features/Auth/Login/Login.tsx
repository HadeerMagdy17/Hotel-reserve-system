import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { axiosInstance } from "../../../api/axiosInstace";
import { setLogin } from "../../../redux/slices/authSlice";
import { toast } from "react-toastify";
import type {
  ILoginInputs,
  ILoginResponse,
} from "../../../interface/AuthInterface";
import { useAppDispatch } from "../../../redux/store/hook";
import AppTextField from "../../../common/components/AppTextField";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ILoginInputs>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: ILoginInputs) => {
    try {
      const response = await axiosInstance.post<ILoginResponse>(
        "/portal/users/login",
        data,
      );

      // فك البيانات اللي راجعة (Token & User info)
      const { token, user } = response.data.data;
      toast.success("Welcome Back! Login Successful");

      // 3. تحديث الـ Redux Store بالبيانات الجديدة
      // دي اللحظة اللي السيستم كله بيعرف فيها إن فيه يوزر دخل
      dispatch(
        setLogin({
          user: user,
          token: token,
          role: user.role, // admin أو user
        }),
      );

      if (user.role === "admin") {
        navigate("/admin/home"); // لو أدمن يروح لوحة التحكم
      } else {
        navigate("/"); // لو يوزر عادي يروح للـ Landing Page
      }
    } catch (error: any) {
      // 3. رسالة خطأ
      toast.error(error);
    }
  };

  return (
    <Box sx={{ maxWidth: "100%", mx: "auto", mt: 5 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Login
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Welcome back! Please enter your details.
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* حقل الإيميل مع الـ Validation */}

        <AppTextField
          label="Email"
          type="email"
          name="email"
          register={register}
          error={errors?.email}
          validation={{
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          }}
        />

        {/* حقل الباسورد */}
        <AppTextField
          label="Password"
          name="password"
          type="password"
          register={register}
          error={errors.password}
          // بننقل الـ Rules هنا
          validation={{
            required: "Password is required",
            minLength: { value: 6, message: "Min length is 6" },
          }}
        />

        <Box sx={{ textAlign: "right", mt: 1 }}>
          <Link
            to="/auth/forget-password"
            style={{ textDecoration: "none", color: "#1976d2" }}
          >
            Forgot Password?
          </Link>
        </Box>

        {/* زرار الدخول */}
        <Button
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          disabled={isSubmitting}
          sx={{ mt: 3, py: 1.5, fontWeight: "bold" }}
        >
          {isSubmitting ? <CircularProgress size={24} /> : "Login"}
        </Button>

        <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
          Don't have an account?{" "}
          <Link
            to="/auth/register"
            style={{ fontWeight: "bold", color: "#1976d2" }}
          >
            Sign up
          </Link>
        </Typography>
      </form>
    </Box>
  );
}
