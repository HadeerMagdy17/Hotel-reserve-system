import React from "react";
import { Box, Typography, Skeleton, Pagination } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import fallbackImg from "../../../src/assets/images/hotal4.jpg";
import CardItem from "../../features/User/Ui/shared/CardItem";
import NavBar from "../../features/User/LandingPage/components/NavBar";
import { fetchFavoriteRooms } from "../../services/userServices";
import type { FavoriType } from "../../interface/userTypes";

export default function Favorites() {

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const itemsPerPage = 8; 

  const hasToken = !!localStorage.getItem("token");

  const { data: favoriteRooms = [], isLoading, isError } = useQuery<FavoriType[]>({
    queryKey: ["favoriteRooms"], 
    queryFn: fetchFavoriteRooms, 
    enabled: hasToken,
    staleTime: 0, 
  });

  const allFavoriteRooms = favoriteRooms?.flatMap(fav => fav.rooms || []) || [];
  
  const totalItems = allFavoriteRooms.length;
  const pageCount = Math.ceil(totalItems / itemsPerPage);
  
  const indexOfLastItem = page * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRooms = allFavoriteRooms.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setSearchParams({ page: value.toString() });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <NavBar />
      <Box sx={{ width: "85%", margin: "auto", padding: "4px 0" }}>
        {/* Breadcrumb Section */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 4 }}>
          <Typography variant="body2" sx={{ color: "#B0B0B0" }}>
            Home <span style={{ color: "#152C5B", fontWeight: "500", margin: "0 8px" }}>/</span> Favorites
          </Typography>
        </Box>

        {/* Header Titles */}
        <Typography variant="h4" component="h1" sx={{ textAlign: "center", fontWeight: "bold", color: "#152C5B", my: 3 }}>
          Your Favorite Rooms
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#152C5B", mb: 3, mt: 5 }}>
          Saved Items ({totalItems})
        </Typography>

        {/* 1. Loading State (Skeletons) */}
        {isLoading ? (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr 1fr" }, gap: "25px" }}>
            {Array.from(new Array(4)).map((_, index) => (
              <Box key={index}>
                <Skeleton variant="rectangular" width="100%" height="180px" sx={{ borderRadius: "15px", mb: 1 }} />
                <Skeleton variant="text" width="60%" height="25px" />
              </Box>
            ))}
          </Box>
        ) : /* 2. Error State */
        isError ? (
          <Typography color="error" sx={{ textAlign: "center", py: 4 }}>
            Failed to load your favorite rooms. Please try again.
          </Typography>
        ) : /* 3. Empty State */
        totalItems === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" sx={{ color: "#B0B0B0", mb: 2 }}>
              You haven't added any rooms to your favorites yet.
            </Typography>
          </Box>
        ) : /* 4. Data Success State */
        (
          <>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr 1fr" }, gap: "25px" }}>
              {currentRooms.map((room) => {
                if (!room) return null; 
                const roomImage = room.images && room.images[0] ? room.images[0] : fallbackImg;

                return (
                  <CardItem
                    key={room._id}
                    id={room._id}          
                    img={roomImage}
                    title={room.roomNumber}
                    price={room.price}
                    isExplore={true}       
                    isFavoriteInitially={true}    
                  />
                );
              })}
            </Box>

            {/* Pagination Controls */}
            {pageCount > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 6, mb: 4 }}>
                <Pagination 
                  count={pageCount} 
                  page={page} 
                  onChange={handlePageChange}
                  color="primary"
                  shape="rounded"
                  sx={{
                    "& .MuiPaginationItem-root": { color: "#152C5B", fontWeight: "500" },
                    "& .MuiPaginationItem-root.Mui-selected": {
                      backgroundColor: "#152C5B",
                      color: "#fff",
                      "&:hover": { backgroundColor: "#152C5B" }
                    }
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </>
  );
}