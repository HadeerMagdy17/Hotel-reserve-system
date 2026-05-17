import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  Box, Container, TablePagination, Typography, 
  AppBar, useTheme, LinearProgress, Chip, Button, 
  Grid, Stack, Paper, ImageList, ImageListItem,
  FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";

// Icons
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { AddCircleOutlineSharp, AttachMoney, People } from "@mui/icons-material";

// Components & Services

import { fetchRoomsList, deleteRoom, updateRoom } from "../../../services/roomsService"; 
import { fetchFacilitiesList } from "../../../services/facilitiesService";

import DeleteModal from "../../../common/components/DeleteModal";
import { DataModal } from "../../../common/components/DataModal";
import AppTextField from "../../../common/components/AppTextField";
import img from '../../../assets/images/Hotel.jpg'
import type { IRoom } from "../../../interface/Room";
import type { IMenuAction } from "../../../common/components/ActionMenu";
import type { IColumn } from "../../../common/components/CustomTable";
import ActionMenu from "../../../common/components/ActionMenu";
import CustomTable from "../../../common/components/CustomTable";

const Rooms: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [dataModalOpen, setDataModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');
  const [selectedRoom, setSelectedRoom] = useState<IRoom | null>(null);

  const page = parseInt(searchParams.get("page") || "0");
  const rowsPerPage = parseInt(searchParams.get("size") || "5");
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["rooms", page, rowsPerPage],
    queryFn: () => fetchRoomsList(page + 1, rowsPerPage),
    placeholderData: keepPreviousData,
  });

  const { data: facilitiesData } = useQuery({
    queryKey: ["facilities-all"],
    queryFn: () => fetchFacilitiesList(1, 100),
  });

  const { mutate: performDelete } = useMutation({
    mutationFn: (id: string) => deleteRoom(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success("Room Deleted Successfully");
      setDeleteOpen(false);
    },
  });

  const { mutate: performUpdate, isPending: isUpdating } = useMutation({
mutationFn: ({ id, data }: { id: string, data: any }) => updateRoom(id, data),  
  onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success("Room Updated Successfully");
      handleCloseModal();
    },
    onError: (error: any) => toast.error(error.response?.data?.message || "Update Failed")
  });

  useEffect(() => {
    if (selectedRoom && modalMode === "edit") {
      reset({
        roomNumber: selectedRoom.roomNumber,
        price: selectedRoom.price,
        capacity: selectedRoom.capacity,
        discount: selectedRoom.discount,
        facilities: selectedRoom.facilities.map(f => f._id)
      });
    }
  }, [selectedRoom, modalMode, reset]);

