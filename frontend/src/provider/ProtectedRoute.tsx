import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const location = useLocation();

  // 🔐 Get token from all possible storage keys (robust)
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    (() => {
      // if you store user object with token inside
      const user = localStorage.getItem("user");
      if (!user) return null;

      try {
        const parsed = JSON.parse(user);
        return parsed?.token || parsed?.accessToken || null;
      } catch {
        return null;
      }
    })();

  // 🚫 Not authenticated → redirect to login
  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }} // allows redirect back after login
      />
    );
  }

  // ✅ Authenticated → render child routes (Outlet from layout routing)
  return <Outlet />;
};

export default ProtectedRoute;