import React from "react";
import {
  Modal, Box, Typography, IconButton, Button,
  Divider, Stack, 
} from "@mui/material";
import {
  Close as CloseIcon, MeetingRoom
} from "@mui/icons-material";


interface DataModalProps {
  open: boolean;
  onClose: () => void;
  title:string;
  mode: 'view' | 'edit';
  children:React.ReactNode;
  onSave?:()=>void;
  isLoading?:boolean
}


export const DataModal: React.FC<DataModalProps> = ({ open, onClose, mode, title,children,onSave,isLoading }) => {
  
  const isView = mode === 'view';

  return (
    <Modal open={open} onClose={onClose} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Box sx={{ width: { xs: "95%", md: 800 }, bgcolor: "background.paper", borderRadius: 4, overflow: "hidden", outline: "none" }}>
        
        {/* Header */}
        <Box sx={{ bgcolor: isView ? "primary.main" : "secondary.main", color: "white", p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <MeetingRoom />
            <Typography variant="h6">{title}</Typography>
          </Stack>
          <IconButton onClick={onClose} sx={{ color: "white" }}><CloseIcon /></IconButton>
        </Box>

        <Box sx={{ p: 4 }}>
          {children}
        

          <Divider sx={{ my: 3 }} />
          
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={onClose} variant="outlined">Cancel</Button>

            {!isView && (
              <Button variant="contained" color="secondary" sx={{mx:2}} onClick={onSave} disabled={isLoading}>
               {isLoading ? "saving...":"save changes"}
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};