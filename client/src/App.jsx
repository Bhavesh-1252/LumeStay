import { RouterProvider } from "react-router";
import { router } from "./app.routes.jsx";
import AuthProvider from "./features/auth/providers/auth.provider.jsx";
import FlashMessageProvider from "./providers/FlashMessageProvider.jsx";

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
