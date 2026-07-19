
import {
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  Paper,
  Container,
} from "@mui/material";
import { CardElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import Footer from "../../LandingPage/components/Footer";
import NavBar from "../../LandingPage/components/NavBar";

// 1. تهيئة الـ Stripe بمفتاح التشغيل
const stripePromise = loadStripe("pk_test_51OTjURBQWp069pqTmqhKZHNNd3kMf9TTynJtLJQIJDOSYcGM7xz3DabzCzE7bTxvuYMY0IX96OHBjsysHEKIrwCK006Mu7mKw8"
);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#424770",
      "::placeholder": { color: "#aab7c4" },
    },
    invalid: { color: "#fa755a" },
  },
  hidePostalCode: true,
};

function CompleteBookingDetailsContent() {
  const navigate = useNavigate();
  const { bookingId: paramBookingId } = useParams<{ bookingId: string }>();
  const location = useLocation();
  
  const bookingId = paramBookingId || location.state?.bookingId;

  const [activeStep, setActiveStep] = useState(0);
  const stripe = useStripe();
  const elements = useElements();

  const { register: regName, handleSubmit: handleName } = useForm();
  const { register: regPhone, handleSubmit: handlePhone } = useForm();

  const steps = ["Personal Info", "WhatsApp Number", "Payment"];

  // 🔥 الـ Mutation الخاصة بالدفع بالكامل (Stripe Token Generation + Backend Post)
  const paymentMutation = useMutation({
    mutationFn: async () => {
      if (!stripe || !elements) {
        throw new Error("Stripe is not fully loaded yet.");
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card details form not found.");
      }

      // أ) إنشاء الـ Token من Stripe أولاً
      const { token, error } = await stripe.createToken(cardElement);

      if (error) {
        throw new Error(error.message || "Failed to create payment token");
      }

      if (!token) {
        throw new Error("Invalid token received from Stripe.");
      }

      // ب) إرسال الـ Token للـ API الخاص بنا ثانياً
      const response = await axios.post(
        `https://upskilling-egypt.com:3000/api/v0/portal/booking/${bookingId}/pay`,
        { token: token.id },
        { headers: { Authorization: localStorage.getItem("token") } }
      );

      return response.data;
    },
    onSuccess: () => {
      toast.success("Payment Successful!");
      navigate("/pay-success");
    },
    onError: (error: any) => {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.message || "Payment Failed");
      } else {
        toast.error(error.message || "An unexpected error occurred.");
      }
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // تشغيل الـ Mutation
    paymentMutation.mutate();
  };

  return (
    <>
      <NavBar />
      <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            borderRadius: 4, 
            border: "1px solid #F3F3F3", 
            boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.03)" 
          }}
        >
          <Typography
            variant="h5"
            sx={{ mb: 4, textAlign: "center", fontWeight: 700, color: "#152C5B" }}
          >
            Complete Your Booking
          </Typography>

          {/* الـ Stepper */}
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
            {steps.map((label) => (
              <Step key={label} sx={{
                "& .MuiStepLabel-label": { fontWeight: 500, color: "#B0B0B0" },
                "& .Mui-active .MuiStepLabel-label": { color: "#152C5B", fontWeight: 600 },
                "& .Mui-completed .MuiStepLabel-label": { color: "#1ABC9C" },
                "& .MuiStepIcon-root": { color: "#E5E5E5" },
                "& .MuiStepIcon-root.Mui-active": { color: "#1ABC9C" },
                "& .MuiStepIcon-root.Mui-completed": { color: "#1ABC9C" },
              }}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Step 1: Name */}
          {activeStep === 0 && (
            <form onSubmit={handleName(() => setActiveStep(1))}>
              <TextField
                {...regName("name", { required: true })}
                fullWidth
                label="Full Name"
                sx={{ mb: 3 }}
              />
              <Button
                fullWidth
                variant="contained"
                type="submit"
                sx={{ 
                  bgcolor: "#1ABC9C", 
                  py: 1.5, 
                  fontWeight: 600, 
                  boxShadow: "none",
                  "&:hover": { bgcolor: "#148F77", boxShadow: "none" } 
                }}
              >
                Next
              </Button>
            </form>
          )}

          {/* Step 2: Phone */}
          {activeStep === 1 && (
            <form onSubmit={handlePhone(() => setActiveStep(2))}>
              <TextField
                {...regPhone("phone", { required: true })}
                fullWidth
                label="WhatsApp Number"
                sx={{ mb: 3 }}
              />
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => setActiveStep(0)}
                  sx={{ 
                    borderColor: "#E5E5E5", 
                    color: "#B0B0B0", 
                    fontWeight: 600,
                    "&:hover": { borderColor: "#B0B0B0", bgcolor: "#F9F9F9" } 
                  }}
                >
                  Back
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  sx={{ 
                    bgcolor: "#1ABC9C", 
                    fontWeight: 600, 
                    boxShadow: "none",
                    "&:hover": { bgcolor: "#148F77", boxShadow: "none" } 
                  }}
                >
                  Next
                </Button>
              </Box>
            </form>
          )}

          {/* Step 3: Payment */}
          {activeStep === 2 && (
            <form onSubmit={handleSubmit}>
              <Box
                sx={{ 
                  p: 2.5, 
                  border: "1px solid #E5E5E5", 
                  borderRadius: 2, 
                  mb: 3, 
                  bgcolor: "#fff",
                  "&:focus-within": { borderColor: "#1ABC9C" }
                }}
              >
                <CardElement options={CARD_ELEMENT_OPTIONS} />
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => setActiveStep(1)}
                  disabled={paymentMutation.isPending}
                  sx={{ 
                    borderColor: "#E5E5E5", 
                    color: "#B0B0B0", 
                    fontWeight: 600,
                    "&:hover": { borderColor: "#B0B0B0", bgcolor: "#F9F9F9" } 
                  }}
                >
                  Back
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  disabled={paymentMutation.isPending}
                  sx={{ 
                    bgcolor: "#1ABC9C", 
                    fontWeight: 600, 
                    boxShadow: "none",
                    "&:hover": { bgcolor: "#148F77", boxShadow: "none" },
                    "&:disabled": { bgcolor: "#AAB7C4" }
                  }}
                >
                  {paymentMutation.isPending ? "Processing..." : "Pay Now"}
                </Button>
              </Box>
            </form>
          )}
        </Paper>
      </Container>
      <Footer />
    </>
  );
}

// 2. الـ Export الرئيسي مغلف بالـ Elements Provider عشان الـ Hooks تشتغل بدون مشاكل
export default function CompleteBookingDetails() {
  return (
    <Elements stripe={stripePromise}>
      <CompleteBookingDetailsContent />
    </Elements>
  );
}