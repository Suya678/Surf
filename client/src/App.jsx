import "./App.css";
import { Route, Routes, Navigate } from "react-router";
import { Toaster } from "react-hot-toast";
import { authClient } from "./lib/auth";

// Components
import PageLoader from "./components/PageLoader";
import {
  RequireOnboarding,
  RequireHost,
  RequireGuest,
  RedirectIfAuth,
  RedirectIfOnboarded,
} from "./components/RouteGuards";

// Pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import OnboardingPage from "./pages/OnboardingPage";
import HostDashboardPage from "./pages/HostDashBoardPage";
import GuestDashboardPage from "./pages/GuestDashBoardPage";
import SearchPage from "./pages/SearchPage";
import AddListingPage from "./pages/AddListingPage";

function App() {
  const { data: session, isPending } = authClient.useSession();

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
        {/* ===== ROOT ===== */}
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

        {/* ===== PUBLIC ROUTES ===== */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />

        {/* ===== AUTH ROUTES ===== */}
        <Route
          path="/login"
          element={
            <RedirectIfAuth session={session}>
              <LoginPage />
            </RedirectIfAuth>
          }
        />

        <Route
          path="/onboarding"
          element={
            <RedirectIfOnboarded session={session}>
              <OnboardingPage />
            </RedirectIfOnboarded>
          }
        />

        {/* ===== DASHBOARD ROUTER ===== */}
        <Route
          path="/dashboard"
          element={
            <RequireOnboarding session={session}>
              {session?.user?.accountType === "host" ? (
                <Navigate to="/hostDashboard" replace />
              ) : (
                <Navigate to="/guestDashboard" replace />
              )}
            </RequireOnboarding>
          }
        />

        {/* ===== HOST ROUTES ===== */}
        <Route
          path="/hostDashboard"
          element={
            <RequireHost session={session}>
              <HostDashboardPage />
            </RequireHost>
          }
        />

        <Route
          path="/addListing"
          element={
            <RequireHost session={session}>
              <AddListingPage />
            </RequireHost>
          }
        />

        {/* ===== GUEST ROUTES ===== */}
        <Route
          path="/guestDashboard"
          element={
            <RequireGuest session={session}>
              <GuestDashboardPage />
            </RequireGuest>
          }
        />

        <Route
          path="/search"
          element={
            <RequireGuest session={session}>
              <SearchPage />
            </RequireGuest>
          }
        />

        {/* ===== FALLBACK ===== */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
