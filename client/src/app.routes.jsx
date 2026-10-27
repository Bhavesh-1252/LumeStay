import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import Listings from "./components/ui/Listings";
import ForgotPassword from "./features/auth/pages/ForgotPassword";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Protected>
        <Listings />
      </Protected>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />
  }
]);
