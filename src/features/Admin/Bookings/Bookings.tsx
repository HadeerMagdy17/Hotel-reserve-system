import React, { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
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
} from "@mui/material";
import { toast } from "react-toastify";

// Icons
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Person,
  MeetingRoom,
  AttachMoney,
  CalendarToday,
} from "@mui/icons-material";

import DeleteModal from "../../../common/components/DeleteModal";
import { DataModal } from "../../../common/components/DataModal";
import type { IBooking, IBookingsResponse } from "../../../interface/Booking";
import { deleteBooking, fetchBookingsList } from "../../../services/bookingService";
import type { IMenuAction } from "../../../common/components/ActionMenu";
import type { IColumn } from "../../../common/components/CustomTable";
import ActionMenu from "../../../common/components/ActionMenu";
import CustomTable from "../../../common/components/CustomTable";



// Helper Component لعرض تفاصيل الحجز داخل المودال
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

const Bookings: React.FC = () => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  // --- States ---
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  const [selectedBooking, setSelectedBooking] = useState<IBooking | null>(null);

  const page = parseInt(searchParams.get("page") || "0");
  const rowsPerPage = parseInt(searchParams.get("size") || "5");

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["bookings", page, rowsPerPage],
    queryFn: () => fetchBookingsList(page + 1, rowsPerPage),
    placeholderData: keepPreviousData,
  });

  const bookingsData = data as IBookingsResponse | undefined;

  // --- 2. Mutation delete  ---
  const { mutate: performDelete, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking Deleted Successfully");
      setDeleteOpen(false);
      setSelectedBooking(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error deleting booking");
    },
  });

  // --- دالات التحكم ---
  const handleOpenView = (booking: IBooking) => {
    setSelectedBooking(booking);
    setViewOpen(true);
  };
//1-step1
  const handleOpenDelete = (booking: IBooking) => {
    setSelectedBooking(booking);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedBooking) {
      performDelete(selectedBooking._id);
    }
  };

  // ---  actions  ---
  const getBookingActions = (row: IBooking): IMenuAction[] => [
    {
      label: "View",
      icon: <VisibilityIcon fontSize="small" />,
      onClick: () => handleOpenView(row),
      color: theme.palette.secondary.main,
    },
    {
      label: "Delete",
      icon: <DeleteIcon fontSize="small" />,
      onClick: () => handleOpenDelete(row),
      color: theme.palette.error.main,
    },
  ];

  // --- تعريف الأعمدة ---
  const columns: IColumn[] = [
    {
      id: "roomNumber",
      label: "Room Number",
      render: (row: IBooking) => (row.room ? row.room.roomNumber : "-"),
    },
    {
      id: "userName",
      label: "User Name",
      render: (row: IBooking) => row.user?.userName || "-",
    },
    {
      id: "totalPrice",
      label: "Total Price",
      render: (row: IBooking) => `${row.totalPrice} EGP`,
    },
    {
      id: "startDate",
      label: "Start Date",
      render: (row: IBooking) => new Date(row.startDate).toLocaleDateString(),
    },
    {
      id: "endDate",
      label: "End Date",
      render: (row: IBooking) => new Date(row.endDate).toLocaleDateString(),
    },
    {
      id: "status",
      label: "Status",
      render: (row: IBooking) => {
        const statusColors: Record<string, "warning" | "success" | "error"> = {
          pending: "warning",
          completed: "success",
          cancelled: "error",
        };
        return (
          <Chip
            label={row.status}
            color={statusColors[row.status] || "default"}
            size="small"
            variant="outlined"
            sx={{ textTransform: "capitalize", fontWeight: "500" }}
          />
        );
      },
    },
    {
      id: "actions",
      label: "Actions",
      render: (row: IBooking) => (
        <ActionMenu itemId={row._id} actions={getBookingActions(row)} />
      ),
    },
  ];

  // --- Pagination ---
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
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Booking Table Details
          </Typography>
          <Typography variant="body2" color="textSecondary">
            You can check all details
          </Typography>
        </Box>
      </AppBar>

      {isFetching && !isLoading && (
        <LinearProgress sx={{ mx: 4, mt: 1, height: "2px" }} />
      )}

      <Container sx={{ mt: 2 }} maxWidth={false}>
        <CustomTable
          columns={columns}
          data={bookingsData?.booking || []}
          isLoading={isLoading}
        />

        {!isLoading && bookingsData && (
          <TablePagination
            component="div"
            count={bookingsData.totalCount || 0}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 20]}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Container>

      {/* View Details Modal */}
      <DataModal
        open={viewOpen}
        onClose={() => {
          setViewOpen(false);
          setSelectedBooking(null);
        }}
        mode="view"
        title="Booking Full Details"
      >
        {selectedBooking && (
          <Box sx={{ py: 1 }}>
            <InfoRow
              icon={<Person color="primary" />}
              label="Customer Name"
              value={selectedBooking.user?.userName || "-"}
            />
            <InfoRow
              icon={<MeetingRoom color="primary" />}
              label="Room Number"
              value={selectedBooking.room ? selectedBooking.room.roomNumber : "No Room Assigned"}
            />
            <InfoRow
              icon={<AttachMoney color="primary" />}
              label="Total Price paid"
              value={`${selectedBooking.totalPrice} EGP`}
            />
            <InfoRow
              icon={<CalendarToday color="primary" />}
              label="Stay Period"
              value={`${new Date(selectedBooking.startDate).toLocaleDateString()} To ${new Date(selectedBooking.endDate).toLocaleDateString()}`}
            />
          </Box>
        )}
      </DataModal>

      {/* Delete Modal */}
      <DeleteModal
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setSelectedBooking(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Are you sure you want to delete this booking?"
        isLoading={isDeleting}
      />
    </Box>
  );
};

export default Bookings;