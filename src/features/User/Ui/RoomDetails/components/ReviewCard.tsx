import {
  Avatar,
  Card,
  CardContent,
  Typography,
  Rating,
  Stack,
  Box, // 👈 ضفنا الـ Box هنا
} from "@mui/material";

interface ReviewProps {
  review: {
    comment: string;
    rating: number;
    name: string;
  };
}

export default function ReviewCard({ review }: ReviewProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" spacing={2} sx={{alignItems:"flex-start"}} >
          <Avatar />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography sx={{ fontWeight: 600 }}>
              {review?.comment}
            </Typography>

            <Rating
              value={review?.rating || 0}
              readOnly
              size="small"
            />

            <Typography
              color="error"
              sx={{ fontWeight: 600 }}
            >
              {review?.name}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}