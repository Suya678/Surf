import "./App.css";
import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import { authClient } from "./lib/auth";
import LoginPage from "./pages/LoginPage";
import PageLoader from "./components/PageLoader";
import { Navigate } from "react-router";
import AboutPage from "./pages/AboutPage";
import OnboardingPage from "./pages/OnboardingPage";
import { useEffect, useState } from "react";

function App() {
  const { data: session, isPending } = authClient.useSession();
  const [isOnboarded, setIsOnboarded] = useState(false);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      let navigate = Navigate();

      if (session?.user) {
        try {
          const res = await fetch("/api/user/onboarding-status", {
            credentials: "include",
          });
          const data = await res.json();
          if (data.isOnboarded) {
            setIsOnboarded(data.isOnboarded);
            navigate("/home");
          } else {
            navigate("/onboarding");
          }
          setIsOnboarded(data.isOnboarded);
        } catch (err) {
          console.error("Failed to check onboarding status:", err);
          setIsOnboarded(false);
        }
      } else {
        setIsOnboarded(false); // Reset when logged out
      }
    };
    checkOnboardingStatus();
  }, [session]);

  if (isPending) return <PageLoader />;

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />

        <Route
          path="/login"
          element={!session ? <LoginPage /> : <Navigate to="/home" />}
        />
      </Routes>
    </>
  );
}

export default App;
