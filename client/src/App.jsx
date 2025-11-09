import "./App.css";
import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import { authClient } from "./lib/auth";
import LoginPage from "./pages/LoginPage";
import PageLoader from "./components/PageLoader";
import { Navigate } from "react-router";
import AboutPage from "./pages/AboutPage";
import OnboardingPage from "./pages/OnboardingPage";
function App() {
  const { data: session, isPending } = authClient.useSession();
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
