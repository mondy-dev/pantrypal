import { useEffect, useState } from "react";
import * as shoppingService from "../services/shoppingService";
import * as foodService from "../services/foodService";

function ShoppingList() {
  const [items, setItems] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    quantity: "",
    unit: "",
  });

  useEffect(() => {
    Promise.all([
      shoppingService.getShoppingList(),
      foodService.getAllFoodItems(),
    ])
      .then(([shoppingData, foodData]) => {
        setItems(shoppingData);
        setFoodItems(foodData);
      })
      .catch(() => setError("Could not load your shopping list."))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const newItem = await shoppingService.addShoppingItem(
        name,
        quantity ? Number(quantity) : null,
        unit,
      );
      setItems((prev) => [...prev, newItem]);
      setName("");
      setQuantity("");
      setUnit("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not add item.");
    }
  };

  const handleToggle = async (id) => {
    const updated = await shoppingService.togglePurchased(id);
    setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
  };

  const handleDelete = async (id) => {
    await shoppingService.deleteShoppingItem(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditForm({
      name: item.name,
      quantity: item.quantity || "",
      unit: item.unit || "",
    });
  };

  const handleSaveEdit = async (id) => {
    const updated = await shoppingService.updateShoppingItem(
      id,
      editForm.name,
      editForm.quantity ? Number(editForm.quantity) : null,
      editForm.unit,
    );
    setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
    setEditingId(null);
  };

  const handleAddSuggestion = async (foodItem) => {
    const newItem = await shoppingService.addShoppingItem(
      foodItem.name,
      foodItem.minimumStock,
      foodItem.unit,
    );
    setItems((prev) => [...prev, newItem]);
  };

  const isLowStock = (item) =>
    item.minimumStock != null &&
    Number(item.quantity) <= Number(item.minimumStock);

  const listedNames = items.map((i) => i.name.toLowerCase());
  const suggestions = foodItems.filter(
    (f) => isLowStock(f) && !listedNames.includes(f.name.toLowerCase()),
  );

  const pendingItems = items.filter((i) => !i.purchased);
  const purchasedItems = items.filter((i) => i.purchased);

  if (loading) return <p>Loading shopping list...</p>;

  return (
    <div style={{ padding: "32px" }}>
      <h1>Shopping List</h1>

      {error && <p className="error-message">{error}</p>}

      {suggestions.length > 0 && (
        <div style={{ marginBottom: "24px" }}>
          <h2>Suggested (Low Stock)</h2>
          <ul>
            {suggestions.map((f) => (
              <li key={f.id} style={{ marginBottom: "6px" }}>
                {f.name} is running low ({f.quantity} {f.unit} left).{" "}
                <button type="button" onClick={() => handleAddSuggestion(f)}>
                  Add to list
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <form
        onSubmit={handleAdd}
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}
      >
        <input
          placeholder="Item name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          placeholder="Quantity"
          type="number"
          step="any"
          min="0"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <input
          placeholder="Unit"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        />
        <button type="submit">Add Item</button>
      </form>

      <h2>Pending</h2>
      {pendingItems.length === 0 && <p>Nothing pending.</p>}
      <ul>
        {pendingItems.map((item) => (
          <li key={item.id} style={{ marginBottom: "8px" }}>
            {editingId === item.id ? (
              <>
                <input
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                />
                <input
                  type="number"
                  step="any"
                  value={editForm.quantity}
                  onChange={(e) =>
                    setEditForm({ ...editForm, quantity: e.target.value })
                  }
                />
                <input
                  value={editForm.unit}
                  onChange={(e) =>
                    setEditForm({ ...editForm, unit: e.target.value })
                  }
                />
                <button type="button" onClick={() => handleSaveEdit(item.id)}>
                  Save
                </button>
                <button type="button" onClick={() => setEditingId(null)}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <input
                  type="checkbox"
                  checked={false}
                  onChange={() => handleToggle(item.id)}
                />{" "}
                {item.name}{" "}
                {item.quantity ? `— ${item.quantity} ${item.unit || ""}` : ""}{" "}
                <button type="button" onClick={() => startEdit(item)}>
                  Edit
                </button>
                <button type="button" onClick={() => handleDelete(item.id)}>
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      <h2>Purchased</h2>
      {purchasedItems.length === 0 && <p>Nothing purchased yet.</p>}
      <ul>
        {purchasedItems.map((item) => (
          <li
            key={item.id}
            style={{ marginBottom: "8px", textDecoration: "line-through" }}
          >
            <input
              type="checkbox"
              checked={true}
              onChange={() => handleToggle(item.id)}
            />{" "}
            {item.name}{" "}
            {item.quantity ? `— ${item.quantity} ${item.unit || ""}` : ""}{" "}
            <button
              type="button"
              onClick={() => handleDelete(item.id)}
              style={{ textDecoration: "none" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ShoppingList;
