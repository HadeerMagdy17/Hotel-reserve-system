import React, { useState } from "react";
import { Box, Typography, IconButton, CircularProgress } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import LoginModal from "../../LandingPage/components/LoginModal";
import { toggleFavoriteRoom } from "../../../../services/userServices";

interface CardItemProps {
  id: string;         
  img: string;
  title: string;
  location?: string;
  price?: number;
  label?: string;
  isExplore?: boolean;
  isFavoriteInitially?: boolean; 
}

export default function CardItem({
  id,
  img,
  title,
  location,
  price,
  label,
  isExplore = false,
  isFavoriteInitially = false,
}: CardItemProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const favoriteMutation = useMutation({
    mutationFn: toggleFavoriteRoom,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["favoriteRooms"] });
      queryClient.invalidateQueries({ queryKey: ["exploreRooms"] });
      toast.success(variables.isFav ? "Removed from favorites." : "Added to favorites successfully!");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || "Something went wrong.");
    },
  });

  const handleFavClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    const currentToken = localStorage.getItem("token");

    if (!currentToken) {
      setIsLoginModalOpen(true);
      return;
    }

    favoriteMutation.mutate({ roomId: id, isFav: isFavoriteInitially });
  };

  const isMutatingThisRoom = favoriteMutation.isPending;

  return (
    <Box
      sx={{
        position: "relative",
        display: isExplore ? "block" : "inline-block",
        width: "100%",
        borderRadius: "15px",
        overflow: "hidden",
        boxShadow: isExplore ? "0px 4px 15px rgba(0, 0, 0, 0.05)" : "none",
        ...(isExplore && {
          "&:hover .hover-overlay": { opacity: 1 },
          "&:hover .room-title": { opacity: 1 },
        }),
      }}
    >
      <Box sx={{ position: "relative", height: "180px", width: "100%" }}>
        <img
          src={img}
          alt={title}
          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "15px" }}
        />

        {isExplore && price !== undefined && (
          <Box
            sx={{
              position: "absolute",
              top: "0",
              right: "0",
              backgroundColor: "#FF4D6D",
              color: "#fff",
              padding: "6px 16px",
              borderBottomLeftRadius: "15px",
              fontSize: "0.85rem",
              fontWeight: "bold",
              zIndex: 2,
            }}
          >
            {`$${price} Per Night`}
          </Box>
        )}

        {!isExplore && label && (
          <Box
            sx={{
              position: "absolute",
              top: "8px",
              right: "8px",
              backgroundColor: "#FF4D6D",
              color: "#fff",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "0.8rem",
              zIndex: 2,
            }}
          >
            {label}
          </Box>
        )}

        {isExplore && (
          <Box
            className="hover-overlay"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(21, 44, 91, 0.4)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "15px",
              opacity: 0,
              transition: "opacity 0.3s ease",
              borderRadius: "15px",
              zIndex: 1,
            }}
          >
            <IconButton
              onClick={() => navigate(`/room-details/${id}`)}
              sx={{ backgroundColor: "#fff", color: "#152C5B", "&:hover": { backgroundColor: "#f0f0f0" } }}
            >
              <VisibilityIcon />
            </IconButton>

            <IconButton
              onClick={handleFavClick}
              disabled={isMutatingThisRoom}
              sx={{
                backgroundColor: "#fff",
                color: isFavoriteInitially ? "#FF4D6D" : "#152C5B",
                "&:hover": { backgroundColor: "#f0f0f0" },
              }}
            >
              {isMutatingThisRoom ? (
                <CircularProgress size={24} color="inherit" />
              ) : isFavoriteInitially ? (
                <FavoriteIcon />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>

            <Typography
              className="room-title"
              variant="body1"
              sx={{
                position: "absolute",
                bottom: "15px",
                left: "15px",
                color: "#fff",
                fontWeight: "500",
                fontSize: "1.1rem",
                opacity: 0,
                transition: "opacity 0.3s ease",
              }}
            >
              Room {title}
            </Typography>
          </Box>
        )}
      </Box>

      {!isExplore && (
        <Box sx={{ margin: "8px" }}>
          <Typography variant="body1" component="h6" sx={{ fontWeight: "bold", color: "#152C5B" }}>
            {title}
          </Typography>
          {location && (
            <Typography variant="body2" component="p" sx={{ color: "#B0B0B0" }}>
              {location}
            </Typography>
          )}
        </Box>
      )}

      <LoginModal open={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </Box>
  );
}