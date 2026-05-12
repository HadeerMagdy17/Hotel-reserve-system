import React from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom"; // عشان نحفظ الحالة في الـ URL
import {
  Box,
  Container,
  TablePagination,
  Typography,
  AppBar,
  useTheme,
  LinearProgress,
} from "@mui/material";
import type { IColumn } from "../../../common/components/CustomTable";
import { fetchUsersList } from "../../../services/userService";
import CustomTable from "../../../common/components/CustomTable";


const Users: React.FC = () => {
  const theme = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "0");
  const rowsPerPage = parseInt(searchParams.get("size") || "5");

  const columns: IColumn[] = [
    { id: "userName", label: "User Name" },
    { id: "role", label: "Role" },
    { id: "phoneNumber", label: "Phone" },
    { id: "email", label: "Email" },
    { id: "country", label: "Country" },
  ];

  const { data, isLoading, isFetching } = useQuery({
          queryKey: ["users", page, rowsPerPage],
          queryFn: () => fetchUsersList(page + 1, rowsPerPage),
          placeholderData: keepPreviousData,
  });

  const usersData = data as { users: any[]; totalCount: number } | undefined;

  // تحديث الـ URL عند تغيير الصفحة
  const handleChangePage = (_: any, newPage: number) => {
    setSearchParams({ page: newPage.toString(), size: rowsPerPage.toString() });
  };

  // تحديث الـ URL عند تغيير عدد العناصر
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newSize = event.target.value;
    setSearchParams({ page: "0", size: newSize });
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
            Users Table Details
          </Typography>
          <Typography variant="body2" color="textSecondary">
            You can check all details
          </Typography>
        </Box>
      </AppBar>

      {/* اللودر الخطي يظهر فقط أثناء الانتقال بين الصفحات */}
      {isFetching && !isLoading && (
        <LinearProgress
          sx={{ height: "2px", backgroundColor: "transparent" }}
        />
      )}

      <Container sx={{ mt: 4 }}>
        <CustomTable
          columns={columns}
          data={usersData?.users || []}
          isLoading={isLoading}
        />

        {!isLoading && usersData && (
          <TablePagination
            component="div"
            count={usersData.totalCount || 0}
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

export default Users;
