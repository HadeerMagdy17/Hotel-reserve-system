import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  Box,
  useTheme,
} from "@mui/material";
import noData from "../../../src/assets/images/no--data.webp";

// تعريف شكل العمود (Interface)
export interface IColumn {
  id: string;
  label: string;
  render?: (row: any) => React.ReactNode; // اختياري لعرض أزرار أو صور
}

interface IProps {
  columns: IColumn[];
  data: any[];
  isLoading?: boolean;
}

export default function CustomTable({ columns, data, isLoading }: IProps) {
  const theme = useTheme();
  return (
    <TableContainer
      component={Paper}
      sx={{
        boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
        borderRadius: "12px",
        border: "1px solid #eee",
      }}
    >
      <Table>
        <TableHead sx={{ backgroundColor: theme.palette.primary.main }}>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                sx={{ fontWeight: "bold", color: "#dfe7f7" }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            // عرض الـ Skeleton أثناء التحميل
            Array.from(new Array(5)).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    <Skeleton
                      variant="text"
                      width={(colIndex + rowIndex) % 2 === 0 ? "80%" : "60%"}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data?.length > 0 ? (
            data.map((row, index) => (
              <TableRow
                key={row._id || index}
                sx={{
                  "&:nth-of-type(even)": { backgroundColor: "#FBFBFB" },
                  "&:hover": { backgroundColor: "#F1F1F1" },
                }}
              >
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    {column.render ? column.render(row) : row[column.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            // عرض صورة No Data لو الجدول فاضي
            <TableRow>
              <TableCell colSpan={columns.length} align="center" sx={{ py: 5 }}>
                <Box
                  component="img"
                  src={noData}
                  alt="No Data"
                  sx={{ width: "150px" }}
                />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
