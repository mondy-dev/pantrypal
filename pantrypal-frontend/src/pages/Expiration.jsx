import { useEffect, useState } from "react";
import * as foodService from "../services/foodService";
import FoodDetailsModal from "../components/FoodDetailsModal";

const TABS = [
  { key: "ALL", label: "All" },
  { key: "EXPIRING_SOON", label: "Expiring Soon" },
  { key: "CRITICAL", label: "Critical" },
  { key: "EXPIRED", label: "Expired" },
];

function Expiration() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    foodService
      .getAllFoodItems()
      .then((data) => {
        const sorted = [...data].sort(
          (a, b) => a.daysUntilExpiration - b.daysUntilExpiration,
        );
        setItems(sorted);
      })
      .catch(() => setError("Could not load your inventory."))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdated = (updatedItem) => {
    setItems((prev) =>
      prev.map((i) => (i.id === updatedItem.id ? updatedItem : i)),
    );
    setSelectedItem(updatedItem);
  };

  const handleDeleted = (deletedId) => {
    setItems((prev) => prev.filter((i) => i.id !== deletedId));
  };

  const visibleItems =
    activeTab === "ALL"
      ? items
      : items.filter((i) => i.expirationStatus === activeTab);

  const formatDaysRemaining = (item) => {
    if (item.expirationStatus === "EXPIRED") {
      return `Expired ${Math.abs(item.daysUntilExpiration)} day(s) ago`;
    }
    if (item.daysUntilExpiration === 0) {
      return "Expires today";
    }
    return `${item.daysUntilExpiration} day(s) remaining`;
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "32px" }}>
      <h1>Expiration Monitoring</h1>

      {error && <p className="error-message">{error}</p>}

      <div style={{ display: "flex", gap: "8px", margin: "16px 0" }}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              fontWeight: activeTab === tab.key ? "bold" : "normal",
              textDecoration: activeTab === tab.key ? "underline" : "none",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {visibleItems.length === 0 && <p>No items in this category.</p>}

      <ul>
        {visibleItems.map((item) => (
          <li
            key={item.id}
            style={{ marginBottom: "8px", cursor: "pointer" }}
            onClick={() => setSelectedItem(item)}
          >
            <strong>{item.name}</strong> — {item.expirationDate} —{" "}
            {formatDaysRemaining(item)} —{" "}
            <span>{item.expirationStatus.replace("_", " ")}</span>
          </li>
        ))}
      </ul>

      {selectedItem && (
        <FoodDetailsModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onUpdated={handleUpdated}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}

export default Expiration;
