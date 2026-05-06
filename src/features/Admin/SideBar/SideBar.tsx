import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import GridViewIcon from "@mui/icons-material/GridView";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ApiIcon from "@mui/icons-material/Api";
import KeyIcon from "@mui/icons-material/Key";
import LogoutIcon from "@mui/icons-material/Logout";

const SideBar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const theme = useTheme(); 
  const navigate = useNavigate();
  const location = useLocation(); // عشان نعرف إحنا في أنهي صفحة ونعمل Active Link

  const handleToggle = () => setIsCollapsed(!isCollapsed);

  const logOut = (): void => {
    localStorage.removeItem("token");
    navigate("/auth/login");
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        "& .ps-sidebar-container": {
          backgroundColor: `${theme.palette.primary.main} !important`,
          color: "#fff !important",
        },
        "& .ps-menu-button:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.1) !important",
        },
        "& .ps-active": {
          backgroundColor: "rgba(223, 207, 207, 0.2) !important",
          // borderLeft: "4px solid #fff",
        },
      }}
    >
      <Sidebar collapsed={isCollapsed} transitionDuration={500}>
        {/* Toggle */}
        <Box sx={{ p: 2, textAlign: isCollapsed ? "center" : "right" }}>
          <IconButton onClick={handleToggle} sx={{ color: "#fff" }}>
            {isCollapsed ? (
              <KeyboardDoubleArrowRightIcon />
            ) : (
              <KeyboardDoubleArrowLeftIcon />
            )}
          </IconButton>
        </Box>

        {!isCollapsed && (
          <Typography
            variant="h6"
            sx={{ px: 3, mb: 2, fontWeight: "bold", opacity: 0.8 }}
          >
            Staycation
          </Typography>
        )}

        <Menu>
          <MenuItem
            active={location.pathname === "/admin/home"}
            icon={<AccountBalanceIcon />}
            component={<Link to="/admin/home" />}
          >
            Home
          </MenuItem>

          <MenuItem
            active={location.pathname.includes("users")}
            icon={<PeopleAltIcon />}
            component={<Link to="users" />}
          >
            Users
          </MenuItem>

          <MenuItem
            active={location.pathname.includes("rooms")}
            icon={<GridViewIcon />}
            component={<Link to="rooms" />}
          >
            Rooms
          </MenuItem>

          <MenuItem
            active={location.pathname.includes("ads")}
            icon={<CardGiftcardIcon />}
            component={<Link to="ads" />}
          >
            Ads
          </MenuItem>

          <MenuItem
            active={location.pathname.includes("bookings")}
            icon={<ApiIcon />}
            component={<Link to="bookings" />}
          >
            Bookings
          </MenuItem>

          <MenuItem
            active={location.pathname.includes("facilities")}
            icon={<CalendarMonthIcon />}
            component={<Link to="facilities" />}
          >
            Facilities
          </MenuItem>

          <Box
            sx={{ mt: 4, pt: 2, borderTop: "1px solid rgba(255,255,255,0.1)" }}
          >
            <MenuItem
              active={location.pathname === "/change-password"}
              icon={<KeyIcon />}
              component={<Link to="/auth/change-password" />}
            >
              Change Password
            </MenuItem>

            <MenuItem
              onClick={logOut}
              icon={<LogoutIcon />}
              sx={{ color: theme.palette.secondary.main }}
            >
              Logout
            </MenuItem>
          </Box>
        </Menu>
      </Sidebar>
    </Box>
  );
};

export default SideBar;
