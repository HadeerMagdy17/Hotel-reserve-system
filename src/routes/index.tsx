import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "../layout/AuthLayout/AuthLayout";
import UserHome from "../features/User/UserHome/UserHome";
import Login from "../features/Auth/Login/Login";
import Register from "../features/Auth/Register/Register";
import ForgetPass from "../features/Auth/ForgetPass/ForgetPass";
import ResetPass from "../features/Auth/ResetPass/ResetPass";
import ChangePass from "../features/Auth/ChangePass/ChangePass";
import MasterLayout from "../layout/MasterLayout/MasterLayout";
import Home from "../features/Admin/Home/Home";
import Users from "../features/Admin/Users/Users";
import Rooms from "../features/Admin/Rooms/Rooms";
import AddNewRoom from "../features/Admin/Rooms/AddNewRoom/AddNewRoom";
import Ads from "../features/Admin/Ads/Ads";
import AddNewAd from "../features/Admin/Ads/AddNewAd/AddNewAd";
import Facilities from "../features/Admin/Facilities/Facilities";
import Bookings from "../features/Admin/Bookings/Bookings";
import UserMasterLayout from "../layout/UserMasterLayout/UserMasterLayout";
import ExplorePage from "../pages/ExplorePage/ExplorePage";
import FavoritesPage from "../pages/FavoritesPage/FavoritesPage";
import BookingDetails from "../features/User/Ui/BookingDetails/BookingDetails";
import Profile from "../features/User/Ui/Profile/Profile";
import NotFound from "../common/components/NotFound";

export const router = createBrowserRouter([
    {
        path:"/",
        element:<UserMasterLayout/>,
        children:[
            { index: true, element: <UserHome /> },
        ]
    },
  {
    path: "/auth",
    element: <AuthLayout />, //auth
    children: [
       //landing page
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forget-password", element: <ForgetPass /> },
      { path: "reset-password", element: <ResetPass /> },
      { path: "change-password", element: <ChangePass /> },
    ],
  },
  {
    path: "/admin",
    element: <MasterLayout />, //dashboard admin
    children: [
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
    {
    path: "/user",
    element: <UserMasterLayout />, //user
    children: [
      { path: "home", element: <UserHome /> },
      { path: "explore", element: <ExplorePage /> },
      { path: "fav", element: <FavoritesPage /> },
      { path: "booking-details/:bookingId", element: <BookingDetails /> },
      { path: "profile", element: <Profile /> },
    
    ],
  },
  {path:"*",element: <NotFound/>}
]);
