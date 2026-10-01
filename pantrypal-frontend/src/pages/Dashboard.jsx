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
import { useHousehold } from "../context/useHousehold";
import * as foodService from "../services/foodService";
import AddFoodModal from "../components/AddFoodModal";
import NotificationBell from "../components/NotificationBell";
import UserMenu from "../components/UserMenu";
import CategoryDonutChart from "../components/CategoryDonutChart";

const CATEGORY_COLORS = [
  "#2f4b3c",
  "#d9a441",
  "#c4472e",
  "#5b7f97",
  "#8a6d3b",
  "#6b8f5c",
  "#9c6b96",
  "#4a90a4",
];

function formatEntry(entry) {
  const name = entry.foodItemName;
  if (entry.actionType === "ADDED")
    return `Added ${entry.quantityChange} ${entry.unit} of ${name}`;
  if (entry.actionType === "CONSUMED")
    return `Consumed ${entry.quantityChange} ${entry.unit} of ${name}`;
  if (entry.actionType === "DELETED") return `Removed ${name}`;
  return `${entry.actionType} — ${name}`;
}

const isOther = (name) => name.trim().toLowerCase() === "other";

function Dashboard() {
  const { user, logout } = useAuth();
  const { household, clearHousehold } = useHousehold();
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

  const expiredItems = items.filter((i) => i.expirationStatus === "EXPIRED");
  const criticalItems = items.filter((i) => i.expirationStatus === "CRITICAL");
  const expiringSoonItems = items.filter(
    (i) => i.expirationStatus === "EXPIRING_SOON",
  );

  const outOfStockItems = items.filter((i) => Number(i.quantity) === 0);
  const lowStockItems = items.filter(
    (i) =>
      i.minimumStock != null &&
      Number(i.quantity) > 0 &&
      Number(i.quantity) < Number(i.minimumStock),
  );

  const categoryCounts = items.reduce((acc, item) => {
    const name = item.categoryName || "Uncategorized";
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});
  const categoryData = Object.entries(categoryCounts)
    .sort(([nameA, countA], [nameB, countB]) => {
      if (isOther(nameA) !== isOther(nameB)) return isOther(nameA) ? 1 : -1;
      return countB - countA;
    })
    .map(([name, count], i) => ({
      name,
      count,
      color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
    }));
  const categoryCount = categoryData.length;

  const hasAlerts =
    expiredItems.length > 0 ||
    criticalItems.length > 0 ||
    expiringSoonItems.length > 0 ||
    lowStockItems.length > 0;

  const notifications = [
    ...expiredItems.map((i) => ({
      id: `expired-${i.id}`,
      type: "danger",
      message: `${i.name} has expired`,
      path: "/expiration",
    })),
    ...criticalItems.map((i) => ({
      id: `critical-${i.id}`,
      type: "danger",
      message: `${i.name} expires within 7 days`,
      path: "/expiration",
    })),
    ...expiringSoonItems.map((i) => ({
      id: `soon-${i.id}`,
      type: "warning",
      message: `${i.name} is expiring this month`,
      path: "/expiration",
    })),
    ...outOfStockItems.map((i) => ({
      id: `out-${i.id}`,
      type: "danger",
      message: `${i.name} is out of stock`,
      path: "/shopping-list",
    })),
    ...lowStockItems.map((i) => ({
      id: `low-${i.id}`,
      type: "warning",
      message: `${i.name} is running low (${i.quantity} ${i.unit} left)`,
      path: "/shopping-list",
    })),
  ];

  const handleLogout = () => {
    logout();
    clearHousehold();
    navigate("/login");
  };

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
      <div className="page-header dashboard-topbar">
        <div>
          <h1>Welcome, {user?.firstName}!</h1>
          {household?.name && (
            <p className="dashboard-subtitle">{household.name}</p>
          )}
        </div>

        <div className="topbar-actions">
          <NotificationBell
            alerts={notifications}
            onSelect={(alert) => navigate(alert.path)}
          />
          <UserMenu
            user={user}
            householdName={household?.name}
            onLogout={handleLogout}
          />
        </div>
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

      <div className="overview-card">
        <h2 className="section-heading overview-heading">
          Inventory by Category
        </h2>
        {loading ? (
          <p className="report-empty">Loading...</p>
        ) : (
          <CategoryDonutChart data={categoryData} />
        )}
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
          {expiredItems.length > 0 && (
            <p className="alert-line alert-danger">
              {expiredItems.length} item
              {expiredItems.length > 1 ? "s have" : " has"} already expired.
            </p>
          )}
          {criticalItems.length > 0 && (
            <p className="alert-line alert-danger">
              {criticalItems.length} item{criticalItems.length > 1 ? "s" : ""}{" "}
              expiring within 7 days.
            </p>
          )}
          {expiringSoonItems.length > 0 && (
            <p className="alert-line alert-warning">
              {expiringSoonItems.length} item
              {expiringSoonItems.length > 1 ? "s" : ""} expiring this month.
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
