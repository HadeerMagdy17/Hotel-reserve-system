
import {
  Grid,
  TextField,
  Button,
  Rating,
  Typography,
} from "@mui/material";

export default function ReviewForm() {
  return (
    <Grid container spacing={4}  sx={{ m: 4 }}>
      <Grid item xs={12} md={6}>
        {/* 🎯 التعديل: نقلنا الـ mb جوة الـ sx */}
        <Typography  variant="h5" sx={{ mb: 2 }}>
          Rate the Room now 
        </Typography>

        <Rating />

        <TextField
          fullWidth
          multiline
          rows={5}
          sx={{ mt: 2 }}
        />

        <Button
          variant="contained"
          sx={{ mt: 2 }}
        >
          Rate
        </Button>
      </Grid>

      <Grid item xs={12} md={6}  sx={{ mb: 2 }}>
        {/* 🎯 التعديل: نقلنا الـ mb جوة الـ sx هنا كمان */}
        <Typography variant="h5" sx={{ mb: 2 }}>
          Add Your Comment
        </Typography>
      <Typography sx={{ mb: 3}}>
          you can add now !!!!!
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={5}
        />

        <Button
          variant="contained"
          sx={{ mt: 2 }}
        >
          Send
        </Button>
      </Grid>
    </Grid>
  );
}