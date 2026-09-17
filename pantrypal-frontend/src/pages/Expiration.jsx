import { useEffect, useState } from "react";
import * as foodService from "../services/foodService";
import FoodDetailsModal from "../components/FoodDetailsModal";
import StampBadge from "../components/StampBadge";

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

  if (loading)
    return (
      <div className="page">
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="page">
      <div className="page-header">
        <h1>Expiration Monitoring</h1>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={"tab" + (activeTab === tab.key ? " active" : "")}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {visibleItems.length === 0 ? (
        <div className="empty-state">
          <p>No items in this category.</p>
        </div>
      ) : (
        <div className="expiry-list">
          {visibleItems.map((item) => (
            <div
              key={item.id}
              className="expiry-row"
              onClick={() => setSelectedItem(item)}
            >
              <div className="expiry-row-main">
                <span className="expiry-row-name">{item.name}</span>
                <span className="expiry-row-category">{item.categoryName}</span>
              </div>
              <div className="expiry-row-meta">
                <span className="expiry-row-days">
                  {formatDaysRemaining(item)}
                </span>
                <StampBadge status={item.expirationStatus} />
              </div>
            </div>
          ))}
        </div>
      )}

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
