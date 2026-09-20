import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Package,
  ShoppingCart,
  Home,
  Clock,
  BarChart3,
} from "lucide-react";
import { useAuth } from "../context/useAuth";
import * as foodService from "../services/foodService";
import AddFoodModal from "../components/AddFoodModal";

function formatEntry(entry) {
  const name = entry.foodItemName;
  if (entry.actionType === "ADDED")
    return `Added ${entry.quantityChange} ${entry.unit} of ${name}`;
  if (entry.actionType === "CONSUMED")
    return `Consumed ${entry.quantityChange} ${entry.unit} of ${name}`;
  if (entry.actionType === "DELETED") return `Removed ${name}`;
  return `${entry.actionType} — ${name}`;
}

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const loadData = () => {
    Promise.all([foodService.getAllFoodItems(), foodService.getHistory()])
      .then(([foodData, historyData]) => {
        setItems(foodData);
        setRecentActivity(historyData.slice(0, 5));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const expiredCount = items.filter(
    (i) => i.expirationStatus === "EXPIRED",
  ).length;
  const criticalCount = items.filter(
    (i) => i.expirationStatus === "CRITICAL",
  ).length;
  const expiringSoonCount = items.filter(
    (i) => i.expirationStatus === "EXPIRING_SOON",
  ).length;

  const outOfStockItems = items.filter((i) => Number(i.quantity) === 0);
  const lowStockItems = items.filter(
    (i) =>
      i.minimumStock != null &&
      Number(i.quantity) > 0 &&
      Number(i.quantity) < Number(i.minimumStock),
  );

  const categoryCount = new Set(items.map((i) => i.categoryName)).size;
  const hasAlerts =
    expiredCount > 0 ||
    criticalCount > 0 ||
    expiringSoonCount > 0 ||
    lowStockItems.length > 0;

  const QUICK_ACTIONS = [
    { label: "Add Food", icon: Plus, onClick: () => setShowAddModal(true) },
    {
      label: "Inventory",
      icon: Package,
      onClick: () => navigate("/inventory"),
    },
    {
      label: "Shopping List",
      icon: ShoppingCart,
      onClick: () => navigate("/shopping-list"),
    },
    { label: "Household", icon: Home, onClick: () => navigate("/household") },
    {
      label: "Expiration",
      icon: Clock,
      onClick: () => navigate("/expiration"),
    },
    { label: "Reports", icon: BarChart3, onClick: () => navigate("/reports") },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Welcome, {user?.firstName}!</h1>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-value">{items.length}</span>
          <span className="stat-label">Total Items</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{categoryCount}</span>
          <span className="stat-label">Categories in Use</span>
        </div>
        <div className="stat-card stat-card-warning">
          <span className="stat-value">{lowStockItems.length}</span>
          <span className="stat-label">Low Stock</span>
        </div>
        <div className="stat-card stat-card-danger">
          <span className="stat-value">{outOfStockItems.length}</span>
          <span className="stat-label">Out of Stock</span>
        </div>
      </div>

      <h2 className="section-heading">Quick Actions</h2>
      <div className="quick-action-grid">
        {QUICK_ACTIONS.map(({ label, icon: Icon, onClick }) => (
          <button key={label} className="quick-action-tile" onClick={onClick}>
            <Icon size={22} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="dashboard-columns">
        <section>
          <h2 className="section-heading">Alerts</h2>
          {!loading && !hasAlerts && (
            <div className="empty-state">
              <p>No alerts right now.</p>
            </div>
          )}
          {expiredCount > 0 && (
            <p className="alert-line alert-danger">
              {expiredCount} item{expiredCount > 1 ? "s have" : " has"} already
              expired.
            </p>
          )}
          {criticalCount > 0 && (
            <p className="alert-line alert-danger">
              {criticalCount} item{criticalCount > 1 ? "s" : ""} expiring within
              7 days.
            </p>
          )}
          {expiringSoonCount > 0 && (
            <p className="alert-line alert-warning">
              {expiringSoonCount} item{expiringSoonCount > 1 ? "s" : ""}{" "}
              expiring this month.
            </p>
          )}
          {lowStockItems.map((item) => (
            <p key={item.id} className="alert-line alert-warning">
              {item.name} is running low ({item.quantity} {item.unit} left).
            </p>
          ))}
        </section>

        <section>
          <h2 className="section-heading">Recent Activity</h2>
          {recentActivity.length === 0 ? (
            <div className="empty-state">
              <p>No activity yet.</p>
            </div>
          ) : (
            <div className="history-list">
              {recentActivity.map((entry) => (
                <div key={entry.id} className="history-row">
                  <div
                    className={
                      "history-icon history-icon-" +
                      entry.actionType.toLowerCase()
                    }
                  >
                    {entry.actionType === "ADDED"
                      ? "＋"
                      : entry.actionType === "CONSUMED"
                        ? "✓"
                        : "－"}
                  </div>
                  <div className="history-content">
                    <p className="history-text">{formatEntry(entry)}</p>
                    <p className="history-meta">
                      {entry.userName} ·{" "}
                      {new Date(entry.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {showAddModal && (
        <AddFoodModal
          onClose={() => setShowAddModal(false)}
          onCreated={loadData}
        />
      )}
    </div>
  );
}

export default Dashboard;
