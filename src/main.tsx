 





import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import routes from "./routes/Routes.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { ThemeProvider } from "./components/ThemeToggle/theme-provider.tsx";
import { Toaster } from "react-hot-toast";
  
createRoot(document.getElementById("root")!).render(
  <StrictMode>

      <Provider store={store}>
         <Toaster position="top-right" reverseOrder={false} />
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={routes} />
    </ThemeProvider>
       </Provider>
  </StrictMode>
);
