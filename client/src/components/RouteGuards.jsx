import { Navigate } from "react-router";

// Requires authentication
export function RequireAuth({ session, children }) {
  if (!session) {
    return <Navigate to="/home" replace />;
  }
  return children;
}

// Requires completed onboarding
export function RequireOnboarding({ session, children }) {
  if (!session) {
    return <Navigate to="/home" replace />;
  }
  if (!session.user?.onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }
  return children;
}

// Requires host account
export function RequireHost({ session, children }) {
  if (!session) {
    return <Navigate to="/home" replace />;
  }
  if (!session.user?.onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }
  if (session.user?.accountType !== "host") {
    return <Navigate to="/guestDashboard" replace />;
  }
  return children;
}

// Requires guest account
export function RequireGuest({ session, children }) {
  if (!session) {
    return <Navigate to="/home" replace />;
  }
  if (!session.user?.onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }
  if (session.user?.accountType !== "guest") {
    return <Navigate to="/hostDashboard" replace />;
  }
  return children;
}

// Redirects authenticated users away (for login page)
export function RedirectIfAuth({ session, children }) {
  if (session) {
    return <Navigate to="/" replace />;
  }
  return children;
}

// Redirects if onboarding is already completed
export function RedirectIfOnboarded({ session, children }) {
  if (!session) {
    return <Navigate to="/home" replace />;
  }
  if (session.user?.onboardingCompleted) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}
