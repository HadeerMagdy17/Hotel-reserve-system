// src/views/admin/home/components/StatCard.tsx
import React from "react";
import { Card, Typography } from "@mui/material";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}

export const StatCard = ({ icon, label, value }: StatCardProps) => (
  <Card
    sx={{
      bgcolor: "#c51bd8",
      color: "#fff",
      p: 3,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      borderRadius: 3,
      width: '350px',
      marginTop: "20px",
    }}
  >
    {icon}
    <Typography variant="h6" sx={{mt:1}}>{label}</Typography>
    <Typography variant="h4"  sx={{fontWeight:600}}>{Number(value).toLocaleString()}</Typography>
  </Card>
);