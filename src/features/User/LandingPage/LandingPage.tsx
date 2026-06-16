import { Box } from "@mui/material";
import HeroSection from "./components/HeroSection";
import PopularAds from "./components/PopularAds";
import RoomsSection from "./components/HousesSection";
import HotelsSection from "./components/HotelsSection";
import AdsSection from "./components/AdsSection";
import HappyFamily from "./components/HappyFamily";
import Footer from "./components/Footer";

export default function LandingPage() {
  return (
    <Box
      component="main"
      sx={{ display: "flex", flexDirection: "column", gap: { xs: 6, md: 10 } }}
    >
      <HeroSection />

      <PopularAds />

      <RoomsSection />

      <HotelsSection />

      <AdsSection />

      <HappyFamily />

      <Footer />
    </Box>
  );
}
