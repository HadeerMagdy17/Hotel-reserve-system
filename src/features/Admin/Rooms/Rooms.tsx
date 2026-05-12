import React from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { 
  Box, Container, TablePagination, Typography, 
  AppBar, useTheme, LinearProgress, Chip, IconButton, Stack, Tooltip 
} from "@mui/material";
// استيراد الأيقونات
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


import { fetchRoomsList } from "../../../services/roomsService";
import type { IColumn } from "../../../common/components/CustomTable";
import type { IRoom } from "../../../interface/Room";
import CustomTable from "../../../common/components/CustomTable";

const Rooms: React.FC = () => {
  const theme = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "0");
  const rowsPerPage = parseInt(searchParams.get("size") || "5");
  //alerts for test
  const handleView = (id: string) => alert(`view ${id}`);
  const handleEdit = (id: string) => alert( `Edit ${id}`);
  const handleDelete = (id: string) => alert(`delete ${id}`);

  const columns: IColumn[] = [
    { id: "roomNumber", label: "Room Number" },
    { 
      id: "imagePath", 
      label: "Image",
      render: (row: IRoom) => (
        <Box 
          component="img" 
          src={row.images?.[0] || 'placeholder-image-url'}    
          alt="Room"
          sx={{ width: 80, height: 50, borderRadius: "8px", objectFit: "cover" }}
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
          {row.facilities.map((f) => (
            <Chip key={f._id} label={f.name} size="small" variant="outlined" />
          ))}
        </Box>
      )
    },
    // --- إضافة عمود الـ Actions هنا ---
    {
      id: "actions",
      label: "Actions",
      render: (row: IRoom) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="View">
            <IconButton color="primary" size="small" onClick={() => handleView(row._id)}>
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton color="secondary" size="small" onClick={() => handleEdit(row._id)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton color="error" size="small" onClick={() => handleDelete(row._id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["rooms", page, rowsPerPage],
    queryFn: () => fetchRoomsList(page + 1, rowsPerPage),
    placeholderData: keepPreviousData,
  });

  const roomsData = data as { rooms: IRoom[]; totalCount: number } | undefined;

  const handleChangePage = (_: any, newPage: number) => {
    setSearchParams({ page: newPage.toString(), size: rowsPerPage.toString() });
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams({ page: "0", size: event.target.value });
  };

  return (
    <Box>
      <AppBar position="static" sx={{ backgroundColor: "#fff", color: theme.palette.primary.main, boxShadow: "none", borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>Rooms Details</Typography>
          <Typography variant="body2" color="textSecondary">Manage all hotel rooms efficiently</Typography>
        </Box>
      </AppBar>

      {isFetching && !isLoading && <LinearProgress sx={{ height: '2px' }} />}

      <Container sx={{ mt: 4 }}>
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
    </Box>
  );
};

export default Rooms;