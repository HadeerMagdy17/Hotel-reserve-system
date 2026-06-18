import {
  Box,
  Grid as Grid,
  Skeleton,
  Typography,
  IconButton,
  CircularProgress
} from "@mui/material";
import  { useState } from "react"; 
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; 
import VisibilityIcon from "@mui/icons-material/Visibility";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../../api/axiosInstace";
import LoginModal from "./LoginModal";
import { PORTAL_URLS } from "../../../../api/endpoints";

// --- الـ Interfaces ---
interface RoomType {
  _id: string;
  roomNumber: string;
  images: string[];
  price: number;
}
interface AdsType {
  _id: string;
  room: RoomType;
}
interface ResponseType {
  data: {
    ads: AdsType[];
  };
}
interface FavoriType {
  _id: string;
  rooms: RoomType;
}

export default function MostPopularAds() {
  
  const navigate = useNavigate();
  const queryClient = useQueryClient(); 
  
  // 🔑 2. عمل الـ State الخاصة بفتح وقفل المودال جوه السيكشن عل طول
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // 1️⃣ جلب الإعلانات
  const { data: adsData, isLoading: isAdsLoading } = useQuery({
    queryKey: ["popularAds"],
    queryFn: async () => {
      const response = await axiosInstance.get<ResponseType>(PORTAL_URLS.ads, {
        params: { page: 1, size: 5 },
      });
      return response.data.data.ads || [];
    },
  });

  // 2️⃣ جلب المفضلة
  const { data: favoriteRooms = [] } = useQuery({
    queryKey: ["favoriteRooms"],
    queryFn: async () => {
      const response = await axiosInstance.get<{ data: { favoriteRooms: FavoriType[] } }>(
        PORTAL_URLS.favoriRoom
      );
      return response.data.data.favoriteRooms || [];
    },
    enabled: !!localStorage.getItem("token"), 
  });

  // 3️⃣ الـ Mutation
  const favoriteMutation = useMutation({
    mutationFn: async ({ roomId, isFav }: { roomId: string; isFav: boolean }) => {
      if (!isFav) {
        return await axiosInstance.post(PORTAL_URLS.favoriRoom, { roomId });
      } else {
        return await axiosInstance.delete(`${PORTAL_URLS.favoriRoom}/${roomId}`, {
          data: { roomId },
        });
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["favoriteRooms"] });
      toast.success(variables.isFav ? "Removed from favorites." : "Added to favorites successfully!");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  });

  const checkIfRoomInFavori = (id: string) => {
    return favoriteRooms.some((fav) => fav.rooms?._id === id);
  };

  // معالجة الضغط على القلب
  const handleFavClick = (roomId: string) => {
    const currentToken = localStorage.getItem("token");

    // 🔑 3. لو مفيش توكن، هنخلي الـ State بـ true عشان المودال يفتح فوراً
    if (!currentToken) {
      setIsLoginModalOpen(true); 
      return;
    }

    const isFav = checkIfRoomInFavori(roomId);
    favoriteMutation.mutate({ roomId, isFav });
  };

  const renderAdCard = (ad: AdsType, height: string | number) => {
    if (!ad || !ad.room) return null;
    const isFavorite = checkIfRoomInFavori(ad.room._id);
    const isMutatingThisRoom = favoriteMutation.isPending && favoriteMutation.variables?.roomId === ad.room._id;

    return (
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: height,
          borderRadius: "15px",
          overflow: "hidden",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.05)",
          "&:hover .overlay-actions": { opacity: 1 },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            backgroundColor: "#FF4D6D",
            color: "#fff",
            padding: "8px 24px",
            borderBottomLeftRadius: "15px",
            fontWeight: "500",
            fontSize: "1rem",
            zIndex: 3,
          }}
        >
          ${ad.room.price} <span style={{ fontWeight: "300", fontSize: "0.85rem" }}>Per Night</span>
        </Box>

        <img
          src={ad.room.images?.[0] || "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600"}
          alt={`Room ${ad.room.roomNumber}`}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />

        <Box sx={{ position: "absolute", bottom: "20px", left: "20px", zIndex: 3, color: "#fff" }}>
          <Typography variant="h6" sx={{ fontWeight: "600", textShadow: "1px 1px 3px rgba(0,0,0,0.6)" }}>
            Room {ad.room.roomNumber}
          </Typography>
        </Box>

        {/* Overlay Hover Actions */}
        <Box
          className="overlay-actions"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(21, 44, 91, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "15px",
            opacity: 0,
            transition: "opacity 0.3s ease",
            zIndex: 2,
          }}
        >
          <IconButton
            onClick={() => navigate(`/room-details/${ad.room._id}`)}
            sx={{ backgroundColor: "#fff", color: "#152C5B", "&:hover": { backgroundColor: "#f0f0f0" } }}
          >
            <VisibilityIcon />
          </IconButton>

          <IconButton
            onClick={() => handleFavClick(ad.room._id)}
            disabled={isMutatingThisRoom}
            sx={{ 
              backgroundColor: "#fff", 
              color: isFavorite ? "#FF4D6D" : "#152C5B", 
              "&:hover": { backgroundColor: "#f0f0f0" } 
            }}
          >
            {isMutatingThisRoom ? (
              <CircularProgress size={24} color="inherit" />
            ) : isFavorite ? (
              <FavoriteIcon />
            ) : (
              <FavoriteBorderIcon />
            )}
          </IconButton>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ width: "85%", margin: "auto", padding: "40px 0" }}>
      <Typography variant="h5" component="h2" sx={{ fontWeight: "600", fontSize: "1.5rem", marginBottom: "24px", color: "#152C5B" }}>
        Most popular ads
      </Typography>

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3} columns={12}>
          <Grid size={{ xs: 12, md: 5 }}>
            {isAdsLoading ? (
              <Skeleton variant="rectangular" width="100%" height={500} sx={{ borderRadius: "15px" }} />
            ) : (
              adsData?.[0] && renderAdCard(adsData[0], 500)
            )}
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Grid container spacing={3} columns={12}>
              {isAdsLoading
                ? Array.from(new Array(4)).map((_, index) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={index}>
                      <Skeleton variant="rectangular" width="100%" height={238} sx={{ borderRadius: "15px" }} />
                    </Grid>
                  ))
                : adsData?.slice(1, 5).map((ad: AdsType) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={ad._id}>
                      {renderAdCard(ad, 238)}
                    </Grid>
                  ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>

      {/* 🔑 4. استدعاء المودال فعلياً تحت في الـ JSX عشان يظهر في الـ DOM */}
      <LoginModal 
        open={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </Box>
  );
}