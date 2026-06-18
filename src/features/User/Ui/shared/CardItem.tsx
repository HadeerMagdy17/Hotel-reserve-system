import { Box, Typography } from "@mui/material";

interface CardItemProps {
  img: string;
  title: string;
  location: string;
  label?: string;
}

export default function CardItem({
  img,
  title,
  location,
  label,
}: CardItemProps) {
  return (
    <Box sx={{ position: "relative", display: "inline-block" }}>
      <img
        src={img}
        alt={title}
        style={{
          width: "290px",
          height: "180px",
          borderRadius: "15px",
        }}
      />

      {label && (
        <Box
          sx={{
            position: "absolute",
            top: "8px",
            right: "8px",
            backgroundColor: "#FF498B",
            color: "#fff",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "0.8rem",
          }}
        >
          {label}
        </Box>
      )}

      <Box sx={{ margin: "8px" }}>
        <Typography
          variant="body1"
          component="h6"
          sx={{ fontWeight: "bold", color: "#152C5B" }}
        >
          {title}
        </Typography>
        <Typography variant="body2" component="p" sx={{ color: "#B0B0B0" }}>
          {location}
        </Typography>
      </Box>
    </Box>
  );
}