const onUpdateSave = (formDataJson: any) => {
  const updateData = {
    roomNumber: formDataJson.roomNumber,
    price: Number(formDataJson.price),
    capacity: Number(formDataJson.capacity),
    discount: Number(formDataJson.discount),
    facilities: formDataJson.facilities || [] 
  };

  console.log("Data being sent to API:", updateData); 

  if (selectedRoom) {
    performUpdate({ id: selectedRoom._id, data: updateData });
  }
};
  const handleOpenDataModal = (room: IRoom, mode: 'view' | 'edit') => {
    setSelectedRoom(room);
    setModalMode(mode);
    setDataModalOpen(true);
  };

  const handleCloseModal = () => {
    setDataModalOpen(false);
    setSelectedRoom(null);
    reset();
  };

  const handleConfirmDelete = () => {
    if (selectedRoom) performDelete(selectedRoom._id);
  };

  const InfoRow = ({ icon, label, value }: { icon: any, label: string, value: string | number }) => (
    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
      {icon}
      <Box>
        <Typography variant="caption" color="textSecondary" display="block">{label}</Typography>
        <Typography variant="body1" fontWeight="500">{value}</Typography>
      </Box>
    </Stack>
  );

  const getRoomActions = (row: IRoom): IMenuAction[] => [
    { label: "View", icon: <VisibilityIcon fontSize="small" />, onClick: () => handleOpenDataModal(row, 'view'), color: theme.palette.primary.main },
    { label: "Edit", icon: <EditIcon fontSize="small" />, onClick: () => handleOpenDataModal(row, 'edit'), color: theme.palette.secondary.main },
    { label: "Delete", icon: <DeleteIcon fontSize="small" />, onClick: () => { setSelectedRoom(row); setDeleteOpen(true); }, color: theme.palette.error.main },
  ];

  const columns: IColumn[] = [
    { id: "roomNumber", label: "Room Number" },
    { id: "images", label: "Image", render: (row: IRoom) => (
        <Box 
          component="img" 
          src={(row.images && row.images.length > 0) ? row.images[0] : img} 
          sx={{ width: 60, height: 50, borderRadius: "8px", objectFit: "cover" }} 
        onError={(e) => {
            (e.target as HTMLImageElement).src = img;}}
        />
    )},
    { id: "price", label: "Price ($)" },
    { id: "capacity", label: "Capacity" },
    { id: "facilities", label: "Facilities", render: (row: IRoom) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {row.facilities?.map((f) => <Chip key={f._id} label={f.name} size="small" variant="outlined" />)}
        </Box>
    )},
    { id: "actions", label: "Actions", render: (row: IRoom) => <ActionMenu itemId={row._id} actions={getRoomActions(row)} /> },
  ];

  const roomsData = data as { rooms: IRoom[]; totalCount: number } | undefined;

  return (
    <Box>
      <AppBar position="static" sx={{ backgroundColor: "#fff", color: theme.palette.primary.main, boxShadow: "none", borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>Rooms Table Details</Typography>
            <Typography variant="body2" color="textSecondary">Manage all hotel rooms efficiently</Typography>
          </Box>
          <Button variant="contained" startIcon={<AddCircleOutlineSharp />} onClick={() => navigate("/admin/rooms/add-room")}>
            Add New Room
          </Button>
        </Box>
      </AppBar>

      {isFetching && !isLoading && <LinearProgress sx={{ mx: 4, mt: 1, height: '2px' }} />}

      <Container sx={{ mt: 2 }} maxWidth={false}>
        <CustomTable columns={columns} data={roomsData?.rooms || []} isLoading={isLoading} />
        {!isLoading && roomsData && (
          <TablePagination component="div" count={roomsData.totalCount || 0} page={page} rowsPerPage={rowsPerPage} rowsPerPageOptions={[5, 10, 20]} onPageChange={(_, p) => navigate(`/admin/rooms?page=${p}&size=${rowsPerPage}`)} onRowsPerPageChange={(e) => navigate(`/admin/rooms?page=0&size=${e.target.value}`)} />
        )}
      </Container>

      <DeleteModal open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleConfirmDelete} title="Delete This Room" />

      <DataModal open={dataModalOpen} onClose={handleCloseModal} mode={modalMode === 'view' ? 'view' : 'edit'} title={modalMode === 'view' ? "Room Details" : "Edit Room"} onSave={handleSubmit(onUpdateSave)} isLoading={isUpdating}>
        {selectedRoom && (
          modalMode === 'view' ? (
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InfoRow icon={<AttachMoney color="primary"/>} label="Price" value={`$${selectedRoom.price}`} />
                  <InfoRow icon={<People color="primary"/>} label="Capacity" value={selectedRoom.capacity} />
                  <Box>
                    <Typography variant="caption" color="textSecondary">Facilities:</Typography>
                    <Stack direction="row" gap={1} flexWrap="wrap">
                      {selectedRoom.facilities.map(f => <Chip key={f._id} label={f.name} size="small" variant="outlined" />)}
                    </Stack>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: "bold" }}>Room Gallery:</Typography>
                <Paper variant="outlined" sx={{ p: 1, height: 250, overflowY: 'auto' }}>
                  <ImageList cols={2} gap={8}>
                    {selectedRoom.images.map((img, i) => (
                      <ImageListItem key={i}><img src={img} alt="room" style={{ borderRadius: '8px', height: '100px', objectFit: 'cover' }} /></ImageListItem>
                    ))}
                  </ImageList>
                </Paper>
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={6}><AppTextField label="Room Number" name="roomNumber" register={register} error={errors.roomNumber} validation={{ required: "Required" }} /></Grid>
              <Grid item xs={6}><AppTextField label="Price" name="price" type="number" register={register} error={errors.price} validation={{ required: "Required" }} /></Grid>
              <Grid item xs={6}><AppTextField label="Capacity" name="capacity" type="number" register={register} error={errors.capacity} validation={{ required: "Required" }} /></Grid>
              <Grid item xs={6}><AppTextField label="Discount" name="discount" type="number" register={register} error={errors.discount} /></Grid>
              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel id="edit-fac-label">Facilities</InputLabel>
                  <Controller name="facilities" control={control} render={({ field }) => (
                    <Select {...field} multiple label="Facilities" labelId="edit-fac-label" MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}>
                      {facilitiesData?.facilities?.map((f: any) => <MenuItem key={f._id} value={f._id}>{f.name}</MenuItem>)}
                    </Select>
                  )} />
                </FormControl>
              </Grid>
            </Grid>
          )
        )}
      </DataModal>
    </Box>
  );
};

export default Rooms;