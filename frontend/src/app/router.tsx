import { createBrowserRouter, Navigate } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { AppointmentsPage } from "../features/appointments/pages/AppointmentsPage";
import { MechanicCalendarPage } from "../features/appointments/pages/MechanicCalendarPage";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { ChatPage } from "../features/chat/pages/ChatPage";
import { DashboardPage } from "../features/dashboard/pages/DashboardPage";
import { MapServicesPage } from "../features/map/pages/MapServicesPage";
import { ServiceDetailsPage } from "../features/map/pages/ServiceDetailsPage";
import { MechanicPartsPage } from "../features/parts/pages/MechanicPartsPage";
import { PartDetailsPage } from "../features/parts/pages/PartDetailsPage";
import { PartsPage } from "../features/parts/pages/PartsPage";
import { ProfilePage } from "../features/profile/pages/ProfilePage";
import { MechanicRoadRequestsPage } from "../features/road-assistance/pages/MechanicRoadRequestsPage";
import { RoadAssistancePage } from "../features/road-assistance/pages/RoadAssistancePage";
import { CarSelectorPage } from "../features/vehicles/pages/CarSelectorPage";
import { Vehicle3DPage } from "../features/vehicles/pages/Vehicle3DPage";

export const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  {
    element: <MainLayout />,
    children: [
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/masina-mea", element: <CarSelectorPage /> },
      { path: "/model-3d", element: <Vehicle3DPage /> },
      { path: "/piese", element: <PartsPage /> },
      { path: "/piese/:id", element: <PartDetailsPage /> },
      { path: "/service-uri", element: <MapServicesPage /> },
      { path: "/service-uri/:id", element: <ServiceDetailsPage /> },
      { path: "/programari", element: <AppointmentsPage /> },
      { path: "/mecanic/programari", element: <MechanicCalendarPage /> },
      { path: "/mecanic/calendar", element: <MechanicCalendarPage /> },
      { path: "/mecanic/piese", element: <MechanicPartsPage /> },
      { path: "/chat", element: <ChatPage /> },
      { path: "/asistenta", element: <RoadAssistancePage /> },
      { path: "/mecanic/asistenta", element: <MechanicRoadRequestsPage /> },
      { path: "/profil", element: <ProfilePage /> },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);

