
import { useQuery } from "@tanstack/react-query";
import { Box, Card, Typography, Grid, useTheme, alpha, Skeleton } from "@mui/material";
import GridViewIcon from "@mui/icons-material/GridView";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import GroupIcon from "@mui/icons-material/Group";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from "recharts";

// Services & Interfaces
import { fetchRoomsList } from "../../../services/roomsService";
import { fetchBookingsList } from "../../../services/bookingService";
import { fetchUsersList } from "../../../services/userService"; 
import { StatCard } from "./components/statCard";
import { DonutCard } from "./components/DashboardsCharts";


interface IBooking { status?: string; [key: string]: unknown; }
interface IRoomsResponse { totalCount: number; }
interface IBookingsResponse { totalCount: number; booking: IBooking[]; }
interface IUsersResponse { totalCount: number; }

export default function AdminHome() {
  const theme = useTheme();

  // 1️⃣ جلب البيانات باستخدام React Query
  const { data: roomsDataFromApi, isLoading: isLoadingRooms } = useQuery({
    queryKey: ["rooms-dashboard"],
    queryFn: () => fetchRoomsList(1, 100),
  });

  const { data: bookingDataFromApi, isLoading: isLoadingBookings } = useQuery({
    queryKey: ["bookings-dashboard"],
    queryFn: () => fetchBookingsList(1, 100),
  });

  const { data: usersDataFromApi, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users-dashboard"],
    queryFn: () => fetchUsersList(1, 100), 
  });

  // حالة التحميل الإجمالية
  const isLoading = isLoadingRooms || isLoadingBookings || isLoadingUsers;

  // 2️⃣ معالجة الداتا (Derived Stats) مع الحماية ضد الـ undefined
  const totalRooms = (roomsDataFromApi as IRoomsResponse)?.totalCount ?? 0;
  const totalUsers = (usersDataFromApi as IUsersResponse)?.totalCount ?? 0;

  const allBookingsList: IBooking[] = (bookingDataFromApi as IBookingsResponse)?.booking ?? [];
  const totalBookings = (bookingDataFromApi as IBookingsResponse)?.totalCount ?? 0;
  
  const pendingBookingsCount = allBookingsList.filter(
    (b) => b.status?.toLowerCase() === "pending"
  ).length;
  const completedBookingsCount = totalBookings - pendingBookingsCount;

  // 3️⃣ تجهيز داتا الشارتات
  const bookingsPieData = [
    { value: pendingBookingsCount, color: "#1D9E75" },
    { value: completedBookingsCount, color: "#D85A30" },
  ];
   const bookingssPieData = [
    { value: pendingBookingsCount, color: "#1d2c9e" },
    { value: completedBookingsCount, color: "#30a6d8" },
  ];

  const barChartData = [
    { name: "Rooms", value: totalRooms },
    { name: "Pending Bookings", value: pendingBookingsCount },
  ];

  const barColors = [theme.palette.primary.main, theme.palette.warning.main];

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" fontWeight={700} mb={0.5}>Welcome Back, Admin! 👋</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>Dashboard Analysis</Typography>

      {/* 💡 IMPROVEMENT: الـ Skeletons أثناء التحميل لمنع الـ Layout Shift */}
      <Grid container spacing={3}>
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Grid size={{ xs: 12, sm: 4 }}  key={i}>
              <Skeleton variant="rounded" height={140} sx={{ borderRadius: 3, marginTop: "20px" }} />
            </Grid>
          ))
        ) : (
          <>
            <Grid size={{ xs: 12, sm: 4 }}>
              <StatCard icon={<GridViewIcon fontSize="large" />} label="Rooms" value={totalRooms} />
            </Grid>
            <Grid size={{ xs: 12,  sm: 4  }}>
              <StatCard icon={<PendingActionsIcon fontSize="large" />} label="Booking Pending" value={pendingBookingsCount} />
            </Grid>
            <Grid size={{ xs: 12,  sm: 4  }}>
              <StatCard icon={<GroupIcon fontSize="large" />} label="Users" value={totalUsers} />
            </Grid>
          </>
        )}
      </Grid>

      <Box sx={{ borderTop: "1px solid", borderColor: "divider", my: 4 }} />

      <Grid container spacing={4}>
        {isLoading ? (
          <>
            <Grid  size={{ xs: 12, md: 6 }}><Skeleton variant="rounded" height={300} sx={{ borderRadius: "16px" }} /></Grid>
            <Grid  size={{ xs: 12, md: 6 }}><Skeleton variant="rounded" height={300} sx={{ borderRadius: "16px" }} /></Grid>
          </>
        ) : (
          <>
            {/* 1. الـ Donut Chart للحجوزات */}
            <Grid  size={{ xs: 12, md: 6 }}>
              <DonutCard
                title="Bookings Status Ratio"
                data={bookingsPieData}
                total={totalBookings}
                legend={[
                  { label: "Pending", value: pendingBookingsCount, color: "#1D9E75" },
                  { label: "Completed", value: completedBookingsCount, color: "#D85A30" },
                ]}
              />
            </Grid>

            {/* 2. الـ Bar Chart للمقارنة */}
            <Grid  size={{ xs: 12, md: 6 }} sx={{ display: "flex", flexDirection: "column" }}>
              <Card sx={{ p: 3, borderRadius: "16px", border: "1px solid", borderColor: "divider", boxShadow: "none", height: "100%" }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 4 }}>
                  Rooms vs Pending Bookings
                </Typography>
                <Box sx={{ width: "100%", height: 240 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData} barSize={45}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                      <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} />
                      <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} />
                      <Tooltip cursor={{ fill: alpha(theme.palette.primary.main, 0.04) }} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {barChartData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={barColors[index]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Card>
            </Grid>

{/* 3 pie */}
              <Grid  size={{ xs: 12, md: 6 }}>
              <DonutCard
                title="ads Ratio"
                data={bookingssPieData}
                total={totalBookings}
                legend={[
                  { label: "Pending", value: pendingBookingsCount, color: "#1d1d9e" },
                  { label: "Completed", value: completedBookingsCount, color: "#30d0d8" },
                ]}
              />
            </Grid>
          </>
          
        )}
      </Grid>
    </Box>
  );
}