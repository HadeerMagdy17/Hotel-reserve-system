

export default function ExplorePage() {
  return (
    <div>ExplorePage</div>
  )
}
// import {
//   Box,
//   Chip,
//   Grid as Grid,
//   Pagination,
//   Stack,
//   Skeleton,
//   Typography,
// } from "@mui/material";

// import { useLocation } from "react-router-dom";
// import { motion } from "framer-motion";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { useState, ReactNode, } from "react";

// import { AxiosError } from "axios";
// import { axiosInstance, getRoomDetails, PORTAL_URLS } from "../../api/axiosInstace";
// import { toast } from "react-toastify";

// // import { PhotoCard } from "../../../Components/AdminSharedComponents/PhotoCard/PhotoCard";
// // import {
// //   apiClient,
// //   getRoomDetails,
// //   PORTAL_URLS,
// // } from "../../../Api/END_POINTS";
// // import BasicBreadcrumbs from "../../../Components/UserSharedComponents/BasicBreadcrumbs/BasicBreadcrumbs";

// // --- الـ Interfaces المخصصة للداتا ---
// interface roomType {
//   _id: string;
//   roomNumber: string;
//   images: string[];
//   price: number;
// }

// interface FavoriType {
//   _id: string;
//   rooms: roomType; // بناءً على الـ API القديم بتاعك
// }

// interface AllRoomsResponseType {
//   data: {
//     rooms: roomType[];
//     totalCount: number;
//   };
// }

// interface PickerData {
//   state: { 
//     data: { rooms: roomType[]; totalCount: number };
//     startDate?: Date;
//     endDate?: Date;
//   } | null;
// }

// export default function Explore() {
//   const location: PickerData = useLocation();
//   const queryClient = useQueryClient();

//   // إدارة حالات الـ Pagination والـ Filters
//   const [page, setPage] = useState<number>(1);
//   const [size] = useState<number>(8);
//   const [selectedFilter, setSelectedFilter] = useState<"highest" | "lowest" | null>(null);

//   // فحص وجود التوكن بشكل ديناميكي
//   const hasToken = !!localStorage.getItem("token");

//   // 1️⃣ جلب جميع الغرف (Rooms Query)
//   const { data: roomsData, isLoading: isRoomsLoading } = useQuery({
//     queryKey: ["exploreRooms", page, size],
//     queryFn: async () => {
//       const response = await axiosInstance.get<AllRoomsResponseType>(getRoomDetails, {
//         params: { page, size },
//       });
//       return response.data.data;
//     },
//     // لو باصينا داتا من صفحة الـ Home (البحث)، نستخدمها كـ Initial Data بدل ما يضرب ريكويست فوراً
//     initialData: location.state?.data ? {
//       rooms: location.state.data.rooms,
//       totalCount: location.state.data.totalCount
//     } : undefined,
//     staleTime: 1000 * 60 * 5, // كاش لمدة 5 دقائق
//   });

//   const rooms = roomsData?.rooms || [];
//   const totalCount = roomsData?.totalCount || 0;

//   // 2️⃣ جلب غرف المفضلة (Favorite Rooms Query) - يشتغل فقط لو مسجل دخول
//   const { data: favoriteRooms = [] } = useQuery({
//     queryKey: ["favoriteRooms"],
//     queryFn: async () => {
//       const response = await axiosInstance.get<{ data: { favoriteRooms: FavoriType[] } }>(
//         PORTAL_URLS.favoriRoom
//       );
//       return response.data.data.favoriteRooms || [];
//     },
//     enabled: hasToken, // حماية الـ API من الضرب لو مفيش توكن
//   });

//   // 3️⃣ دالة الـ Toggle Favorite باستخدام useMutation
//   const favoriteMutation = useMutation({
//     mutationFn: async ({ roomId, action }: { roomId: string; action: "add" | "remove" }) => {
//       if (action === "add") {
//         return await axiosInstance.post(PORTAL_URLS.favoriRoom, { roomId });
//       } else {
//         return await axiosInstance.delete(`${PORTAL_URLS.favoriRoom}/${roomId}`, {
//           data: { roomId },
//         });
//       }
//     },
//     onMutate: () => {
//       return toast.loading("Processing...");
//     },
//     onSuccess: (response, variables, contextId) => {
//       // تحديث الكاش فوراً لضمان مزامنة الأيقونات في الأبلكيشن بالكامل
//       queryClient.invalidateQueries({ queryKey: ["favoriteRooms"] });
//       toast.success(response.data?.message || "Favorites updated successfully!", {
//         id: contextId,
//       });
//     },
//     onError: (error: AxiosError<{ message?: string }>, variables, contextId) => {
//       toast.error(error.response?.data?.message || "Something went wrong.", {
//         id: contextId,
//       });
//     }
//   });

//   // فحص هل الغرفة داخل المفضلة
//   const checkIfRoomInFavori = (id: string) => {
//     return favoriteRooms.some((fav) => fav.rooms?._id === id);
//   };

