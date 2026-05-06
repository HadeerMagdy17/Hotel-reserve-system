import { Navigate, Outlet } from "react-router-dom";

import { useAppSelector } from "../../redux/store/hook";

interface IProps {
  children?: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: IProps) {
  const { token, role } = useAppSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role || "")) {
    return <Navigate to="/home" replace />; 
  }

  return children ? <>{children}</> : <Outlet />;
}
