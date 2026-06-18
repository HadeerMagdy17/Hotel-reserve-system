import { Box, Rating, Typography } from "@mui/material";
import img from "../../../../assets/images/review.png";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

export default function HappyFamily() {
  const slidesData = [
    {
      img: img,
      title: "Happy Family",
      rating: 5,
      description:
        "What a great trip with my family and I should try again next time soon ...",
      author: "Angga, Product Designer",
    },
    {
      img: img,
      title: "Wonderful Experience",
      rating: 4.5,
      description:
        "This was an unforgettable experience with my family, truly a lifetime memory...",
      author: "Sarah, Marketing Manager",
    },
    {
      img: img,
      title: "Amazing Journey",
      rating: 5,
      description:
        "An amazing journey that brought our family closer. We will definitely do this again...",
      author: "Michael, Software Engineer",
    },
  ];

  return (
    <Box
      sx={{
        width: { xs: "95%", sm: "90%", md: "80%" },
        margin: "auto",
        paddingBlock: "4rem",
        "& .swiper-pagination-bullet": {
          backgroundColor: "#152C5B",
          opacity: 0.3,
        },
        "& .swiper-pagination-bullet-active": {
          backgroundColor: "#3252DF",  
          opacity: 1,
          width: "12px", // تكبير خفيف للنقطة النشطة للشياكة
          borderRadius: "6px",
        },
      }}
    >
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        style={{ paddingBottom: "3rem" }}  
      >
        {slidesData.map((slide, index) => (
          <SwiperSlide key={index}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: "center",
                gap: { xs: "2rem", md: "4rem" },
                paddingBottom: "1rem",
              }}
            >
{/* left side */}
              <Box
                sx={{
                  width: { xs: "100%", md: "45%" },
                  display: "flex",
                  justifyContent: { xs: "center", md: "flex-end" },
                }}
              >
                <Box
                  sx={{
                    width: { xs: "280px", sm: "360px" },
                    height: { xs: "380px", sm: "480px" },
                    border: "2px solid #E5E5E5",
                    borderRadius: "15px",
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                      right: "-30px",
                      top: "30px",
                    }}
                  >
                    <img
                      src={slide.img}
                      alt={slide.title}
                      style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "cover",
                        borderRadius: "20px 20px 105px 20px",
                      }}
                    />
                  </Box>
                </Box>
              </Box>

{/* right side */}
              <Box
                sx={{
                  width: { xs: "100%", md: "50%" },
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                <Typography
                  variant="h5"
                  component="h3"
                  sx={{
                    color: "#152C5B",
                    fontWeight: "600",
                    fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
                    marginBottom: "1rem",
                  }}
                >
                  {slide.title}
                </Typography>

                <Rating
                  name={`rating-${index}`}
                  value={slide.rating}
                  precision={0.5}
                  readOnly
                  sx={{
                    justifyContent: { xs: "center", md: "flex-start" },
                    mb: 2,
                  }}
                />

                <Typography
                  variant="h6"
                  component="p"
                  sx={{
                    color: "#152C5B",
                    fontWeight: "400",
                    fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" },
                    lineHeight: "1.6",
                    marginBottom: "1.5rem",
                  }}
                >
                  “{slide.description}”
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#B0B0B0",
                    fontWeight: "300",
                    fontSize: "1rem",
                  }}
                >
                  {slide.author}
                </Typography>
              </Box>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}