//   // دالة الـ Toggle عند الضغط على القلب
//   const handleFavoriteToggle = (roomId: string) => {
//     // 🔒 لو مش مسجل، امنعي الريكويست فوراً وتقدري تفتحي مودال الـ Login هنا
//     if (!hasToken) {
//       toast.error("Please login first to manage your favorites!");
//       return;
//     }

//     const isFav = checkIfRoomInFavori(roomId);
//     favoriteMutation.mutate({
//       roomId,
//       action: isFav ? "remove" : "add",
//     });
//   };

//   // ترتيب الغرف محلياً بناءً على الفلتر المختار
//   const getSortedRooms = () => {
//     if (!selectedFilter) return rooms;
//     return [...rooms].sort((a, b) =>
//       selectedFilter === "highest" ? b.price - a.price : a.price - b.price
//     );
//   };

//   const sortedRooms = getSortedRooms();

//   return (
//     <Box sx={{ width: "85%", margin: "auto", padding: "20px 0" }}>
//       {/* سيكشن الهيدر والـ Breadcrumbs */}
//       <Box>
      

//           <Grid size={{ xs: 12, sm: 6 }} sx={{ textAlign: "center" }}>
//             <Typography
//               variant="h5"
//               component={"h2"}
//               sx={{
//                 fontWeight: "600",
//                 fontSize: "2.1rem",
//                 color: "#152C5B",
//                 marginBlock: { xs: "0.5rem", sm: "1rem" },
//               }}
//             >
//               {location.state?.startDate && location.state?.endDate
//                 ? `${new Date(location.state.startDate).toLocaleDateString()} - ${new Date(location.state.endDate).toLocaleDateString()} Available Rooms`
//                 : "Explore All Rooms"}
//             </Typography>
//           </Grid>
//           <Grid size={{ xs: false, sm: 3 }}></Grid>
//         </Grid>
//       </Box>

//       {/* سيكشن الفلاتر (Chips) */}
//       // <Box sx={{ marginBlock: "1.5rem" }}>
//       //   <Stack direction="row" spacing={1}>
//       //     <Chip
//       //       label="Lowest Price"
//       //       clickable
//       //       color={selectedFilter === "lowest" ? "primary" : "default"}
//       //       onClick={() => setSelectedFilter(selectedFilter === "lowest" ? null : "lowest")}
//       //     />
//       //     <Chip
//       //       label="Highest Price"
//       //       clickable
//       //       color={selectedFilter === "highest" ? "primary" : "default"}
//       //       onClick={() => setSelectedFilter(selectedFilter === "highest" ? null : "highest")}
//       //     />
//       //   </Stack>
//       // </Box>

//       // <Typography
//       //   variant="body1"
//       //   sx={{
//       //     paddingBottom: "16px",
//       //     paddingTop: "20px",
//       //     color: "#152C5B",
//       //     fontWeight: "700",
//       //   }}
//       // >
//       //   All Rooms
//       // </Typography>

//       {/* عرض الكروت أو الـ Skeletons أثناء التحميل */}
//       <Grid container spacing={3}>
//         {isRoomsLoading
//           ? Array.from(new Array(8)).map((_, index) => (
//               <Grid size={{ xs: 12, md: 4, lg: 3 }} key={index}>
//                 <Skeleton
//                   variant="rectangular"
//                   width="100%"
//                   height={250}
//                   sx={{ borderRadius: "15px", marginBottom: "10px" }}
//                 />
//                 <Skeleton variant="text" width="60%" />
//                 <Skeleton variant="text" width="40%" />
//               </Grid>
//             ))
//           : sortedRooms?.map((room: roomType, index) => (
//               <Grid size={{ xs: 12, md: 4, lg: 3 }} key={room._id}>
//                 <OpacityAnimate delay={index * 0.05}>
//                   <PhotoCard
//                     value={room}
//                     eyeIcon
//                     isFavorite={checkIfRoomInFavori(room._id)}
//                     isLoading={favoriteMutation.isPending && favoriteMutation.variables?.roomId === room._id}
//                     onToggleFavorite={() => handleFavoriteToggle(room._id)}
//                   />
//                 </OpacityAnimate>
//               </Grid>
//             ))}
//       </Grid>

//       {/* الـ Pagination الذكي مدمج مع الـ State وبيرندر بناء على الـ Total Count القادم من السيرفر */}
//       {totalCount > 0 && (
//         <Pagination
//           onChange={(_, value) => setPage(value)}
//           page={page}
//           count={Math.ceil(totalCount / size)}
//           color="primary"
//           sx={{ marginTop: "40px", display: "flex", justifyContent: "center" }}
//         />
//       )}
//     </Box>
//   );
// }

// // مكون الحركة بموشن فريمر
// const OpacityAnimate = ({ children, delay }: { children: ReactNode; delay: number }) => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 15 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{
//         type: "tween",
//         duration: 0.4,
//         delay: delay,
//       }}
//     >
//       {children}
//     </motion.div>
//   );
// };
