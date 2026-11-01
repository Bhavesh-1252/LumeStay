import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import ForgotPassword from "./features/auth/pages/ForgotPassword";
import Listings from "./features/listings/pages/explore";
import Navbar from "./features/listings/pages/components/Navbar";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      // <Protected>
      <>
        <Navbar />
        <Listings />
      </>
      // </Protected>
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
    element: <ForgotPassword />,
  },
]);
