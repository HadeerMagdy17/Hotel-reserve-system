
import { Box, Typography, Skeleton } from "@mui/material";
import fallbackImg from "../../../../assets/images/house1.jpg";
import { useQuery } from "@tanstack/react-query";  
import { axiosInstance } from "../../../../api/axiosInstace";
import CardItem from "../../Ui/shared/CardItem";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";


interface Room {
  _id: string;
  roomNumber: string;
  price: number;
  capacity: number;
  discount: number;
  images: string[];
}

interface IAds {
  _id: string;
  isActive: boolean;
  room: Room;
}

const fetchAllAds = async (): Promise<IAds[]> => {
  const response = await axiosInstance.get("/portal/ads");
  return response.data.data.ads;
};

export default function AdsSection() {
  //  إدارة حالة الداتا والـ loading والـ error بالكامل من خلال React Query
  const { data: ads = [], isLoading, isError } = useQuery<IAds[]>({
    queryKey: ["portalAds"], // مفتاح فريد لتخزين الكاش (Caching)
    queryFn: fetchAllAds,    // الدالة المسؤولة عن جلب البيانات
    staleTime: 1000 * 60 * 5, // البيانات تعتبر فريش لمدة 5 دقائق ولن يعيد طلبها طالما موجودة بالكاش
  });

  // إعدادات الـ Breakpoints الخاصة بـ Swiper للتجاوب مع الشاشات المختلفة
  const swiperBreakpoints = {
    0: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    600: {
      slidesPerView: 2,
      spaceBetween: 15,
    },
    900: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    1200: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
  };

  return (
    <Box sx={{ width: "85%", margin: "auto", padding: "20px 0" }}>
      {isLoading ? (
        <Skeleton
          variant="text"
          width="200px"
          height="40px"
          sx={{ marginLeft: "0.5rem" }}
        />
      ) : (
        <Typography
          variant="body1"
          component="h2"
          sx={{
            fontWeight: "500",
            fontSize: "1.5rem",
            marginBottom: "20px",
            color: "#152C5B",
          }}
        >
          Most popular ads
        </Typography>
      )}

      <Box className="slider-container" sx={{ overflow: "hidden" }}>
        {isLoading ? (
          <Box sx={{ display: "flex", gap: "20px" }}>
            {Array.from(new Array(4)).map((_, index) => (
              <Box key={index} sx={{ flex: 1, minWidth: "200px" }}>
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height="180px"
                  animation="wave"
                  sx={{ borderRadius: "15px", marginBottom: "10px" }}
                />
                <Skeleton variant="text" width="60%" height="25px" animation="wave" />
                <Skeleton variant="text" width="40%" height="20px" animation="wave" />
              </Box>
            ))}
          </Box>
        ) : isError ? (
          <Typography color="error" sx={{ textAlign: "center", py: 2 }}>
            Failed to load ads. Please try again later.
          </Typography>
        ) : (
          // السلايدر الفعلي شغال بـ Swiper ويعرض البيانات الكاشد من ريأكت كويري
          <Swiper
            modules={[Autoplay, Pagination]}
            breakpoints={swiperBreakpoints}
            loop={ads.length >= 4} // يلف لانهائي فقط لو الداتا كافية
            speed={4000} // سرعة الحركة الانسيابية المستمرة
            autoplay={{
              delay: 0, // حركة مستمرة دائمية (Linear Continuous Scroll)
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            style={{ paddingBottom: "25px" }} // مساحة في الأسفل للـ Dots
          >
            {ads.map((ad, index) => {
              //  تريكة الصورة الاحتياطية: لو المصفوفة فاضية أو اللينك مش موجود، استخدم الصورة البديلة فوراً
              const roomImage = ad.room.images && ad.room.images[0] ? ad.room.images[0] : fallbackImg;

              return (
                <SwiperSlide key={ad._id || index}>
                  <Box sx={{ paddingBlock: "10px" }}>
                    <CardItem
                      img={roomImage}
                      title={ad.room.roomNumber}
                      location={`${ad.room.price}$ Per Night`}
                      label={ad.isActive ? "active" : "inActive"}
                    />
                  </Box>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </Box>
    </Box>
  );
}