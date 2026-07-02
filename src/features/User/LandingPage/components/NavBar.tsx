
import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Link, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../../../redux/store/hook";
import { setLogout } from "../../../../redux/slices/authSlice";

export default function NavBar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  //  داتا الـ Auth من الـ Redux Slice
  const { user, token, role } = useAppSelector((state) => state.auth);

  const BaseNavBar = ["Home", "Explore"];
  
  const LoginUser = [
    { name: "Favorite", Routing: "fav" },
   
  ];
  
  const NotUser = ["register", "login"];

  const handleLogout = () => {
    dispatch(setLogout()); 
    navigate("/auth/login");
  };

  const createHandleMenuClick = (menuItem: string) => {
    return () => {
      if (menuItem === "Log out") {
        handleLogout();
      } 
    };
  };

  return (
    <AppBar sx={{ background: "white", boxShadow: "none", borderBottom: "1px solid #f1f1f1" }} position="static">
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Toolbar sx={{ p: { xs: 1, sm: 0 } }}>
          <Link to="/home" style={{ textDecoration: "none" }}>
            <Typography fontSize={"26px"} variant="h5" component="p" sx={{ fontWeight: 700, m: 0 }}>
              <span style={{ color: "#152C5B" }}>Stay</span>
              <span style={{ color: "#3252DF" }}>cation.</span>
            </Typography>
          </Link>
        </Toolbar>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", sm: "end" },
            flexWrap: "wrap",
            gap: "20px"
          }}
        >
          {BaseNavBar.map((title) => (
            <Link key={title} style={{ textDecoration: "none" }} to={`/${title}`}>
              <Typography
                color={title === "home" ? "rgba(50, 82, 223, 1)" : "black"}
               
                fontWeight={"500"}
                sx={{ cursor: "pointer", textTransform:"capitalize" }}
                fontSize={"16px"}
              >
                {title}
              </Typography>
            </Link>
          ))}

          {(role === "user" || role === "admin") && token ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {/* //logged user */}
              {LoginUser.map((title) => (
                <Link key={title.name} style={{ textDecoration: "none" }} to={`/${title.Routing}`}>
                  <Typography
                    fontWeight={"500"}
                    fontSize={"16px"}
                    sx={{ cursor: "pointer" }}
                    color="black"
                  >
                    {title.name}
                  </Typography>
                </Link>
              ))}
              
              <Avatar sx={{ width: 35, height: 35, bgcolor: "#df32bc", fontSize: "14px" }}>
                {user?.userName ? user.userName.charAt(0).toUpperCase() : "U"}
              </Avatar>

              <Box>
                <Button
                  id="user-nav-button"
                  aria-controls={openMenu ? 'user-nav-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={openMenu ? 'true' : undefined}
                  onClick={handleMenuOpen}
                  endIcon={<ArrowDropDownIcon />}
                  sx={{ 
                    color: 'black', 
                    textTransform: 'none', 
                    fontWeight: 600,
                    fontSize: '14px' 
                  }}
                >
                  {user?.userName || "User"}
                </Button>
                
                <Menu
                  id="user-nav-menu"
                  anchorEl={anchorEl}
                  open={openMenu}
                  onClose={handleMenuClose}
                  MenuListProps={{
                    'aria-labelledby': 'user-nav-button',
                  }}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  sx={{
                    '& .MuiPaper-root': {
                      borderRadius: '12px',
                      boxShadow: '0px 4px 20px rgba(0,0,0,0.08)',
                      minWidth: '150px'
                    }
                  }}
                >
                 
                
                  <MenuItem 
                    onClick={() => { handleMenuClose(); createHandleMenuClick("Log out")(); }} 
                    sx={{ color: "error.main", fontWeight: '500' }}
                  >
                    Log out
                  </MenuItem>
                   <MenuItem onClick={() => { 
    handleMenuClose(); 
    navigate("/auth/change-password"); 
  }}>
                    change Password
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
          ) : null}

          {/*  un logged user*/}
          {!token && (
            <Box sx={{ display: "flex", gap: "10px" }}>
              {NotUser.map((btn) => (
                <Link key={btn} to={`/auth/${btn}`} style={{ textDecoration: "none" }}>
                  <Button 
                    variant={btn === "login" ? "contained" : "text"} 
                    sx={{ 
                      textTransform: "capitalize",
                      bgcolor: btn === "login" ? "#3252DF" : "transparent",
                      color: btn === "login" ? "#fff" : "#152C5B",
                      fontWeight: 500,
                      '&:hover': {
                        bgcolor: btn === "login" ? "#233db7" : "rgba(21, 44, 91, 0.04)"
                      }
                    }}
                  >
                    {btn === "login" ? "Login Now" : "Register"}
                  </Button>
                </Link>
              ))}
            </Box>
          )}
        </Box>
      </Container>
    </AppBar>
  );
}
