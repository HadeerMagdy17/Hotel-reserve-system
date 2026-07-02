import {
  Box,
  Container,
  Grid,
  Typography,
  Breadcrumbs,
  Link,
  Skeleton,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

import { fetchRoomDetails } from "../../../../services/userServices";
import fallbackImg from "../../../../../src/assets/images/hotal2.jpg";
import { AxiosError } from "axios";

// Components
import RoomFeatures from "./components/RoomFeatures";
import BookingCalendar from "../shared/BookingCalender";
import ReviewCard from "./components/ReviewCard";
import ReviewForm from "./components/ReviewForm";
import { axiosInstance } from "../../../../api/axiosInstace";
import { PORTAL_URLS } from "../../../../api/endpoints";
import LoginModal from "../../LandingPage/components/LoginModal";
import NavBar from "../../LandingPage/components/NavBar";
import Footer from "../../LandingPage/components/Footer";
import { useAppSelector } from "../../../../redux/store/hook";


export default function RoomDetails() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  const token = useAppSelector((state) => state.auth.token);
  
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [reviews, setReviews] = useState([]);

  // get room details
  const {
    data: room,
    isLoading: isLoadingRoom,
    isError: isErrorRoom,
  } = useQuery({
    queryKey: ["roomDetails", roomId],
    queryFn: () => fetchRoomDetails(roomId!),
    enabled: !!roomId,
  });
//get Reviews
  const getAllReviews = async () => {
    try {
      const response = await axiosInstance.get(
        `${PORTAL_URLS.getAllReviews}/${roomId}`,
      );
      setReviews(response.data.data.roomReviews);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
    }
  };

  useEffect(() => {
    if (roomId) {
      getAllReviews();
    }
  }, [roomId]);

  // التحكم في أكشن زرار الحجز
  const handleBookingSubmit = (bookingData: {
    startDate: string;
    endDate: string;
    capacity: number;
    duration: number;
  }) => {
    if (!token) {
      setIsLoginModalOpen(true);
      return;
    }

    console.log("Data to send to API:", {
      roomId: roomId,
      ...bookingData,
    });
  };

  const handleCloseModal = () => setIsLoginModalOpen(false);

  // ⏳ حالة الـ Loading
  if (isLoadingRoom) {
    return (
      <Container maxWidth="xl" sx={{ py: 5 }}>
        <Skeleton variant="text" width="15%" height={25} sx={{ mb: 3 }} />
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Skeleton variant="text" width="30%" height={50} sx={{ mx: "auto", mb: 1 }} />
          <Skeleton variant="text" width="15%" height={25} sx={{ mx: "auto" }} />
        </Box>
        <Grid container spacing={2} mb={5}>
          <Grid item xs={12} md={7}>
            <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: "15px" }} />
          </Grid>
          <Grid item xs={12} md={5}>
            <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: "15px" }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  // ❌ حالة الخطأ
  if (isErrorRoom || !room) {
    return (
      <Typography color="error" sx={{ textAlign: "center", mt: 5, fontWeight: "bold" }}>
        Failed to load room details. Please try again later.
      </Typography>
    );
  }

  const displayedImages =
    room.images && room.images.length > 0
      ? room.images
      : [fallbackImg, fallbackImg, fallbackImg];
      
  const mainImage = displayedImages[0];

  return (
    <>
      <NavBar />
      <Container maxWidth="xl" sx={{ py: 5 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Typography color="text.primary">Room Details</Typography>
        </Breadcrumbs>

        {/* Dynamic Title & Location */}
        <Box sx={{ textAlign: 'center', margin: '20px' }}>
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ color: "#152C5B", mb: 1, textAlign: "center" }}
          >
            {room.roomNumber} Room
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 5, textAlign: "center" }}>
            Bogor, Indonesia
          </Typography>
        </Box>

        {/* 🖼️ Dynamic Gallery */}
        <Grid container spacing={2} sx={{ m: 5 }}>
          <Grid item xs={12} md={7}>
            <img
              src={mainImage}
              alt="Main Room"
              style={{
                width: "100%",
                height: "400px",
                objectFit: "cover",
                borderRadius: "15px",
              }}
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <img
                  src={displayedImages[1] || fallbackImg}
                  alt="Sub 1"
                  style={{
                    width: "100%",
                    height: "192px",
                    objectFit: "cover",
                    borderRadius: "15px",
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <img
                  src={displayedImages[2] || fallbackImg}
                  alt="Sub 2"
                  style={{
                    width: "100%",
                    height: "192px",
                    objectFit: "cover",
                    borderRadius: "15px",
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* 🛠️ الـ Layout الرئيسي */}
        <Grid container spacing={4} mt={2} sx={{ alignItems: "flex-start" }}>
          <Grid item xs={12} lg={7}>
            <Box sx={{ m: 4 }}>
              {[...Array(7)].map((_, i) => (
                <Typography key={i} color="text.secondary" sx={{ mb: 2 }}>
                  Minimal techno is a minimalist subgenre of techno music. It is
                  characterized by a stripped-down aesthetic.
                </Typography>
              ))}
            </Box>
            <RoomFeatures />
          </Grid>

          {/* الكاليندر محمي بـ onClickCapture لمنع الـ Submit الداخلي */}
          <Grid item xs={12} lg={5}>
            <Box
              onClickCapture={(e) => {
                if (!token) {
                  e.stopPropagation();
                  e.preventDefault();
                  setIsLoginModalOpen(true);
                }
              }}
            >
              <BookingCalendar
                price={room.price}
                buttonText={token ? "Confirm Booking" : "Log in to Book"}
                onSubmit={handleBookingSubmit}
              />
            </Box>
          </Grid>
        </Grid>

        {/* 💬 قسم الـ Reviews */}
        {reviews.length > 0 && (
          <Grid container spacing={3} mt={5}>
            {reviews.map((review: any) => (
              <Grid item xs={12} md={6} lg={4} key={review._id || review.id}>
                <ReviewCard review={review} />
              </Grid>
            ))}
          </Grid>
        )}

        {/* 🔐 التشييك على إضافة الكومنت أو الـ Review Form الجديد */}
        {token ? (
          <Box mt={8}>
            <ReviewForm roomId={room._id} getAllReviews={getAllReviews} />
          </Box>
        ) : (
          <Box
            sx={{
              marginTop: "4rem",
              padding: "2rem",
              border: "1px solid",
              borderColor: (theme) => theme.palette.divider,
              borderRadius: "15px",
              backgroundColor: (theme) => theme.palette.background.paper,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "#152C5B",
                fontWeight: "600",
                marginBottom: "0.5rem",
              }}
            >
              You must be logged in to leave a comment or review.
            </Typography>
            <Typography variant="body1" sx={{ color: "#B0B0B0" }}>
              Please{" "}
              <Typography
                component="span"
                variant="body1"
                sx={{
                  color: "#1ABC9C",
                  cursor: "pointer",
                  fontWeight: "600",
                  mx: "0.3rem",
                  textDecoration: "underline",
                }}
                onClick={() => navigate("/auth/login")}
              >
                Log in
              </Typography>
              or{" "}
              <Typography
                component="span"
                variant="body1"
                sx={{
                  color: "#1ABC9C",
                  cursor: "pointer",
                  fontWeight: "600",
                  mx: "0.3rem",
                  textDecoration: "underline",
                }}
                onClick={() => navigate("/auth/register")}
              >
                Register
              </Typography>{" "}
              to add your review.
            </Typography>
          </Box>
        )}

        {/* الـ Login Modal الخاص بكم */}
        <LoginModal 
          open={isLoginModalOpen} 
          onClose={handleCloseModal} 
        />
      </Container>
      <Footer />
    </>
  );
}