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
import { toast } from "react-toastify";

// Components
import RoomFeatures from "./components/RoomFeatures";
import BookingCalendar from "../shared/BookingCalender";
import ReviewCard from "./components/ReviewCard";
import ReviewForm from "./components/ReviewForm";
import LoginModal from "../../LandingPage/components/LoginModal";
import NavBar from "../../LandingPage/components/NavBar";
import Footer from "../../LandingPage/components/Footer";
import { useAppSelector } from "../../../../redux/store/hook";
import { axiosInstance } from "../../../../api/axiosInstace";

export default function RoomDetails() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  const token = useAppSelector((state) => state.auth.token);
  
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [isBookingLoading, setIsBookingLoading] = useState(false); // ⏳ حالة تحميل الحجز

  // 1. جلب تفاصيل الغرفة عبر React Query
  const {
    data: room,
    isLoading: isLoadingRoom,
    isError: isErrorRoom,
  } = useQuery({
    queryKey: ["roomDetails", roomId],
    queryFn: () => fetchRoomDetails(roomId!),
    enabled: !!roomId,
  });

  // 2. جلب التقييمات
  const getAllReviews = async () => {
    try {
      const response = await axiosInstance.get(`/portal/room-reviews/${roomId}`);
      setReviews(response.data.data.roomReviews);
    } catch (error) {
      console.error("Error fetching reviews", error);
    }
  };

  useEffect(() => {
    if (roomId) {
      getAllReviews();
    }
  }, [roomId]);

  // 3. 🔥 دالة ربط الحجز بالـ API والتحويل لصفحة الدفع
  const handleBookingSubmit = async (bookingData: {
    startDate: string;
    endDate: string;
    capacity: number;
    duration: number;
  }) => {
    // أمان إضافي لو الـ Token مش موجود نفتح المودال فوراً
    if (!token) {
      setIsLoginModalOpen(true);
      return;
    }

    if (!roomId) {
      toast.error("Room data is missing.");
      return;
    }

    setIsBookingLoading(true);

    try {
      // حساب السعر الإجمالي الإجمالي بناءً على الأيام والخصم المتاح للغرفة
      const priceAfterDiscount = room.price - room.price * ((room.discount || 0) / 100);
      const totalBookingPrice = Math.trunc(priceAfterDiscount * bookingData.duration);

      const response = await axiosInstance.post("/portal/booking", {
        startDate: bookingData.startDate, // الـ Component بيبعتها جاهزة yyyy-MM-dd
        endDate: bookingData.endDate,     // الـ Component بيبعتها جاهزة yyyy-MM-dd
        room: roomId,
        totalPrice: totalBookingPrice,
      });

      toast.success(response?.data?.message || "Booking created successfully!");

      // سحب الـ ID الحجز الجديد لتمريره لصفحة التأكيد أو الدفع
      const bookingId = response?.data?.data?.booking?._id;
      
      // التوجيه لصفحة تأكيد الحجز/الدفع مع إرسال الـ bookingId عبر الـ state
navigate(`/complete-booking/${bookingId}`, { state: { bookingId } });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data?.message || "Failed to complete booking.");
    } finally {
      setIsBookingLoading(false);
    }
  };

  const handleCloseModal = () => setIsLoginModalOpen(false);

  // ⏳ حالة الـ Loading للغرفة
  if (isLoadingRoom) {
    return (
      <Container maxWidth="xl" sx={{ py: 5 }}>
        <Skeleton variant="text" width="15%" height={25} sx={{ mb: 3 }} />
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Skeleton variant="text" width="30%" height={50} sx={{ mx: "auto", mb: 1 }} />
          <Skeleton variant="text" width="15%" height={25} sx={{ mx: "auto" }} />
        </Box>
        <Grid container spacing={2} sx={{mb: 5}}>
          <Grid  size={{ xs: 12 ,md:7}} >
            <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: "15px" }} />
          </Grid>
          <Grid  size={{ xs: 12,md:5 }} >
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
          <Typography variant="h4" fontWeight={700} sx={{ color: "#152C5B", mb: 1 }}>
            {room.roomNumber} Room
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 5 }}>
            Bogor, Indonesia
          </Typography>
        </Box>

        {/* Dynamic Gallery */}
        <Grid container spacing={2} sx={{ mb: 5 }}>
          <Grid  size={{ xs: 12 }} md={7}>
            <img src={mainImage} alt="Main Room" style={{ width: "100%", height: "400px", objectFit: "cover", borderRadius: "15px" }} />
          </Grid>
          <Grid  size={{ xs: 12 }} md={5}>
            <Grid container spacing={2}>
              <Grid  size={{ xs: 12 }}>
                <img src={displayedImages[1] || fallbackImg} alt="Sub 1" style={{ width: "100%", height: "192px", objectFit: "cover", borderRadius: "15px" }} />
              </Grid>
              <Grid  size={{ xs: 12 }}>
                <img src={displayedImages[2] || fallbackImg} alt="Sub 2" style={{ width: "100%", height: "192px", objectFit: "cover", borderRadius: "15px" }} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Layout الرئيسي */}
        <Grid container spacing={4}  sx={{ alignItems: "flex-start",mt:2 }}>
          <Grid  size={{ xs: 12 ,lg:7}}>
            <Box sx={{ mb: 4 }}>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Minimal techno is a minimalist subgenre of techno music. It is characterized by a stripped-down aesthetic.
              </Typography>
            </Box>
            <RoomFeatures />
          </Grid>

          {/* الكاليندر */}
          <Grid  size={{ xs: 12,lg:5 }}>
            <Box
              onClickCapture={(e) => {
                if (!token) {
                  e.stopPropagation();
                  e.preventDefault();
                  setIsLoginModalOpen(true);
                }
              }}
            >
              {/* تمرير الداتا والـ Handler للـ Reusable component بذكاء */}
              <BookingCalendar
                price={room.price}
                discount={room.discount || 0} // لو الـ Component عندك بيعرض الخصم
                buttonText={token ? (isBookingLoading ? "Processing..." : "Confirm Booking") : "Log in to Book"}
                onSubmit={handleBookingSubmit}
                disabled={isBookingLoading}
              />
            </Box>
          </Grid>
        </Grid>

        {/* قسم الـ Reviews */}
        {reviews.length > 0 && (
          <Grid container spacing={3}sx={{mt:5}}>
            {reviews.map((review: any) => (
              <Grid  size={{ xs: 12, md: 6,lg:4 }}  key={review._id || review.id}>
                <ReviewCard review={review} />
              </Grid>
            ))}
          </Grid>
        )}

        {/* نموذج إضافة الريفيو والتعليق */}
        {token ? (
          <Box sx={{mt:8}}>
            <ReviewForm roomId={room._id} getAllReviews={getAllReviews} />
          </Box>
        ) : (
          <Box sx={{ marginTop: "4rem", padding: "2rem", border: "1px solid", borderColor: "divider", borderRadius: "15px", textAlign: "center" }}>
            <Typography variant="h6" sx={{ color: "#152C5B", fontWeight: "600", mb: 1 }}>
              You must be logged in to leave a comment or review.
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Please <Link onClick={() => navigate("/auth/login")} sx={{ color: "#1ABC9C", cursor: "pointer", fontWeight: "600", mx: 0.5, textDecoration: "underline" }}>Log in</Link> 
              or <Link onClick={() => navigate("/auth/register")} sx={{ color: "#1ABC9C", cursor: "pointer", fontWeight: "600", mx: 0.5, textDecoration: "underline" }}>Register</Link> to add your review.
            </Typography>
          </Box>
        )}

        {/* الـ Login Modal */}
        <LoginModal open={isLoginModalOpen} onClose={handleCloseModal} />
      </Container>
      <Footer />
    </>
  );
}