
// export default function HotelsSection() {
//   return (
//     <div>HotelsSection</div>
//   )
// }
import { Box, Typography, Skeleton } from "@mui/material";
import React from "react";
import img1 from "../../../../assets/images/hotal1.jpg";
import img2 from "../../../../assets/images/hotal2.jpg";
import img3 from "../../../../assets/images/hotal3.jpg";
import img4 from "../../../../assets/images/hotal4.jpg";
import img5 from "../../../../assets/images/hotal5.jpg";
import img6 from "../../../../assets/images/hotal1.jpg";
// import CardItem from "../CardItem/CardItem";

// 🔑 استيراد مكونات وموديلات Swiper الأساسية
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// 🔑 استيراد ملفات الـ CSS الخاصة بـ Swiper
import "swiper/css";
import "swiper/css/pagination";
import CardItem from "../../Ui/shared/CardItem";

const imageData = [
  {
    img: img1,
    title: "Green Park",
    location: "Tangerang, Indonesia",
    label: "Popular Choice",
  },
  {
    img: img2,
    title: "Sunset Resort",
    location: "Bali, Indonesia",
  },
  {
    img: img3,
    title: "Mountain View",
    location: "Bandung, Indonesia",
    label: "Popular Choice",
  },
  {
    img: img4,
    title: "Mountain View",
    location: "Bandung, Indonesia",
    label: "Popular Choice",
  },
  {
    img: img5,
    title: "Sunset Resort",
    location: "Bali, Indonesia",
  },
  {
    img: img6,
    title: "Sunset Resort",
    location: "Bali, Indonesia",
  },
];

export default function Hotels() {
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1700);

    return () => clearTimeout(timer);
  }, []);

  // 🔑 إعدادات الشاشات التفاعلية (Breakpoints) المتوافقة تماماً مع أبعاد الموبايل والديسك توب
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
          Hotels with large living rooms
        </Typography>
      )}

      <Box className="slider-container" sx={{ overflow: "hidden" }}>
        {loading ? (
          // ⏳ هيكل الـ Skeleton النظيف جنب بعضه أثناء التحميل لتجنب مشاكل الـ DOM المذبذب
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
          // 🎉 السلايدر الفعلي المدعوم بـ Swiper
          <Swiper
            modules={[Autoplay, Pagination]}
            breakpoints={swiperBreakpoints}
            loop={true} // يضمن استمرارية الدوران اللانهائي للكروت
            speed={4000} // سرعة انتقال ناعمة جداً ومريحة للعين
            autoplay={{
              delay: 0, // 🔑 جعل الـ delay بصفر يعطيكِ الحركة الخطية المستمرة (Linear Continuous Scrolling)
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true, // نقط متفاعلة تصغر وتكبر بشكل شيك جداً على الموبايل
            }}
            style={{ paddingBottom: "25px" }} // مساحة مخصصة للـ Pagination بالأسفل
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
