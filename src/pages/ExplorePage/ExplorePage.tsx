 import React from "react";
import { Box, Typography, Skeleton, Pagination } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import fallbackImg from "../../../src/assets/images/hotal3.jpg";
import CardItem from "../../features/User/Ui/shared/CardItem";
import NavBar from "../../features/User/LandingPage/components/NavBar";

import type { IRoomsResponse,FavoriType } from "../../interface/userTypes";
import { fetchExploreRooms, fetchFavoriteRooms } from "../../services/userServices";

export default function ExploreRooms() {
//save pagenation page num when refresh
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;


  const { data, isLoading, isError } = useQuery<IRoomsResponse>({
    queryKey: ["exploreRooms", page],
    queryFn: () => fetchExploreRooms(page),
    staleTime: 1000 * 60 * 5,
  });

  const roomsList = data?.rooms || [];
  const totalRooms = data?.totalCount || 0;
  const pageCount = Math.ceil(totalRooms / 8); 

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setSearchParams({ page: value.toString() }); 
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const { data: favoriteRooms = [] } = useQuery<FavoriType[]>({
  queryKey: ["favoriteRooms"],
  queryFn: fetchFavoriteRooms,  
  enabled: !!localStorage.getItem("token"), // الفحص مسجل دخول أو لا
});
 
  // تحسين الأداء بكاش ميمو للـ Set
  const favoriteRoomIdsSet = React.useMemo(() => {
    const ids = favoriteRooms.flatMap((fav) => 
      fav.rooms?.map((room) => room._id) || []
    );
    return new Set(ids);
  }, [favoriteRooms]);

  const checkIfRoomInFavori = React.useCallback((id: string) => {
    return favoriteRoomIdsSet.has(id);
  }, [favoriteRoomIdsSet]);

  return (
    <>
      <NavBar/>
      <Box sx={{ width: "85%", margin: "auto", padding: "4px 0" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 4 }}>
          <Typography variant="body2" sx={{ color: "#B0B0B0" }}>
            Home <span style={{ color: "#152C5B", fontWeight: "500", margin: "0 8px" }}>/</span> Explore
          </Typography>
        </Box>

        <Typography variant="h4" component="h1" sx={{ textAlign: "center", fontWeight: "bold", color: "#152C5B", my: 3 }}>
          Explore All Rooms
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#152C5B", mb: 3, mt: 5 }}>
          All Rooms
        </Typography>

        {isLoading ? (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr 1fr" }, gap: "25px" }}>
            {Array.from(new Array(8)).map((_, index) => (
              <Box key={index}>
                <Skeleton variant="rectangular" width="100%" height="180px" sx={{ borderRadius: "15px", mb: 1 }} />
                <Skeleton variant="text" width="60%" height="25px" />
              </Box>
            ))}
          </Box>
        ) : isError ? (
          <Typography color="error" sx={{ textAlign: "center", py: 4 }}>
            Failed to load rooms. Please try again later.
          </Typography>
        ) : (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr 1fr" }, gap: "25px" }}>
            {roomsList.map((room) => {
              const roomImage = room.images && room.images[0] ? room.images[0] : fallbackImg;
              const isFavorite = checkIfRoomInFavori(room._id);

              return (
                <CardItem
                  key={room._id}
                  id={room._id}  
                  img={roomImage}
                  title={room.roomNumber}
                  price={room.price}
                  isExplore={true}
                  isFavoriteInitially={isFavorite} 
                />
              );
            })}
          </Box>
        )}

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
      </Box>
    </>
  );
}