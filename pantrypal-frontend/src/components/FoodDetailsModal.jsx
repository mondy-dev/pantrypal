import { useEffect, useState } from "react";
import * as foodService from "../services/foodService";
import * as categoryService from "../services/categoryService";

const STORAGE_LOCATIONS = [
  "PANTRY",
  "REFRIGERATOR",
  "FREEZER",
  "KITCHEN_CABINET",
  "OTHER",
];

function FoodDetailsModal({ item, onClose, onUpdated, onDeleted }) {
  const [editing, setEditing] = useState(false);
  const [consuming, setConsuming] = useState(false);
  const [consumeAmount, setConsumeAmount] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: item.name || "",
    categoryId: item.categoryId || "",
    brand: item.brand || "",
    quantity: item.quantity ?? "",
    unit: item.unit || "",
    purchaseDate: item.purchaseDate || "",
    expirationDate: item.expirationDate || "",
    storageLocation: item.storageLocation || "",
    minimumStock: item.minimumStock ?? "",
    price: item.price ?? "",
    notes: item.notes || "",
  });

  useEffect(() => {
    if (editing) {
      categoryService
        .getCategories()
        .then(setCategories)
        .catch(() => {});
    }
  }, [editing]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        ...form,
        categoryId: Number(form.categoryId),
        quantity: Number(form.quantity),
        minimumStock:
          form.minimumStock !== "" ? Number(form.minimumStock) : null,
        price: form.price !== "" ? Number(form.price) : null,
        purchaseDate: form.purchaseDate || null,
        storageLocation: form.storageLocation || null,
      };

      const updated = await foodService.updateFoodItem(item.id, payload);
      onUpdated(updated);
      setEditing(false);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        Object.values(err.response?.data || {})[0] ||
        "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`))
      return;

    try {
      await foodService.deleteFoodItem(item.id);
      onDeleted(item.id);
      onClose();
    } catch {
      setError("Could not delete this item.");
    }
  };

  const handleConsume = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const updated = await foodService.consumeFoodItem(
        item.id,
        Number(consumeAmount),
      );
      onUpdated(updated);
      setConsuming(false);
      setConsumeAmount("");
    } catch (err) {
      const message =
        err.response?.data?.message || "Could not consume this item.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          padding: "32px",
          borderRadius: "8px",
          width: "100%",
          maxWidth: "480px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {error && <p className="error-message">{error}</p>}

        {!editing ? (
          <>
            <h2>{item.name}</h2>
            <p>
              <strong>Category:</strong> {item.categoryName}
            </p>
            {item.brand && (
              <p>
                <strong>Brand:</strong> {item.brand}
              </p>
            )}
            <p>
              <strong>Quantity:</strong> {item.quantity} {item.unit}
            </p>
            {item.purchaseDate && (
              <p>
                <strong>Purchase Date:</strong> {item.purchaseDate}
              </p>
            )}
            <p>
              <strong>Expiration Date:</strong> {item.expirationDate}
            </p>
            {item.storageLocation && (
              <p>
                <strong>Storage:</strong>{" "}
                {item.storageLocation.replace("_", " ")}
              </p>
            )}
            {item.minimumStock != null && (
              <p>
                <strong>Minimum Stock:</strong> {item.minimumStock}
              </p>
            )}
            {item.price != null && (
              <p>
                <strong>Price:</strong> {item.price}
              </p>
            )}
            {item.notes && (
              <p>
                <strong>Notes:</strong> {item.notes}
              </p>
            )}

            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <button type="button" onClick={onClose}>
                Close
              </button>
              <button type="button" onClick={() => setEditing(true)}>
                Edit
              </button>
              <button type="button" onClick={() => setConsuming(true)}>
                Consume
              </button>
              <button type="button" onClick={handleDelete}>
                Delete
              </button>
            </div>

            {consuming && (
              <form
                onSubmit={handleConsume}
                style={{
                  marginTop: "16px",
                  borderTop: "1px solid var(--color-border)",
                  paddingTop: "16px",
                }}
              >
                <label htmlFor="consumeAmount">Amount Consumed</label>
                <input
                  id="consumeAmount"
                  type="number"
                  step="any"
                  min="0.01"
                  max={item.quantity}
                  value={consumeAmount}
                  onChange={(e) => setConsumeAmount(e.target.value)}
                  required
                />
                <p style={{ fontSize: "13px", color: "var(--color-ink-soft)" }}>
                  Current quantity: {item.quantity} {item.unit}
                </p>

                <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                  <button type="button" onClick={() => setConsuming(false)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={loading}>
                    {loading ? "Confirming..." : "Confirm"}
                  </button>
                </div>
              </form>
            )}
          </>
        ) : (
          <>
            <h2>Edit Food Item</h2>
            <form onSubmit={handleUpdate}>
              <label htmlFor="name">Food Name *</label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />

              <label htmlFor="categoryId">Category *</label>
              <select
                id="categoryId"
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <label htmlFor="brand">Brand</label>
              <input
                id="brand"
                name="brand"
                value={form.brand}
                onChange={handleChange}
              />

              <label htmlFor="quantity">Quantity *</label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                step="any"
                min="0"
                value={form.quantity}
                onChange={handleChange}
                required
              />

              <label htmlFor="unit">Unit *</label>
              <input
                id="unit"
                name="unit"
                value={form.unit}
                onChange={handleChange}
                required
              />

              <label htmlFor="purchaseDate">Purchase Date</label>
              <input
                id="purchaseDate"
                name="purchaseDate"
                type="date"
                value={form.purchaseDate}
                onChange={handleChange}
              />

              <label htmlFor="expirationDate">Expiration Date *</label>
              <input
                id="expirationDate"
                name="expirationDate"
                type="date"
                value={form.expirationDate}
                onChange={handleChange}
                required
              />

              <label htmlFor="storageLocation">Storage Location</label>
              <select
                id="storageLocation"
                name="storageLocation"
                value={form.storageLocation}
                onChange={handleChange}
              >
                <option value="">Select a location</option>
                {STORAGE_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc.replace("_", " ")}
                  </option>
                ))}
              </select>

              <label htmlFor="minimumStock">Minimum Stock</label>
              <input
                id="minimumStock"
                name="minimumStock"
                type="number"
                step="any"
                min="0"
                value={form.minimumStock}
                onChange={handleChange}
              />

              <label htmlFor="price">Price</label>
              <input
                id="price"
                name="price"
                type="number"
                step="any"
                min="0"
                value={form.price}
                onChange={handleChange}
              />

              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={3}
              />

              <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                <button type="button" onClick={() => setEditing(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default FoodDetailsModal;
