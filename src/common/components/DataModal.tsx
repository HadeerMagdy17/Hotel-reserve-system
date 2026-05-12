import React from "react";
import {
  Modal, Box, Typography, IconButton, Button, Grid,
  Divider, Stack, Chip, Paper, ImageList, ImageListItem
} from "@mui/material";
import {
  Close as CloseIcon, AttachMoney, People, Person, MeetingRoom
} from "@mui/icons-material";
import type { IRoom } from "../../interface/Room";


interface RoomViewModelProps {
  open: boolean;
  onClose: () => void;
  mode: 'view' | 'edit';
  room: IRoom | null;
}


const InfoRow = ({ icon, label, value }: { icon: any, label: string, value: string | number }) => (
  <Stack direction="row" alignItems="center" spacing={2}>
    {icon}
    <Box>
      <Typography variant="caption" color="textSecondary" display="block">{label}</Typography>
      <Typography variant="body1" fontWeight="500">{value}</Typography>
    </Box>
  </Stack>
);

export const DataModal: React.FC<RoomViewModelProps> = ({ open, onClose, mode, room }) => {
  if (!room) return null;
  const isView = mode === 'view';

  return (
    <Modal open={open} onClose={onClose} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Box sx={{ width: { xs: "95%", md: 800 }, bgcolor: "background.paper", borderRadius: 4, overflow: "hidden", outline: "none" }}>
        
        {/* Header */}
        <Box sx={{ bgcolor: isView ? "primary.main" : "secondary.main", color: "white", p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <MeetingRoom />
            <Typography variant="h6">{isView ? "View Details" : "Edit Details"}</Typography>
          </Stack>
          <IconButton onClick={onClose} sx={{ color: "white" }}><CloseIcon /></IconButton>
        </Box>

        <Box sx={{ p: 4 }}>
          <Grid container spacing={4}>
            {isView ? (
              // --- حالة العرض (View Mode) ---
              <>
                <Grid item xs={12} md={6}>
                  <Stack spacing={3}>
                    <InfoRow icon={<AttachMoney color="primary" />} label="Price" value={`$${room.price}`} />
                    <InfoRow icon={<People color="primary" />} label="Capacity" value={`${room.capacity} Persons`} />
                    <InfoRow icon={<Person color="primary" />} label="Created By" value={room.createdBy.userName} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>Facilities:</Typography>
                      <Stack direction="row" flexWrap="wrap" gap={1}>
                        {room.facilities.map((f) => (
                          <Chip key={f._id} label={f.name} size="small" variant="outlined" />
                        ))}
                      </Stack>
                    </Box>
                  </Stack>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: "bold" }}>Room Gallery:</Typography>
                  <Paper variant="outlined" sx={{ p: 1, height: 250, overflowY: 'auto' }}>
                    <ImageList cols={2} gap={8}>
                      {room.images.map((img, i) => (
                        <ImageListItem key={i}>
                          <img src={img} alt="room" style={{ borderRadius: '8px', height: '100px', objectFit: 'cover' }} />
                        </ImageListItem>
                      ))}
                    </ImageList>
                  </Paper>
                </Grid>
              </>
            ) : (
              // --- حالة التعديل (Edit Mode) ---
              <Grid item xs={12}>
                <Typography variant="h6" color="textSecondary" textAlign="center" py={5}>
                  Edit Room : {room.roomNumber}
                  <br />
                  <Typography variant="caption"> Edit inputs hereee coming soon !!!</Typography>
                </Typography>
              </Grid>
            )}
          </Grid>

          <Divider sx={{ my: 3 }} />
          
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={onClose} variant="outlined">Cancel</Button>
            {!isView && (
              <Button variant="contained" color="secondary" sx={{mx:2}}>
                Update Room
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};