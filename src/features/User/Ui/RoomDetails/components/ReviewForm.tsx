import {
  Grid,
  TextField,
  Button,
  Rating,
  Typography,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { postRoomComment, postRoomReview } from "../../../../../services/userServices";

interface ReviewFormProps {
  roomId: string | undefined;
  getAllReviews: () => void;
}

export default function ReviewForm({ roomId, getAllReviews }: ReviewFormProps) {
  const [rating, setRating] = useState<number | null>(0);
  const [review, setReview] = useState("");
  const [comment, setComment] = useState("");

  const isReviewError = review.trim().length > 0 && review.trim().length < 10;
  const isCommentError = comment.trim().length > 0 && comment.trim().length < 10;

  // 1. الـ Mutation الخاصة بالـ Review (Rate)
  const reviewMutation = useMutation({
    mutationFn: () => postRoomReview({ roomId, rating, review }),
    onSuccess: (data) => {
      toast.success(data?.message || "Review added successfully!");
      setReview("");
      setRating(0);
      getAllReviews(); // لتحديث القائمة
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "An error occurred");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  });

  // 2. الـ Mutation الخاصة بالـ Comment
  const commentMutation = useMutation({
    mutationFn: () => postRoomComment({ roomId, comment }),
    onSuccess: (data) => {
      toast.success(data?.message || "Comment added successfully!");
      setComment("");
      getAllReviews(); // لتحديث القائمة
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "An error occurred");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  });

  // دوال الـ Submit بقت نظيفة وسهلة جداً ومسؤولة عن الـ Validation والتشغيل فقط
  const handleRate = () => {
    if (review.trim().length < 10) {
      toast.error("Please enter a valid review (at least 10 characters)");
      return;
    }
    reviewMutation.mutate();
  };

  const handleComment = () => {
    if (comment.trim().length < 10) {
      toast.error("Please enter a valid comment (at least 10 characters)");
      return;
    }
    commentMutation.mutate();
  };

  return (
    <Grid container spacing={4} sx={{ m: 4 }}>
      {/* ---------------- الجزء الشمال: الـ Rate ---------------- */}
      <Grid  size={{ xs: 12, md: 6 }}>
        <Typography variant="h5" sx={{ mb: 2, color: "#152C5B", fontWeight: "600" }}>
          Rate the Room now
        </Typography>
        <Rating value={rating} onChange={(_, newValue) => setRating(newValue)} />
        <TextField
          fullWidth
          multiline
          rows={5}
          sx={{ mt: 2 }}
          label="Your Review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          error={isReviewError}
          helperText={isReviewError ? "Must be 10+ characters" : ""}
        />
        <Button 
          variant="contained" 
          sx={{ mt: 2, px: 5, bgcolor: "#1ABC9C", '&:hover': { bgcolor: "#148F77" } }} 
          onClick={handleRate}
          disabled={reviewMutation.isPending} // تعطيل الزرار وقت الـ Loading تلقائياً!
        >
          {reviewMutation.isPending ? "Rating..." : "Rate"}
        </Button>
      </Grid>

      {/* ---------------- الجزء اليمين: الـ Comment ---------------- */}
      <Grid  size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ mb: 2, color: "#152C5B", fontWeight: "600" }}>
          Add Your Comment
        </Typography>
        <Typography sx={{ mb: 3, color: "#B0B0B0" }}>
          you can add now !!!!!
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={5}
          label="Your Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          error={isCommentError}
          helperText={isCommentError ? "Must be 10+ characters" : ""}
        />
        <Button 
          variant="contained" 
          sx={{ mt: 2, px: 5, bgcolor: "#1ABC9C", '&:hover': { bgcolor: "#148F77" } }} 
          onClick={handleComment}
          disabled={commentMutation.isPending} // تعطيل الزرار وقت الـ Loading تلقائياً!
        >
          {commentMutation.isPending ? "Sending..." : "Send"}
        </Button>
      </Grid>
    </Grid>
  );
}