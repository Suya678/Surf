import "./App.css";
import { Route, Routes, Navigate } from "react-router";
import HomePage from "./pages/HomePage";
import { authClient } from "./lib/auth";
import LoginPage from "./pages/LoginPage";
import PageLoader from "./components/PageLoader";
import AboutPage from "./pages/AboutPage";
import OnboardingPage from "./pages/OnboardingPage";
import { useEffect, useState } from "react";
import DashBoardPage from "./pages/DashBoardPage";

function App() {
  const { data: session, isPending } = authClient.useSession();
  const [isOnboarded, setIsOnboarded] = useState(null); // null = loading

  // Show loader only while checking auth
  if (isPending) {
    return <PageLoader />;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          !session ? (
            <Navigate to="/home" replace />
          ) : !session.user.onboardingCompleted ? (
            <Navigate to="/onboarding" replace />
          ) : (
            <Navigate to="/dashboard" replace />
          )
        }
      />

      {/* Public home page - accessible to all */}
      <Route path="/home" element={<HomePage />} />

      {/* Public about page */}
      <Route path="/about" element={<AboutPage />} />

      {/* Onboarding - only for authenticated users who haven't onboarded */}
      <Route
        path="/onboarding"
        element={
          !session ? (
            <Navigate to="/home" replace />
          ) : session.user.onboardingCompleted ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <OnboardingPage />
          )
        }
      />

      {/* Login - only for unauthenticated users */}
      <Route
        path="/login"
        element={session ? <Navigate to="/" replace /> : <LoginPage />}
      />

      {/* Dashboard - only for authenticated + onboarded users */}
      <Route
        path="/dashboard"
        element={
          !session ? (
            <Navigate to="/home" replace />
          ) : !session.user.onboardingCompleted ? (
            <Navigate to="/onboarding" replace />
          ) : (
            <DashBoardPage />
          )
        }
      />
    </Routes>
  );
}

export default App;
