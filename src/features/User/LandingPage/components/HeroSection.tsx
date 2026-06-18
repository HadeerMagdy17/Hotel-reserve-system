import { Box, Typography, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import img from "../../../../assets/images/hero.png";
import { toast } from "react-toastify";
import BookingCalendar from "../../Ui/shared/BookingCalender";
import NavBar from "./NavBar";
import { axiosInstance } from "../../../../api/axiosInstace";
import { useMutation } from "@tanstack/react-query";
import { getRoomDetails } from "../../../../api/endpoints";

interface BookingData {
  startDate: string;
  endDate: string;
  capacity: number;
}

export default function HeroSection() {
  const navigate = useNavigate();

  const searchRoomsMutation = useMutation({
    mutationFn: async (bookingData: BookingData) => {
      const response = await axiosInstance.get(getRoomDetails, {
        params: {
          startDate: bookingData.startDate,
          endDate: bookingData.endDate,
          capacity: bookingData.capacity,
        },
      });
      return {
        rooms: response.data?.data?.rooms || response.data?.data || [],
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
      };
    },
    onSuccess: (data) => {
      toast.success("Rooms fetched successfully! Loading available options...");
      
      navigate("/explore", { state: data });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMessage = error.response?.data?.message || error.message || "Something went wrong!";
      toast.error(errorMessage);
    }
  });

  const handleBookingSubmit = (bookingData: BookingData) => {
    //  تشغيل الـ mutation وتمرير داتا التواريخ والسعة لها
    searchRoomsMutation.mutate(bookingData);
  };

  return (
    <>
      <NavBar />
      <Box
        sx={{
          width: { xs: "92%", md: "85%" },
          maxWidth: "1400px",
          marginInline: "auto",
          marginBlock: "20px",
          padding: { xs: "10px 0", sm: "20px 0" },
        }}
      >
        <Grid
          container
          spacing={2}
          alignItems="center"
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          {/* left side */}
          <Grid item xs={12} sm={8}>
            <Typography
              variant="h1"
              sx={{
                fontWeight: "700",
                fontSize: { xs: "1.5rem", sm: "2.625rem" },
                marginBottom: ".2rem",
                color: "#152C5B",
                lineHeight: "1.2",
              }}
            >
              Forget Busy Work, <br /> Start Next Vacation
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: "300",
                fontSize: "1rem",
                marginBottom: "1.5rem",
                color: "#B0B0B0",
                lineHeight: "1.7rem",
              }}
            >
              We provide what you need to enjoy your holiday with family. <br />{" "}
              Time to make another memorable moment.
            </Typography>

            <BookingCalendar
              buttonText={
                searchRoomsMutation.isPending ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Explore"
                )
              }
              onSubmit={handleBookingSubmit}
            />
          </Grid>

         {/* right side */}
          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                width: { xs: "90%", sm: "80%" },
                height: "490px",
                border: "2px solid #E5E5E5",
                borderRadius: "15px",
                position: "relative",
                marginTop: { xs: "6rem", sm: "2.5rem" },
                marginInline: { xs: "2.5rem" },
                minWidth: "400px",
              }}
            >
              <img
                src={img}
                alt="Hero Vacation"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "105px 20px 20px 20px",
                  position: "absolute",
                  bottom: "40px",
                  right: "40px",
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
    