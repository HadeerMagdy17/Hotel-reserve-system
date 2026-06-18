
import { Box, Typography, Skeleton } from "@mui/material";
import React from "react";
import img1 from "../../../../assets/images/house1.jpg";
import img2 from "../../../../assets/images/house2.jpg";
import img3 from "../../../../assets/images/house3.jpg";
import img4 from "../../../../assets/images/house4.jpg";
import img5 from "../../../../assets/images/house5.jpg";
import img6 from "../../../../assets/images/house1.jpg";
// 🔑 استيراد Swiper وموديل الـ Autoplay والـ Pagination
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// 🔑 استيراد ملفات الـ CSS الخاصة بسوايبر
import "swiper/css";
import "swiper/css/pagination";
import CardItem from "../../Ui/shared/CardItem";

const imageData = [
  {
    img: img1,
    title: "Tabby Town",
    location: "Gunung Batu, Indonesia",
    label: "Popular Choice",
  },
  {
    img: img2,
    title: "Anggana",
    location: "Bogor, Indonesia",
  },
  {
    img: img3,
    title: "Seattle Rain",
    location: "Jakarta, Indonesia",
  },
  {
    img: img4,
    title: "Wodden Pit",
    location: "Wonosobo, Indonesia",
  },
  {
    img: img5,
    title: "Sunset Resort",
    location: "Bali, Indonesia",
    label: "Popular Choice",
  },
  {
    img: img6,
    title: "Anggana",
    location: "Bali, Indonesia",
  },
];

export default function Houses() {
  
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1700);

    return () => clearTimeout(timer);
  }, []);

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
      {loading ? (
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
          Houses with beauty backyard
        </Typography>
      )}

      <Box className="slider-container" sx={{ overflow: "hidden" }}>
        {loading ? (
          // ⏳ حالة الـ Skeleton Loading أثناء التحميل
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
        ) : (
          // 🎉 السلايدر الفعلي شغال بـ Swiper
          <Swiper
            modules={[Autoplay, Pagination]}
            breakpoints={swiperBreakpoints}
            loop={true} // عشان يلف بشكل مستمر ودائم بدون توقف
            speed={4000} // سرعة الحركة الناعمة المستمرة
            autoplay={{
              delay: 0, // 🔑 صفر تعني حركة خطية مستمرة (Linear Continuous Scrolling) بدون وقفات
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true, // بيخلي النقط شكلها شيك ومتجاوب في الشاشات الصغيرة
            }}
            style={{ paddingBottom: "25px" }} // مساحة مخصصة تحت للكروت عشان الـ Pagination تظهر براحتها
          >
            {imageData.map((item, index) => (
              <SwiperSlide key={index}>
                <Box sx={{ paddingBlock: "10px" }}>
                  <CardItem
                    img={item.img}
                    title={item.title}
                    location={item.location}
                    label={item.label}
                  />
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </Box>
    </Box>
  );
}
