import React, { useState } from "react";
import { 
  Box, Button, Grid, Paper, MenuItem, Select, FormControl, 
  InputLabel, FormHelperText, Stack, useTheme, Container, 
  Chip
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import { toast } from "react-toastify";
import { axiosInstance } from "../../../../api/axiosInstace";
import AppTextField from "../../../../common/components/AppTextField";
import { fetchFacilitiesList } from "../../../../services/facilitiesService";

interface IFacility { _id: string; name: string; }

const AddNewRoom = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [previews, setPreviews] = useState<string[]>([]);

  const { data: facilitiesData } = useQuery({
    queryKey: ["facilities-all"],
    queryFn: () => fetchFacilitiesList(1, 100),
  });

  const { register, handleSubmit, control, formState: { errors }, setValue } = useForm({
    defaultValues: {
      roomNumber: "",
      price: "",
      capacity: "",
      discount: "",
      facilities: [] as string[],
      imgs: null as FileList | null,
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();
      formData.append("roomNumber", data.roomNumber);
      formData.append("price", data.price);
      formData.append("capacity", data.capacity);
      formData.append("discount", data.discount);

      data.facilities.forEach((id: string) => formData.append("facilities", id));

      if (data.imgs) {
        Array.from(data.imgs).forEach((file: File) => formData.append("imgs", file));
      }

      return axiosInstance.post("/admin/rooms", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
    },
    onSuccess: () => {
      toast.success("Room Created Successfully");
      navigate("/admin/rooms");
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Error creating room")
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setValue("imgs", files);
      const fileArray = Array.from(files).map((file) => URL.createObjectURL(file));
      setPreviews(fileArray);
    }
  };

  const onSubmit = (data: any) => mutate(data);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 5, borderRadius: '16px', boxShadow: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>

            {/* Row 1 */}
            <Grid item xs={12} md={6}>
              <AppTextField 
                label="Room Number" 
                name="roomNumber" 
                register={register} 
                validation={{ required: "Room number is required" }} 
                error={errors.roomNumber}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <AppTextField 
                label="Price ($)" 
                name="price" 
                type="number" 
                register={register} 
                validation={{ required: "Price is required" }} 
                error={errors.price}
              />
            </Grid>

            {/* Row 2 */}
            <Grid item xs={12} md={6}>
              <AppTextField 
                label="Capacity" 
                name="capacity" 
                type="number" 
                register={register} 
                validation={{ required: "Capacity is required" }} 
                error={errors.capacity}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <AppTextField 
                label="Discount (%)" 
                name="discount" 
                type="number" 
                register={register} 
                validation={{ required: "Discount is required" }} 
                error={errors.discount}
              />
            </Grid>

            {/* Facilities - مع Scroll */}
            <Grid item xs={12} md={6}>
           <FormControl fullWidth error={!!errors.facilities} sx={{ mt: 1 }}>
                <InputLabel id="facilities-label">Facilities</InputLabel>
                <Controller
                  name="facilities"
                  control={control}
                  rules={{ required: "At least one facility is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="facilities-label"
                      id="facilities-multiple"
                      multiple
                      label="Facilities" 
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200, 
                            width: 250,
                          },
                        },
                      }}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {(selected as string[]).map((value) => {
                            // التعديل هنا للقراءة من الـ Array الصحيح اللي راجع من السيرفس (facilitiesData.facilities)
                            const facility = facilitiesData?.facilities?.find((f: any) => f._id === value);
                            return <Chip key={value} label={facility?.name || value} size="small" />;
                          })}
                        </Box>
                      )}
                    >
                      {/* السيرفس بترجع الداتا جواها أوبجكت فيه مصفوفة اسمها facilities */}
                      {facilitiesData?.facilities?.map((f: IFacility) => (
                        <MenuItem key={f._id} value={f._id}>
                          {f.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                <FormHelperText>{errors.facilities?.message}</FormHelperText>
              </FormControl>
            </Grid>

            {/* Upload Images */}
            <Grid item xs={12}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                sx={{ 
                  width: '100%', 
                  py: 3.5, 
                  borderStyle: 'dashed', 
                  borderWidth: 2,
                  backgroundColor: '#f8f9fa'
                }}
              >
                Upload Room Images
                <input 
                  type="file" 
                  multiple 
                  hidden 
                  onChange={handleImageChange} 
                  accept="image/*" 
                />
              </Button>

              <Stack direction="row" spacing={2} sx={{ mt: 3, flexWrap: 'wrap' }}>
                {previews.map((src, index) => (
                  <Box 
                    key={index}
                    component="img"
                    src={src}
                    sx={{
                      width: 130,
                      height: 110,
                      borderRadius: 3,
                      objectFit: 'cover',
                      border: '1px solid #ddd'
                    }}
                  />
                ))}
              </Stack>
            </Grid>

            {/* Buttons */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button 
                  size="large" 
                  variant="outlined" 
                  onClick={() => navigate("/admin/rooms")}
                >
                  Cancel
                </Button>
                <Button 
                  size="large" 
                  type="submit" 
                  variant="contained" 
                  disabled={isPending}
                  sx={{ px: 5 }}
                >
                  {isPending ? "Saving..." : "Add Room"}
                </Button>
              </Box>
            </Grid>

          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default AddNewRoom;
