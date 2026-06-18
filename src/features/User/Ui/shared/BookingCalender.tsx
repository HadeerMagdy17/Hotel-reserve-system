
import  { useState } from "react";
import { Add, Remove } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
  FormHelperText,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

//  الاعتماد الكامل على date-fns  
import { format, differenceInDays, isBefore } from "date-fns";

interface BookingCalendarProps {
  price?: number; // نمرره في صفحة تفاصيل الغرفة فقط
  buttonText?: string; 
  onSubmit: (bookingData: { startDate: string; endDate: string; capacity: number; duration: number }) => void;
}

export default function BookingCalendar({ price, buttonText = "Explore", onSubmit }: BookingCalendarProps) {
  
  const [count, setCount] = useState(1);
  const [error, setError] = useState<string>("");

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleIncrease = () => setCount(count + 1);
  const handleDecrease = () => count > 1 && setCount(count - 1);

  //  حساب عدد الليالي تلقائياً بـ date-fns
  const duration = startDate && endDate ? differenceInDays(endDate, startDate) : 0;

  const handleFormSubmit = () => {
    if (!startDate || !endDate) {
      setError("Please pick both start and end dates.");
      return;
    }
    if (isBefore(endDate, startDate) || duration <= 0) {
      setError("End date must be after start date.");
      return;
    }

    setError("");
    
    // الفرمتة المطلوبة لإرسالها للباك إند (YYYY-MM-DD)
    onSubmit({
      startDate: format(startDate, "yyyy-MM-dd"),
      endDate: format(endDate, "yyyy-MM-dd"),
      capacity: count,
      duration,
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          border: price ? "1px solid #E5E5E5" : "none",
          borderRadius: price ? "15px" : "0px",
          padding: price ? "30px" : "0px",
          backgroundColor: "#fff",
          maxWidth: "450px",
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: "600", fontSize: "1.5rem", color: "#152C5B", mb: "1rem" }}>
          Start Booking
        </Typography>

        {price && (
          <Typography variant="h4" sx={{ color: "#1ABC9C", fontWeight: 500, mb: 3 }}>
            ${price} <span style={{ color: "#B0B0B0", fontSize: "16px", fontWeight: 300 }}>per night</span>
          </Typography>
        )}

        {/* خانات  التاريخ */}
        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: "15px", mb: "1rem" }}>
          <DatePicker
            label="Check-in Date"
            value={startDate}
            onChange={(newValue) => { setStartDate(newValue); setError(""); }}
            slotProps={{ textField: { fullWidth: true } }}
          />
          <DatePicker
            label="Check-out Date"
            value={endDate}
            onChange={(newValue) => { setEndDate(newValue); setError(""); }}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Box>

        {error && (
          <FormHelperText error sx={{ mb: "1rem" }}>
            {error}
          </FormHelperText>
        )}

        {/* الـ Capacity Counter */}
        <Typography variant="body2" sx={{ color: "#152C5B", mb: 1, fontWeight: 500 }}>
          How many persons?
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mb: "1.5rem" }}>
          <IconButton
            onClick={handleDecrease}
            sx={{
              width: "3.5rem",
              backgroundColor: "#E74C3C",
              borderRadius: "4px 0px 0px 4px",
              "&:hover": { backgroundColor: "#c0392b" },
            }}
          >
            <Remove sx={{ color: "#fff" }} />
          </IconButton>
          
          <TextField
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 0, textAlign: "center" } ,marginLeft:".5rem",marginRight:".5rem"}}
            value={`${count} person${count > 1 ? "s" : ""}`}
            slotProps={{ input: { readOnly: true } }}
          />
          
          <IconButton
            onClick={handleIncrease}
            sx={{
              width: "3.5rem",
              backgroundColor: "#1ABC9C",
              borderRadius: "0px 4px 4px 0px",
              "&:hover": { backgroundColor: "#16a085" },
            }}
          >
            <Add sx={{ color: "white" }} />
          </IconButton>
        </Box>

        {/* الحساب الإجمالي لصفحة تفاصيل الغرفة */}
        {price && duration > 0 && (
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, px: 1 }}>
            <Typography sx={{ color: "#B0B0B0" }}>Total Payment:</Typography>
            <Typography sx={{ fontWeight: 700, color: "#152C5B" }}>
              ${price * duration} <span style={{ fontWeight: 300, color: "#B0B0B0" }}>for {duration} nights</span>
            </Typography>
          </Box>
        )}

        <Button
          fullWidth
          variant="contained"
          sx={{
            backgroundColor: "#3252DF",
            color: "white",
            paddingBlock: "1rem",
            fontSize: "16px",
            fontWeight: "500",
            textTransform: "capitalize",
            "&:hover": { backgroundColor: "#233db7" }
          }}
          onClick={handleFormSubmit}
        >
          {buttonText}
        </Button>
      </Box>
    </LocalizationProvider>
  );
}