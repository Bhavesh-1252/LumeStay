import { RouterProvider } from "react-router";
import { router } from "./app.routes.jsx";
import { AuthProvider } from "./features/auth/auth.context.jsx";
import { FlashMessageProvider } from "./context/FlashMessage.context.jsx";

function App() {
  return (
    <FlashMessageProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </FlashMessageProvider>
  );
}

export default App;
