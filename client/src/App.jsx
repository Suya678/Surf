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
import HostDashBoardPage from "./pages/HostDashBoardPage";
import { Toaster } from "react-hot-toast";

function App() {
  const { data: session, isPending } = authClient.useSession();

  // Show loader only while checking auth
  if (isPending) {
    return <PageLoader />;
  }

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          className: "",
          style: {
            background: "hsl(var(--b1))",
            color: "hsl(var(--bc))",
            border: "2px solid hsl(var(--b3))",
            padding: "16px",
            borderRadius: "0.75rem",
            fontWeight: "600",
          },
          success: {
            duration: 3000,
            style: {
              background: "hsl(var(--su) / 0.2)",
              color: "hsl(var(--suc))",
              border: "2px solid hsl(var(--su))",
            },
            iconTheme: {
              primary: "hsl(var(--su))",
              secondary: "hsl(var(--suc))",
            },
          },
          error: {
            duration: 3000,
            style: {
              background: "hsl(var(--er) / 0.2)",
              color: "hsl(var(--erc))",
              border: "2px solid hsl(var(--er))",
            },
            iconTheme: {
              primary: "hsl(var(--er))",
              secondary: "hsl(var(--erc))",
            },
          },
          loading: {
            style: {
              background: "hsl(var(--p) / 0.2)",
              color: "hsl(var(--pc))",
              border: "2px solid hsl(var(--p))",
            },
            iconTheme: {
              primary: "hsl(var(--p))",
              secondary: "hsl(var(--pc))",
            },
          },
        }}
      />

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
        <Route
          path="/hostDashboard"
          element={
            !session ? (
              <Navigate to="/home" replace />
            ) : !session.user.onboardingCompleted ? (
              <Navigate to="/onboarding" replace />
            ) : session.user.accountType === "host" ? (
              <HostDashBoardPage />
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

        <Route
          path="/dashboard"
          element={
            !session ? (
              <Navigate to="/home" replace />
            ) : !session.user.onboardingCompleted ? (
              <Navigate to="/onboarding" replace />
            ) : session.user.accountType === "host" ? (
              <HostDashBoardPage />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;
