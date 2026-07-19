import {
  Grid,
  Paper,
  Typography,
} from "@mui/material";

import BedIcon from "@mui/icons-material/Bed";
import WifiIcon from "@mui/icons-material/Wifi";
import BathtubIcon from "@mui/icons-material/Bathtub";

const features = [
  {
    title: "5 Bedrooms",
    icon: <BedIcon />,
  },
  {
    title: "3 Bathrooms",
    icon: <BathtubIcon />,
  },
  {
    title: "10 Mbps WiFi",
    icon: <WifiIcon />,
  },
    {
    title: "5 Bedrooms",
    icon: <BedIcon />,
  },
  {
    title: "3 Bathrooms",
    icon: <BathtubIcon />,
  },
  {
    title: "10 Mbps WiFi",
    icon: <WifiIcon />,
  },
  
];

export default function RoomFeatures() {
  return (
    <Grid container spacing={2} sx={{ m: 3 }}>
      {features.map((item,index) => (
        <Grid  size={{ xs: 12, md: 4 }} key={`feature-${index}`}>
          <Paper
            elevation={1}
            sx={{
              p: 2,
              textAlign: "center",
            }}
          >
            {item.icon}

            <Typography sx={{ mt: 1 }}>
              {item.title}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}