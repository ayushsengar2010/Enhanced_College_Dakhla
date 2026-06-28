import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import AdminTopbar from "../components/layout/AdminTopbar";

const RequireAdmin = ({ children }) => {
  const token = localStorage.getItem("admin_token");
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

const AdminRoutes = () => {
  return (
    <RequireAdmin>
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[260px_1fr]">
        <Sidebar />
        <div className="bg-mist min-h-screen">
          <AdminTopbar />
          <main className="px-6 md:px-10 py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </RequireAdmin>
  );
};

export default AdminRoutes;
