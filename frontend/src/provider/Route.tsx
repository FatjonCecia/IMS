import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../pages/Login";
import Register from "../pages/Register";
import HomePage from "../pages/Home";
import About from "../pages/About";
import UserPage from "../pages/Users";

export const Routes = createBrowserRouter([
  {
    path: '/',
    Component: App,   // App is the layout (Header + MainLayout + Outlet)
    children: [
      { path: '', Component: HomePage },   // Home page
      { path: 'about', Component: About }, // About page
      { path: 'user', Component: UserPage }, // User page
    ],
  },
  { path: '/login', Component: Login },
  { path: '/register', Component: Register },
]);