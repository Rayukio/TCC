import * as React from "react";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { SignUpScreen } from "./components/SignUpScreen";
import { HomeScreen } from "./components/HomeScreen";
import { SearchScreen } from "./components/SearchScreen";
import { TechnicianDetailScreen } from "./components/TechnicianDetailScreen";
import { BookingScreen } from "./components/BookingScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { ChatScreen } from "./components/ChatScreen";
import { TrackingScreen } from "./components/TrackingScreen";
import { ServiceHistoryScreen } from "./components/ServiceHistoryScreen";
import { ServiceDetailHistoryScreen } from "./components/ServiceDetailHistoryScreen";
import { AppointmentDetailScreen } from "./components/AppointmentDetailScreen";
import { OrderProvider } from "./contexts/OrderContext";
import { ReputationProvider, useReputation } from "./contexts/ReputationContext";

type Screen = 
  | "welcome" 
  | "signup" 
  | "home" 
  | "search" 
  | "technician-detail" 
  | "booking"
  | "appointment-detail"
  | "profile"
  | "chat"
  | "tracking"
  | "service-history"
  | "service-detail-history";

export default function App() {
  const [currentScreen, setCurrentScreen] = React.useState<Screen>("welcome");

  // Expose navigation function for profile menu
  React.useEffect(() => {
    (window as any).handleProfileAction = (action: string) => {
      if (action === "appointments") {
        setCurrentScreen("service-history");
      }
    };
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case "welcome":
        return (
          <WelcomeScreen
            onLogin={() => setCurrentScreen("home")}
            onSignUp={() => setCurrentScreen("signup")}
          />
        );
      case "signup":
        return (
          <SignUpScreen
            onBack={() => setCurrentScreen("welcome")}
            onSignUp={() => setCurrentScreen("home")}
          />
        );
      case "home":
        return <HomeScreen onNavigate={(screen) => setCurrentScreen(screen as Screen)} />;
      case "search":
        return (
          <SearchScreen
            onBack={() => setCurrentScreen("home")}
            onSelectTechnician={() => setCurrentScreen("technician-detail")}
          />
        );
      case "technician-detail":
        return (
          <TechnicianDetailScreen
            onBack={() => setCurrentScreen("search")}
            onBookAppointment={() => setCurrentScreen("booking")}
          />
        );
      case "booking":
        return (
          <BookingScreen
            onBack={() => setCurrentScreen("technician-detail")}
            onConfirm={() => setCurrentScreen("home")}
          />
        );
      case "appointment-detail":
        return (
          <AppointmentDetailScreen
            onBack={() => setCurrentScreen("home")}
            onTrack={() => setCurrentScreen("tracking")}
            onChat={() => setCurrentScreen("chat")}
          />
        );
      case "chat":
        return <ChatScreen onBack={() => setCurrentScreen("appointment-detail")} />;
      case "tracking":
        return (
          <TrackingScreen
            onBack={() => setCurrentScreen("appointment-detail")}
            onOpenChat={() => setCurrentScreen("chat")}
          />
        );
      case "service-history":
        return (
          <ServiceHistoryScreen
            onBack={() => setCurrentScreen("profile")}
            onSelectService={() => setCurrentScreen("service-detail-history")}
          />
        );
      case "service-detail-history":
        return (
          <ServiceDetailHistoryScreen
            onBack={() => setCurrentScreen("service-history")}
          />
        );
      case "profile":
        return <ProfileScreen onBack={() => setCurrentScreen("home")} />;
      default:
        return <HomeScreen onNavigate={(screen) => setCurrentScreen(screen as Screen)} />;
    }
  };

  return (
    <ReputationProvider>
      <OrderProvider>
        <AppContent />
      </OrderProvider>
    </ReputationProvider>
  );

  function AppContent() {
    const { updateMetricsOnStateChange, applyRating } = useReputation();

    // Listener para mudanças de estado
    React.useEffect(() => {
      const handleStatusChange = (event: any) => {
        const { orderId, technicianId, oldStatus, newStatus } = event.detail;
        updateMetricsOnStateChange(technicianId, orderId, oldStatus, newStatus);
      };

      const handleEvaluation = (event: any) => {
        const { orderId, technicianId, rating, comment } = event.detail;
        applyRating(technicianId, orderId, rating, comment);
      };

      window.addEventListener("orderStatusChanged", handleStatusChange);
      window.addEventListener("orderEvaluated", handleEvaluation);

      return () => {
        window.removeEventListener("orderStatusChanged", handleStatusChange);
        window.removeEventListener("orderEvaluated", handleEvaluation);
      };
    }, [updateMetricsOnStateChange, applyRating]);

    return <div className="min-h-screen">{renderScreen()}</div>;
  }
}