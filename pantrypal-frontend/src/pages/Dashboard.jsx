import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <p>Email: {user?.email}</p>
      <button onClick={handleLogout}>Logout</button>
      <p>
        This is a placeholder Dashboard. Real inventory data comes in Sprint
        4-5.
      </p>
    </div>
  );
}

export default Dashboard;
