import { useAuth } from "../../auth/hooks/useAuth";
import { MechanicDashboard } from "./MechanicDashboard";
import { UserDashboard } from "./UserDashboard";

export function DashboardPage() {
  const { roles } = useAuth();
  return roles.includes("MECHANIC") || roles.includes("ADMIN")
    ? <MechanicDashboard />
    : <UserDashboard />;
}

