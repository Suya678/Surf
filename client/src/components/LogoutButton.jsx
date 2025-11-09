import { useNavigate } from "react-router";
import { authClient } from "../lib/auth";

const LogoutButton = () => {
  const navigate = useNavigate();

  // Logs the current user out
  const handleLogout = async () => {
    await authClient.signOut();
    navigate("/login");
  };

  return (
    <button onClick={handleLogout} className="btn btn-outline">
      Logout
    </button>
  );
};

export default LogoutButton;
