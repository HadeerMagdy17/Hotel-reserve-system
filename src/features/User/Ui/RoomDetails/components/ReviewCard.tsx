import {
  Avatar,
  Card,
  CardContent,
  Typography,
  Rating,
  Stack,
  Box,
} from "@mui/material";

interface ReviewProps {
  review: {
    comment?: string;
    review?: string; // الـ API ساعات بيبعتها كده
    rating: number;
    name?: string;
    user?: {
      userName: string;
    };
  };
}

export default function ReviewCard({ review }: ReviewProps) {
  // 2. 🔥 حيلة الـ Fallback لتحديد النص المتاح فعلياً من الـ API
  const textMessage = review?.review || review?.comment || "No text provided";
  const reviewerName = review?.user?.userName || review?.name || "Anonymous User";

  return (
    <Card sx={{ height: '100%', boxShadow: "0px 4px 10px rgba(0,0,0,0.05)", borderRadius: "10px" }}>
      <CardContent>
        <Stack direction="row" spacing={2} sx={{ alignItems: "flex-start" }}>
          {/* الـ Avatar هيعرض أول حرف من اسم المستخدم ديناميكياً */}
          <Avatar sx={{ bgcolor: "#1ABC9C" }}>
            {reviewerName.charAt(0).toUpperCase()}
          </Avatar>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {/* اسم المستخدم (الـ Sender) */}
            <Typography sx={{ fontWeight: 600, color: "#152C5B" }}>
              {reviewerName}
            </Typography>

            {/* عدد النجوم الديناميكي بناءً على الـ API */}
            <Rating
              value={review?.rating || 0}
              readOnly
              size="small"
            />

            {/* نص الكومنت أو الريفيو نفسه */}
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1, lineHeight: 1.5 }}
            >
              {textMessage}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}