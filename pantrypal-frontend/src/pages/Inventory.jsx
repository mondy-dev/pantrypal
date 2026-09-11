import { useEffect, useMemo, useState } from "react";
import * as foodService from "../services/foodService";
import AddFoodModal from "../components/AddFoodModal";
import FoodDetailsModal from "../components/FoodDetailsModal";

function Inventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [storageFilter, setStorageFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    foodService
      .getAllFoodItems()
      .then(setItems)
      .catch(() => setError("Could not load your inventory."))
      .finally(() => setLoading(false));
  }, []);

  const handleCreated = (newItem) => {
    setItems((prev) => [...prev, newItem]);
  };

  const handleUpdated = (updatedItem) => {
    setItems((prev) =>
      prev.map((i) => (i.id === updatedItem.id ? updatedItem : i)),
    );
    setSelectedItem(updatedItem);
  };

  const handleDeleted = (deletedId) => {
    setItems((prev) => prev.filter((i) => i.id !== deletedId));
  };

  const categoryOptions = useMemo(
    () => [...new Set(items.map((i) => i.categoryName))].sort(),
    [items],
  );

  const storageOptions = useMemo(
    () =>
      [...new Set(items.map((i) => i.storageLocation).filter(Boolean))].sort(),
    [items],
  );

  const isLowStock = (item) =>
    item.minimumStock != null &&
    Number(item.quantity) <= Number(item.minimumStock);

  const visibleItems = useMemo(() => {
    let result = items;

    if (search.trim()) {
      const term = search.trim().toLowerCase();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(term) ||
          (i.brand && i.brand.toLowerCase().includes(term)) ||
          i.categoryName.toLowerCase().includes(term),
      );
    }

    if (categoryFilter) {
      result = result.filter((i) => i.categoryName === categoryFilter);
    }

    if (storageFilter) {
      result = result.filter((i) => i.storageLocation === storageFilter);
    }

    if (stockFilter === "low") {
      result = result.filter(isLowStock);
    }

    result = [...result].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "expirationDate")
        return a.expirationDate.localeCompare(b.expirationDate);
      if (sortBy === "quantity") return Number(b.quantity) - Number(a.quantity);
      if (sortBy === "createdAt") return b.createdAt.localeCompare(a.createdAt);
      return 0;
    });

    return result;
  }, [items, search, categoryFilter, storageFilter, stockFilter, sortBy]);

  if (loading) return <p>Loading inventory...</p>;

  return (
    <div style={{ padding: "32px" }}>
      <h1>Inventory</h1>
      <button onClick={() => setShowAddModal(true)}>+ Add Food</button>

      {error && <p className="error-message">{error}</p>}

      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          margin: "16px 0",
        }}
      >
        <input
          type="text"
          placeholder="Search by name, brand, category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {categoryOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={storageFilter}
          onChange={(e) => setStorageFilter(e.target.value)}
        >
          <option value="">All Storage Locations</option>
          {storageOptions.map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ")}
            </option>
          ))}
        </select>

        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
        >
          <option value="">All Stock Levels</option>
          <option value="low">Low Stock Only</option>
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="name">Sort: Name</option>
          <option value="expirationDate">Sort: Expiration Date</option>
          <option value="quantity">Sort: Quantity</option>
          <option value="createdAt">Sort: Date Added</option>
        </select>
      </div>

      {visibleItems.length === 0 && (
        <p>No food items match your search/filters.</p>
      )}

      <ul>
        {visibleItems.map((item) => (
          <li
            key={item.id}
            style={{ marginBottom: "8px", cursor: "pointer" }}
            onClick={() => setSelectedItem(item)}
          >
            <strong>{item.name}</strong> — {item.quantity} {item.unit} —{" "}
            {item.categoryName} — Expires: {item.expirationDate}
            {isLowStock(item) && (
              <span style={{ color: "var(--color-danger)" }}> (Low Stock)</span>
            )}
          </li>
        ))}
      </ul>

      {showAddModal && (
        <AddFoodModal
          onClose={() => setShowAddModal(false)}
          onCreated={handleCreated}
        />
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

export default Inventory;
