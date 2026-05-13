
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { 
  Box, Container, TablePagination, Typography, 
  AppBar, useTheme, LinearProgress, Chip, Button, Stack 
} from "@mui/material";
import { toast } from "react-toastify";

// Icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { AddCircleOutlineSharp, Category, Person, CalendarToday } from "@mui/icons-material";

// Components & Services

import DeleteModal from "../../../common/components/DeleteModal";
import { DataModal } from "../../../common/components/DataModal";
import { deleteFacility, fetchFacilitiesList } from "../../../services/facilitiesService";
import type { IFacility } from "../../../interface/Room";
import type { IMenuAction } from "../../../common/components/ActionMenu";
import type { IColumn } from "../../../common/components/CustomTable";
import ActionMenu from "../../../common/components/ActionMenu";
import CustomTable from "../../../common/components/CustomTable";

// Helper Component لعرض البيانات داخل المودال
const InfoRow = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
    {icon}
    <Box>
      <Typography variant="caption" color="textSecondary" display="block">{label}</Typography>
      <Typography variant="body1" fontWeight="500">{value}</Typography>
    </Box>
  </Stack>
);



const Facilities: React.FC = () => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  // --- States للتحكم في المودالز ---
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [dataModalOpen, setDataModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');
  const [selectedFacility, setSelectedFacility] = useState<IFacility | null>(null);

  const page = parseInt(searchParams.get("page") || "0");
  const rowsPerPage = parseInt(searchParams.get("size") || "5");

  // --- 1. جلب البيانات (React Query) ---
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["facilities", page, rowsPerPage],
    queryFn: () => fetchFacilitiesList(page + 1, rowsPerPage),
    placeholderData: keepPreviousData,
  });

  // --- 2. Mutation للمسح ---
  const { mutate: performDelete } = useMutation({
    mutationFn: (id: string) => deleteFacility(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facilities"] });
      toast.success("Facility Deleted Successfully");
      setDeleteOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error deleting facility");
    }
  });

  // --- 3. دالات التحكم في المودالز ---
  const handleOpenDelete = (facility: IFacility) => {
    setSelectedFacility(facility);
    setDeleteOpen(true);
  };

  const handleOpenDataModal = (facility: IFacility, mode: 'view' | 'edit') => {
    setSelectedFacility(facility);
    setModalMode(mode);
    setDataModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedFacility) {
      performDelete(selectedFacility._id);
    }
  };

  // --- 4. تعريف الأكشنز (View, Edit, Delete) ---
  const getFacilityActions = (row: IFacility): IMenuAction[] => [
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

  // --- 5. تعريف أعمدة الجدول ---
  const columns: IColumn[] = [
    { id: "name", label: "Facility Name" },
    { 
      id: "createdBy", 
      label: "Created By", 
      render: (row: IFacility) => row.createdBy.userName 
    },
    { 
      id: "createdAt", 
      label: "Created At", 
      render: (row: IFacility) => new Date(row.createdAt).toLocaleDateString() 
    },
    { 
      id: "updatedAt", 
      label: "Update At", 
      render: (row: IFacility) => new Date(row.updatedAt).toLocaleDateString() 
    },
    {
      id: "actions",
      label: "Actions",
      render: (row: IFacility) => (
        <ActionMenu itemId={row._id} actions={getFacilityActions(row)} />
      ),
    },
  ];

  const facilitiesData = data as { facilities: IFacility[]; totalCount: number } | undefined;

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
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>Facility Table Details</Typography>
            <Typography variant="body2" color="textSecondary">Manage all hotel facilities efficiently</Typography>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<AddCircleOutlineSharp />} 
            onClick={() => console.log("Open Add Facility Modal")}
            sx={{ textTransform: 'none', borderRadius: '8px' }}
          >
            Add New Facility
          </Button>
        </Box>
      </AppBar>

      {isFetching && !isLoading && <LinearProgress sx={{ mx: 4, mt: 1, height: '2px' }} />}

      <Container sx={{ mt: 2 }} maxWidth={false}>
        <CustomTable 
          columns={columns} 
          data={facilitiesData?.facilities || []} 
          isLoading={isLoading} 
        />

        {!isLoading && facilitiesData && (
          <TablePagination
            component="div"
            count={facilitiesData.totalCount || 0}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 20]}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Container>

      {/* delete*/}
      <DeleteModal 
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete This Facility"
      />

      {/* data modat*/}
      <DataModal 
        open={dataModalOpen} 
        onClose={() => setDataModalOpen(false)} 
        mode={modalMode}
        title={modalMode === 'view' ? "Facility Details" : "Edit Facility"}
        onSave={() => alert("Save Facility API Called")}
      >
        {selectedFacility && (
          modalMode === 'view' ? (
            /* --- عرض تفاصيل المرفق --- */
            <Box>
              <InfoRow icon={<Category color="primary"/>} label="Facility Name" value={selectedFacility.name} />
              <InfoRow icon={<Person color="primary"/>} label="Created By" value={selectedFacility.createdBy.userName} />
              <InfoRow icon={<CalendarToday color="primary"/>} label="Created At" value={new Date(selectedFacility.createdAt).toLocaleString()} />
            </Box>
          ) : (
            /* --- تعديل اسم المرفق --- */
            <Box sx={{ py: 2 }}>
             edit facility comming sooon
            </Box>
          )
        )}
      </DataModal>
    </Box>
  );
};

export default Facilities;
