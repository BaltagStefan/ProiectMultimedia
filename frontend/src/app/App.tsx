import { RouterProvider } from "react-router-dom";
import { QueryProvider } from "./providers/QueryProvider";
import { AutoAssistKeycloakProvider } from "./providers/KeycloakProvider";
import { router } from "./router";

export function App() {
  return (
    <QueryProvider>
      <AutoAssistKeycloakProvider>
        <RouterProvider router={router} />
      </AutoAssistKeycloakProvider>
    </QueryProvider>
  );
}

