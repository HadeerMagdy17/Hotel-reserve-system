// src/views/admin/ads/Ads.tsx
import React, { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Container,
  TablePagination,
  Typography,
  AppBar,
  useTheme,
  LinearProgress,
  Chip,
  Stack,
  Button,
  FormControlLabel,
  Switch,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";

// Icons
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {
  Person,
  MeetingRoom,
  AttachMoney,
  ToggleOn,
} from "@mui/icons-material";

// Components & Shared
import DeleteModal from "../../../common/components/DeleteModal";
import { DataModal } from "../../../common/components/DataModal";
import ActionMenu from "../../../common/components/ActionMenu";
import CustomTable from "../../../common/components/CustomTable";

// Services & Interfaces
import {
  fetchAdsList,
  deleteAd,
  updateAd,
} from "../../../services/adsService";
import type { IAd, IAdPayload, IAdsResponse } from "../../../interface/Ads";
import type { IMenuAction } from "../../../common/components/ActionMenu";
import type { IColumn } from "../../../common/components/CustomTable";

// Helper Component لعرض التفاصيل داخل مودال الـ View
const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) => (
  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
    {icon}
    <Box>
      <Typography variant="caption" color="textSecondary" display="block">
        {label}
      </Typography>
      <Typography variant="body1" fontWeight="500">
        {value}
      </Typography>
    </Box>
  </Stack>
);

const Ads: React.FC = () => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // --- States للتحكم في الـ Modals والمود الحالي ---
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false); 
  const [modalMode, setModalMode] = useState<"view" | "edit">("view");
  const [selectedAd, setSelectedAd] = useState<IAd | null>(null);
  
  // States لحفظ القيم المؤقتة أثناء التعديل
  const [isActiveStatus, setIsActiveStatus] = useState<boolean>(false);
  const [discountValue, setDiscountValue] = useState<number>(0);

  const page = parseInt(searchParams.get("page") || "0");
  const rowsPerPage = parseInt(searchParams.get("size") || "5");

  // --- 1. get ads data ---
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["ads", page, rowsPerPage],
    queryFn: () => fetchAdsList(page + 1, rowsPerPage),
    placeholderData: keepPreviousData,
  });

  const adsData = data as IAdsResponse | undefined;

  // --- 2. Mutations ( Update ) ---
  const { mutate: performUpdate, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      updateAd(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ads"] });
      toast.success("Ad Updated Successfully");
      setFormOpen(false);
      setSelectedAd(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error updating ad");
    },
  });
