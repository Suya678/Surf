import { useNavigate } from "react-router";
import { authClient } from "../lib/auth";

const LogoutButton = () => {
  const navigate = useNavigate();

  // Logs the current user out
  const handleLogout = async () => {
    await authClient.signOut();
    navigate("/home"); // Changed to /home instead of /login
  };

  return (
    <button onClick={handleLogout} className="btn btn-sm">
      Logout
    </button>
  );
};

export default LogoutButton;
