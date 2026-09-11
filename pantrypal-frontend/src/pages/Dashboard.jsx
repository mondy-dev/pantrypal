import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import * as foodService from "../services/foodService";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    foodService
      .getAllFoodItems()
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const expiredCount = items.filter(
    (i) => i.expirationStatus === "EXPIRED",
  ).length;
  const criticalCount = items.filter(
    (i) => i.expirationStatus === "CRITICAL",
  ).length;
  const expiringSoonCount = items.filter(
    (i) => i.expirationStatus === "EXPIRING_SOON",
  ).length;
  const lowStockItems = items.filter(
    (i) =>
      i.minimumStock != null && Number(i.quantity) <= Number(i.minimumStock),
  );

  return (
    <div style={{ padding: "32px" }}>
      <h1>Welcome, {user?.firstName}!</h1>
      <p>Email: {user?.email}</p>

      <div style={{ display: "flex", gap: "12px", margin: "16px 0" }}>
        <button onClick={handleLogout}>Logout</button>
        <button onClick={() => navigate("/household")}>View Household</button>
        <button onClick={() => navigate("/inventory")}>View Inventory</button>
        <button onClick={() => navigate("/expiration")}>View Expiration</button>
        <button onClick={() => navigate("/history")}>View History</button>
        <button onClick={() => navigate("/shopping-list")}>
          View Shopping List
        </button>
        <button onClick={() => navigate("/reports")}>View Reports</button>
      </div>

      {!loading && (
        <div style={{ marginTop: "24px" }}>
          <h2>Alerts</h2>

          {expiredCount === 0 &&
            criticalCount === 0 &&
            expiringSoonCount === 0 &&
            lowStockItems.length === 0 && (
              <p>No alerts right now — everything looks good.</p>
            )}

          {expiredCount > 0 && (
            <p style={{ color: "var(--color-danger)" }}>
              {expiredCount} item{expiredCount > 1 ? "s have" : " has"} already
              expired.
            </p>
          )}

          {criticalCount > 0 && (
            <p style={{ color: "var(--color-danger)" }}>
              {criticalCount} item{criticalCount > 1 ? "s" : ""} expiring within
              7 days.
            </p>
          )}

          {expiringSoonCount > 0 && (
            <p style={{ color: "var(--color-warning)" }}>
              {expiringSoonCount} item{expiringSoonCount > 1 ? "s" : ""}{" "}
              expiring this month.
            </p>
          )}

          {lowStockItems.map((item) => (
            <p key={item.id} style={{ color: "var(--color-warning)" }}>
              {item.name} is running low ({item.quantity} {item.unit} left).
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
