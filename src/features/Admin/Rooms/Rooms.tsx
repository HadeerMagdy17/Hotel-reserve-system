import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  Box, Container, TablePagination, Typography, 
  AppBar, useTheme, LinearProgress, Chip, Button 
} from "@mui/material";
import { toast } from "react-toastify";

// Icons
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { AddCircleOutlineSharp } from "@mui/icons-material";
import { deleteRoom, fetchRoomsList } from "../../../services/roomsService";
import type { IColumn } from "../../../common/components/CustomTable";
import type { IRoom } from "../../../interface/Room";
import ActionMenu, { type IMenuAction } from "../../../common/components/ActionMenu";
import CustomTable from "../../../common/components/CustomTable";
import DeleteModal from "../../../common/components/DeleteModal";
import { DataModal } from "../../../common/components/DataModal";

// Components & Services
// import type { IColumn } from "../../../common/components/shared/CustomTable";
// import type { IRoom } from "../../../interface/Rooms";
// import CustomTable from "../../../common/components/shared/CustomTable";
// import { fetchRoomsList, deleteRoom } from "../../../services/roomsService"; 
// import type { IMenuAction } from "../../../common/components/AcctionMenu";
// import ActionMenu from "../../../common/components/AcctionMenu";
// import DeleteModal from "../../../common/components/DeleteModal";
// import { DataModal } from "../../../common/components/DataModal";
// // import DataModal from "../../../common/components/DataModal";

const Rooms: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  // --- States للتحكم في المودالز ---
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [dataModalOpen, setDataModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');
  const [selectedRoom, setSelectedRoom] = useState<IRoom | null>(null);

  const page = parseInt(searchParams.get("page") || "0");
  const rowsPerPage = parseInt(searchParams.get("size") || "5");

  // --- React Query ---
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["rooms", page, rowsPerPage],
    queryFn: () => fetchRoomsList(page + 1, rowsPerPage),
    placeholderData: keepPreviousData,
  });

  // --- React Query (Mutation للمسح) ---
  const { mutate: performDelete } = useMutation({
    mutationFn: (id: string) => deleteRoom(id),
    onSuccess: () => {
      // تحديث الجدول أوتوماتيكياً
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success("Room Deleted Successfully");
      setDeleteOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error deleting room");
    }
  });

  // --- func contol of modals---

  const handleOpenDelete = (room: IRoom) => {
    setSelectedRoom(room);
    setDeleteOpen(true);
  };

  const handleOpenDataModal = (room: IRoom, mode: 'view' | 'edit') => {
    setSelectedRoom(room);
    setModalMode(mode);
    setDataModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedRoom) {
      performDelete(selectedRoom._id);
     
    }
  };

  // 1.
  const getRoomActions = (row: IRoom): IMenuAction[] => [
    { 
      label: "View", 
      icon: <VisibilityIcon fontSize="small" />, 
      
      onClick: () => handleOpenDataModal(row, 'view'), 
      color: theme.palette.primary.main 
    },
    { 
      label: "Edit", 
      icon: <EditIcon fontSize="small" />, 
      onClick: () => handleOpenDataModal(row, 'edit'), 
      color: theme.palette.secondary.main 
    },
    { 
      label: "Delete", 
      icon: <DeleteIcon fontSize="small" />, 
       
      onClick: () => handleOpenDelete(row), 
      color: theme.palette.error.main 
    },
  ];

  // 2. تعريف الأعمدة
  const columns: IColumn[] = [
    { id: "roomNumber", label: "Room Number" },
    { 
      id: "images", 
      label: "Image",
      render: (row: IRoom) => (
        <Box 
          component="img" 
          src={row.images?.[0] || 'https://via.placeholder.com/60x50?text=Room'}    
          alt="Room"
          sx={{ width: 60, height: 50, borderRadius: "8px", objectFit: "cover" }}
        />
      )
    },
    { id: "price", label: "Price ($)" },
    { id: "capacity", label: "Capacity" },
    { 
      id: "facilities", 
      label: "Facilities",
      render: (row: IRoom) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {row.facilities?.map((f) => (
            <Chip key={f._id} label={f.name} size="small" variant="outlined" />
          ))}
        </Box>
      )
    },
    {
      id: "actions",
      label: "Actions",
      render: (row: IRoom) => (
        <ActionMenu itemId={row._id} 
        actions={getRoomActions(row)}
         />
      ),
    },
  ];

  const roomsData = data as { rooms: IRoom[]; totalCount: number } | undefined;

  const handleChangePage = (_: any, newPage: number) => {
    searchParams.set("page", newPage.toString());
    setSearchParams(searchParams);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    searchParams.set("size", event.target.value);
    searchParams.set("page", "0");
    setSearchParams(searchParams);
  };

  return (
    <Box>
      <AppBar position="static" sx={{ backgroundColor: "#fff", color: theme.palette.primary.main, boxShadow: "none", borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>Rooms Table Details</Typography>
            <Typography variant="body2" color="textSecondary">Manage all hotel rooms efficiently</Typography>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<AddCircleOutlineSharp />} 
            onClick={() => navigate("/admin/rooms/add-room")} 
            sx={{ textTransform: 'none', borderRadius: '8px' }}
          >
            Add New Room
          </Button>
        </Box>
      </AppBar>

      {isFetching && !isLoading && <LinearProgress sx={{ mx: 4, mt: 1, height: '2px' }} />}

      <Container sx={{ mt: 2 }} maxWidth={false}>
        <CustomTable 
          columns={columns} 
          data={roomsData?.rooms || []} 
          isLoading={isLoading} 
        />

        {!isLoading && roomsData && (
          <TablePagination
            component="div"
            count={roomsData.totalCount || 0}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 20]}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Container>

      {/* مودال المسح */}
      <DeleteModal 
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete This Room"
      />


      {/* view and edit */}
      <DataModal 
        open={dataModalOpen}
        onClose={() => setDataModalOpen(false)}
        mode={modalMode}
        room={selectedRoom}
      />
    </Box>
  );
};

export default Rooms;