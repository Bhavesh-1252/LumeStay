import { createBrowserRouter, Outlet } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import ForgotPassword from "./features/auth/pages/ForgotPassword";
import Explore from "./features/listings/pages/Explore";
import Listing from "./features/listings/pages/Listing";
import CreateListing from "./features/listings/pages/CreateListing";
import Protected from "./features/auth/components/Protected";
import Navbar from "./components/Navbar";
import EditListing from "./features/listings/pages/EditListing";
import ErrorPage from "./ErrorPage";
import NotFound from "./NotFound";
import Footer from "./components/Footer";

const Layout = () => {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />

      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>

      <Footer/>
    </div>
  )
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout />
    ),
    children: [
      {
        children: [
          {
            index: true,
            element: <Explore />,
            errorElement: <ErrorPage />
          },
          {
            path: "listings/:id",
            element: <Listing />,
            errorElement: <ErrorPage />
          },
          {
            path: "listings/new",
            element: (
              <Protected>
                <CreateListing />
              </Protected>
            ),
            errorElement: <ErrorPage />
          },
          {
            path: "listings/:id/edit",
            element: (
              <Protected>
                <EditListing />
              </Protected>
            ),
            errorElement: <ErrorPage />
          },
          {
            path: "*",
            element: <NotFound />
          }
        ],
        errorElement: <ErrorPage />
      }
    ],
    errorElement: <ErrorPage />
  },
  {
    path: "/",
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
    ],
    errorElement: <ErrorPage />
  }
]);
