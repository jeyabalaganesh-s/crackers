import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedAdminRoute() {
  const location = useLocation();

  const token = sessionStorage.getItem("raja_admin_token");

  if (!token) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}