//delete mutation
  const { mutate: performDelete, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteAd(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ads"] });
      toast.success("Ad Deleted Successfully");
      setDeleteOpen(false);
      setSelectedAd(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error deleting ad");
    },
  });

  // --- 3. دالات فتح الـ Modals وتحديد المود وعمل الـ Reset للـ States فيه فورا ---
  const handleOpenView = (ad: IAd) => {
    setSelectedAd(ad);
    setModalMode("view");
    setFormOpen(true);
  };

  const handleOpenEdit = (ad: IAd) => {
    setSelectedAd(ad);
    setModalMode("edit");
    
    // التعديل هنا: الـ States بتاخد القيمة الحقيقية فوراً عند الكليكة وبشكل مستقر بعيد عن الـ useEffect
    setIsActiveStatus(ad.isActive);
    setDiscountValue(ad.room?.discount || 0); 
    
    setFormOpen(true);
  };

  const handleOpenDelete = (ad: IAd) => {
    setSelectedAd(ad);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedAd) {
      performDelete(selectedAd._id);
    }
  };

  const handleFormSubmit = () => {
    if (modalMode === "edit" && selectedAd) {
      const payload = {
        isActive: isActiveStatus,
        discount: Number(discountValue), 
      };
      performUpdate({ id: selectedAd._id, payload });
    }
  };

  // --- 4. تعريف الـ Actions Menu المشترك ---
  const getAdActions = (row: IAd): IMenuAction[] => [
    {
      label: "View Details",
      icon: <VisibilityIcon fontSize="small" />,
      onClick: () => handleOpenView(row),
      color: theme.palette.primary.main,
    },
    {
      label: "Update Ad",
      icon: <EditIcon fontSize="small" />,
      onClick: () => handleOpenEdit(row),
      color: theme.palette.warning.main,
    },
    {
      label: "Delete Ad",
      icon: <DeleteIcon fontSize="small" />,
      onClick: () => handleOpenDelete(row),
      color: theme.palette.error.main,
    },
  ];

  // --- 5. تعريف أعمدة الجدول ---
  const columns: IColumn[] = [
    {
      id: "roomNumber",
      label: "Room Number",
      render: (row: IAd) => row.room?.roomNumber || "-",
    },
    {
      id: "price",
      label: "Room Price",
      render: (row: IAd) => `${row.room?.price || 0} EGP`,
    },
    {
      id: "discount",
      label: "Discount",
      render: (row: IAd) => `${row.room?.discount || 0}%`,
    },
    {
      id: "createdBy",
      label: "Created By",
      render: (row: IAd) => row.createdBy?.userName || "-",
    },
    {
      id: "status",
      label: "Status",
      render: (row: IAd) => (
        <Chip
          label={row.isActive ? "Active" : "Inactive"}
          color={row.isActive ? "success" : "default"}
          size="small"
          variant="outlined"
          sx={{ fontWeight: "500" }}
        />
      ),
    },
    {
      id: "actions",
      label: "Actions",
      render: (row: IAd) => (
        <ActionMenu itemId={row._id} actions={getAdActions(row)} />
      ),
    },
  ];

  const handleChangePage = (_: any, newPage: number) => {
    searchParams.set("page", newPage.toString());
    setSearchParams(searchParams);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    searchParams.set("size", event.target.value);
    searchParams.set("page", "0");
    setSearchParams(searchParams);
  };

  return (
    <Box>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#fff",
          color: theme.palette.primary.main,
          boxShadow: "none",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Ads Table Details
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Manage all advertisements configurations efficiently
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/admin/ads/add-ad")}
            sx={{ textTransform: "none", fontWeight: "bold", borderRadius: "8px" }}
          >
            Add New Ad
          </Button>
        </Box>
      </AppBar>

      {isFetching && !isLoading && (
        <LinearProgress sx={{ mx: 4, mt: 1, height: "2px" }} />
      )}

      <Container sx={{ mt: 2 }} maxWidth={false}>
        <CustomTable
          columns={columns}
          data={adsData?.ads || []}
          isLoading={isLoading}
        />

        {!isLoading && adsData && (
          <TablePagination
            component="div"
            count={adsData.totalCount || 0}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 20]}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Container>

      <DataModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelectedAd(null);
        }}
        mode={modalMode}
        title={
          modalMode === "edit"
            ? "Update Advertisement Details"
            : "Ad Full Details"
        }
        isLoading={isUpdating}
        onSave={modalMode === "edit" ? handleFormSubmit : undefined} 
      >
        {modalMode === "view" && selectedAd ? (
          //if modal is view
          <Box sx={{ py: 1 }}>
            <InfoRow
              icon={<MeetingRoom color="primary" />}
              label="Room Number"
              value={selectedAd.room?.roomNumber || "-"}
            />
            <InfoRow
              icon={<AttachMoney color="primary" />}
              label="Price & Discount"
              value={`${selectedAd.room?.price} EGP (Discount: ${selectedAd.room?.discount}%)`}
            />
            <InfoRow
              icon={<Person color="primary" />}
              label="Created By"
              value={selectedAd.createdBy?.userName || "-"}
            />
            <InfoRow
              icon={
                <ToggleOn color={selectedAd.isActive ? "success" : "action"} />
              }
              label="Ad Status"
              value={
                selectedAd.isActive ? "Active (Visible to users)" : "Inactive"
              }
            />
          </Box>
        ) : (
          //if modal is edit
          <Box sx={{ py: 2 }}>
            <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>
              Room Number: {selectedAd?.room?.roomNumber}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              Update the advertisement configurations below.
            </Typography>

            <Stack spacing={3}>
              <TextField
                label="Discount"
                type="number"
                fullWidth
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                inputProps={{ min: 0 }}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={isActiveStatus}
                    onChange={(e) => setIsActiveStatus(e.target.checked)}
                    color="success"
                  />
                }
                label={isActiveStatus ? "Ad is Active" : "Ad is Inactive"}
              />
            </Stack>
          </Box>
        )}
      </DataModal>

      <DeleteModal
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setSelectedAd(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Are you sure you want to delete this ad?"
        isLoading={isDeleting}
      />
    </Box>
  );
};

export default Ads;