import { useContext } from "react";
import { AuthContext } from "../../../app/providers/KeycloakProvider";

export function useAuth() {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("useAuth trebuie folosit în KeycloakProvider.");
  return auth;
}

