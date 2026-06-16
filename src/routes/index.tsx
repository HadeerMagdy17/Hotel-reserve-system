import { createBrowserRouter, Navigate } from "react-router-dom";

// 1. Layouts
import AuthLayout from "../layout/AuthLayout/AuthLayout";
import MasterLayout from "../layout/MasterLayout/MasterLayout";
import UserMasterLayout from "../layout/UserMasterLayout/UserMasterLayout";

// 2. Auth Features
import Login from "../features/Auth/Login/Login";
import Register from "../features/Auth/Register/Register";
import ForgetPass from "../features/Auth/ForgetPass/ForgetPass";
import ResetPass from "../features/Auth/ResetPass/ResetPass";
import ChangePass from "../features/Auth/ChangePass/ChangePass";

// 3. Admin Features
import Home from "../features/Admin/Home/Home";
import Users from "../features/Admin/Users/Users";
import Rooms from "../features/Admin/Rooms/Rooms";
import AddNewRoom from "../features/Admin/Rooms/AddNewRoom/AddNewRoom";
import Ads from "../features/Admin/Ads/Ads";
import AddNewAd from "../features/Admin/Ads/AddNewAd/AddNewAd";
import Facilities from "../features/Admin/Facilities/Facilities";
import Bookings from "../features/Admin/Bookings/Bookings";

// 4. User Features
import UserHome from "../features/User/LandingPage/LandingPage";
import ExplorePage from "../pages/ExplorePage/ExplorePage";
import FavoritesPage from "../pages/FavoritesPage/FavoritesPage";
import BookingDetails from "../features/User/Ui/BookingDetails/BookingDetails";
import Profile from "../features/User/Ui/Profile/Profile";

// 5. Shared Components
import NotFound from "../common/components/NotFound";
import ProtectedRoute from "../common/components/ProtectedRoute";

export const router = createBrowserRouter([
  // --- (Landing & User Home) ---
  {
    path: "/",
    element: <UserMasterLayout />,
    children: [
      { index: true, element: <UserHome /> }, // UserHome
      { path: "home", element: <UserHome /> },
     {
      element:<ProtectedRoute/>,
      children:[
         { path: "explore", element: <ExplorePage /> },
      { path: "fav", element: <FavoritesPage /> },
      { path: "booking-details/:bookingId", element: <BookingDetails /> },
      { path: "profile", element: <Profile /> },
      ]
     }
    ],
  },

  // --- (Auth) ---
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      // /auth يتحول فوراً لـ /auth/login
      { index: true, element: <Navigate to="login" replace /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forget-password", element: <ForgetPass /> },
      { path: "reset-password", element: <ResetPass /> },
      { path: "change-password", element: <ChangePass /> },
    ],
  },

  // ---(Admin Dashboard) ---
  {
    path: "/admin",
    element:<ProtectedRoute allowedRoles={['admin']}><MasterLayout /></ProtectedRoute> ,
    children: [
      // Redirect: لو دخل /admin يروح فوراً لـ /admin/home 
      { index: true, element: <Navigate to="home" replace /> },
      { path: "home", element: <Home /> },
      { path: "users", element: <Users /> },
      { path: "rooms", element: <Rooms /> },
      { path: "rooms/add-room", element: <AddNewRoom /> },
      { path: "ads", element: <Ads /> },
      { path: "ads/add-ad", element: <AddNewAd /> },
      { path: "facilities", element: <Facilities /> },
      { path: "bookings", element: <Bookings /> },
    ],
  },

  { path: "*", element: <NotFound /> },
]);