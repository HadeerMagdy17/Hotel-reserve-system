// src/views/admin/home/components/DashboardCharts.tsx

import { Box, Card, Typography, Stack, alpha } from "@mui/material";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from "recharts";

// ─── 1️⃣ مكون الـ Donut Chart ───────────────────────────────────────────
export const DonutCard = ({ data, total, legend, title }: any) => (
  <Card sx={{ p: 3, borderRadius: "16px", border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
    <Typography variant="h6" fontWeight={700} sx={{ mb: 2, textAlign: "center" }}>
      {title}
    </Typography>
    <Box sx={{ width: "100%", textAlign: "center" }}>
      <Box sx={{ position: "relative", width: "100%", height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius="65%"
              outerRadius="85%"
              paddingAngle={5}
              startAngle={90}
              endAngle={-270}
            >
              {data.map((d: any, i: number) => (
                <Cell key={i} fill={d.color} stroke="none" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
          <Typography variant="h4" fontWeight={700}>{Number(total).toLocaleString()}</Typography>
          <Typography variant="caption" color="text.secondary">Total</Typography>
        </Box>
      </Box>
      
      <Stack direction="row" sx={{justifyContent:"center"}} spacing={2} flexWrap="wrap" mt={2}>
        {legend.map((l: any, i: number) => (
          <Stack key={i} direction="row" sx={{alignItems:"center"}} spacing={0.5}>
            <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: l.color }} />
            <Typography variant="caption" color="text.secondary">
              {l.label}: {Number(l.value).toLocaleString()}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  </Card>
);

// ─── 2️⃣ مكون الـ Bar Chart ────────────────────────────────────────────
export const CustomBarChart = ({ data, colors, theme, title }: any) => (
  <Card sx={{ p: 3, borderRadius: "16px", border: "1px solid", borderColor: "divider", boxShadow: "none", height: "100%" }}>
    <Typography variant="h6" fontWeight={700} sx={{ mb: 4 }}>
      {title}
    </Typography>
    <Box sx={{ width: "100%", height: 240 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barSize={45}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
          <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} />
          <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: theme.palette.text.secondary, fontSize: 12 }} />
          <Tooltip cursor={{ fill: alpha(theme.palette.primary.main, 0.04) }} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((_: any, index: number) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  </Card>
);