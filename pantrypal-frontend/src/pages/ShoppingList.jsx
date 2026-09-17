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
    Number(item.quantity) < Number(item.minimumStock);

  const listedNames = items.map((i) => i.name.toLowerCase());
  const suggestions = foodItems.filter(
    (f) => isLowStock(f) && !listedNames.includes(f.name.toLowerCase()),
  );

  const pendingItems = items.filter((i) => !i.purchased);
  const purchasedItems = items.filter((i) => i.purchased);

  if (loading)
    return (
      <div className="page">
        <p>Loading shopping list...</p>
      </div>
    );

  return (
    <div className="page">
      <div className="page-header">
        <h1>Shopping List</h1>
      </div>

      {error && <p className="error-message">{error}</p>}

      {suggestions.length > 0 && (
        <div className="suggestion-box">
          <h2 className="section-heading">Suggested (Low Stock)</h2>
          {suggestions.map((f) => (
            <div key={f.id} className="suggestion-row">
              <span>
                <strong>{f.name}</strong> is running low ({f.quantity} {f.unit}{" "}
                left)
              </span>
              <button
                type="button"
                className="btn-secondary btn-small"
                onClick={() => handleAddSuggestion(f)}
              >
                Add to list
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleAdd} className="shopping-add-form">
        <input
          placeholder="Item name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          placeholder="Qty"
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
        <button type="submit" className="btn-primary">
          Add Item
        </button>
      </form>

      <h2 className="section-heading">Pending ({pendingItems.length})</h2>
      {pendingItems.length === 0 ? (
        <div className="empty-state">
          <p>Nothing pending.</p>
        </div>
      ) : (
        <div className="shopping-list-group">
          {pendingItems.map((item) => (
            <div key={item.id} className="shopping-row">
              {editingId === item.id ? (
                <>
                  <input
                    className="shopping-edit-input"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                  />
                  <input
                    className="shopping-edit-input shopping-edit-qty"
                    type="number"
                    step="any"
                    value={editForm.quantity}
                    onChange={(e) =>
                      setEditForm({ ...editForm, quantity: e.target.value })
                    }
                  />
                  <input
                    className="shopping-edit-input shopping-edit-qty"
                    value={editForm.unit}
                    onChange={(e) =>
                      setEditForm({ ...editForm, unit: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    className="btn-primary btn-small"
                    onClick={() => handleSaveEdit(item.id)}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn-secondary btn-small"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="checkbox"
                    className="shopping-checkbox"
                    checked={false}
                    onChange={() => handleToggle(item.id)}
                  />
                  <span className="shopping-row-text">
                    {item.name}
                    {item.quantity ? (
                      <span className="shopping-row-qty">
                        {" "}
                        — {item.quantity} {item.unit || ""}
                      </span>
                    ) : null}
                  </span>
                  <button
                    type="button"
                    className="btn-secondary btn-small"
                    onClick={() => startEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn-danger btn-small"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <h2 className="section-heading">Purchased ({purchasedItems.length})</h2>
      {purchasedItems.length === 0 ? (
        <div className="empty-state">
          <p>Nothing purchased yet.</p>
        </div>
      ) : (
        <div className="shopping-list-group">
          {purchasedItems.map((item) => (
            <div key={item.id} className="shopping-row purchased">
              <input
                type="checkbox"
                className="shopping-checkbox"
                checked={true}
                onChange={() => handleToggle(item.id)}
              />
              <span className="shopping-row-text">
                {item.name}
                {item.quantity ? (
                  <span className="shopping-row-qty">
                    {" "}
                    — {item.quantity} {item.unit || ""}
                  </span>
                ) : null}
              </span>
              <button
                type="button"
                className="btn-danger btn-small"
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ShoppingList;
