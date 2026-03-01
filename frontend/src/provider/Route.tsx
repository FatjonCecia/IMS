import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../pages/Login";
import Register from "../pages/Register";
import HomePage from "../pages/Home";
import About from "../pages/About";
import UserPage from "../pages/Users";
import ProtectedRoute from "./ProtectedRoute";

export const Routes = createBrowserRouter([
  {
    path: "/",
    Component: App, // Layout (Header + Sidebar + Outlet)
    children: [
      {
        element: <ProtectedRoute />, // 🔒 Protect internal panel
        children: [
          { path: "", Component: HomePage }, // Dashboard (Inventory)
          { path: "about", Component: About },
          { path: "user", Component: UserPage },
        ],
      },
    ],
  },
  { path: "/login", Component: Login },
  { path: "/register", Component: Register },
]);