import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Stack,
  Breadcrumbs,
  Link,
  FormHelperText,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

// Services & Interfaces
import { createAd } from "../../../../services/adsService";
import { fetchRoomsList } from "../../../../services/roomsService"; 
import type { IAdPayload } from "../../../../interface/Ads";

// بنضيف الـ discount هنا في نوع الـ FormInput
interface IFormInput {
  room: string;
  isActive: string; 
  discount: number; 
}

export default function AddNewAd() {
  const navigate = useNavigate();

  // 1. جلب قائمة الغرف المتاحة
  const { data: roomsData, isLoading: isLoadingRooms } = useQuery({
    queryKey: ["rooms-list-select"],
    queryFn: () => fetchRoomsList(1, 100),
  });

  // 2. الـ Mutation الخاص بإنشاء الإعلان
  const { mutate: performCreate, isPending: isCreating } = useMutation({
    mutationFn: (payload: IAdPayload) => createAd(payload),
    onSuccess: () => {
      toast.success("Ad Created Successfully");
      navigate("/admin/ads"); 
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error creating ad");
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      room: "",
      isActive: "false",  
      discount: 0,
    },
  });

  const onSubmit = (data: IFormInput) => {
    const payload: IAdPayload & { discount: number } = {
      room: data.room,
      isActive: data.isActive === "true", 
      discount: Number(data.discount), // التأكيد على تحويلها لـ Number عشان الباك إند ما يضربش
    };
    performCreate(payload);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3 }}>
        <Link underline="hover" color="inherit" href="#" onClick={() => navigate("/admin/ads")}>
          Ads
        </Link>
        <Typography color="text.primary">Create Ad</Typography>
      </Breadcrumbs>

      <Card sx={{ maxWidth: 800, mx: "auto", boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)", borderRadius: "12px" }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
            Create New Advertisement
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
            Please fill in the details below to publish a new advertisement.
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              
              {/* 1. دروب داون رقم الغرفة (Room Number) */}
              <FormControl fullWidth error={!!errors.room}>
                <InputLabel id="room-select-label">Room Number</InputLabel>
                <Controller
                  name="room"
                  control={control}
                  rules={{ required: "Room number is required" }}
                  render={({ field }) => (
                    <Select
                      labelId="room-select-label"
                      label="Room Number"
                      disabled={isLoadingRooms}
                      {...field}
                    >
                      {isLoadingRooms ? (
                        <MenuItem disabled>Loading rooms...</MenuItem>
                      ) : (
                        roomsData?.rooms?.map((room: any) => (
                          <MenuItem key={room._id} value={room._id}>
                            {room.roomNumber} - ({room.price} EGP)
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  )}
                />
                {errors.room && <FormHelperText>{errors.room.message}</FormHelperText>}
              </FormControl>

              {/* 2. دروب داون حالة النشاط (Active) */}
              <FormControl fullWidth>
                <InputLabel id="active-select-label">Active</InputLabel>
                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => (
                    <Select labelId="active-select-label" label="Active" {...field}>
                      <MenuItem value="true">Yes</MenuItem>
                      <MenuItem value="false">No</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>

              <Controller
                name="discount"
                control={control}
                rules={{ 
                  required: "Discount is required",
                  min: { value: 0, message: "Discount cannot be negative" }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Discount"
                    type="number"
                    fullWidth
                    error={!!errors.discount}
                    helperText={errors.discount?.message}
                  />
                )}
              />

              {/* أزرار التحكم */}
              <Stack direction="row" spacing={2} sx={{justifyContent: "flex-end" , mt: 2 }} >
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => navigate("/admin/ads")}
                  disabled={isCreating}
                  sx={{ textTransform: "none", fontWeight: "bold", px: 4, borderRadius: "8px" }}
                >
                  CANCEL
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isCreating}
                  sx={{ textTransform: "none", fontWeight: "bold", px: 4, borderRadius: "8px" }}
                >
                  {isCreating ? "SAVING..." : "ADD"}
                </Button>
              </Stack>

            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}