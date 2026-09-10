import { useEffect, useState } from "react";
import * as foodService from "../services/foodService";
import AddFoodModal from "../components/AddFoodModal";

function Inventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

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

  if (loading) return <p>Loading inventory...</p>;

  return (
    <div style={{ padding: "32px" }}>
      <h1>Inventory</h1>
      <button onClick={() => setShowAddModal(true)}>+ Add Food</button>

      {error && <p className="error-message">{error}</p>}
      {items.length === 0 && <p>No food items yet.</p>}

      <ul>
        {items.map((item) => (
          <li key={item.id} style={{ marginBottom: "8px" }}>
            <strong>{item.name}</strong> — {item.quantity} {item.unit} —{" "}
            {item.categoryName} — Expires: {item.expirationDate}
          </li>
        ))}
      </ul>

      {showAddModal && (
        <AddFoodModal
          onClose={() => setShowAddModal(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
}

export default Inventory;
