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
const DELETE_REASONS = ["CONSUMED", "EXPIRED", "SPOILED", "DAMAGED", "OTHER"];

function FoodDetailsModal({ item, onClose, onUpdated, onDeleted }) {
  const [editing, setEditing] = useState(false);
  const [consuming, setConsuming] = useState(false);
  const [consumeAmount, setConsumeAmount] = useState("");
  const [showDeleteReason, setShowDeleteReason] = useState(false);
  const [deleteReason, setDeleteReason] = useState("CONSUMED");
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

  const confirmDelete = async () => {
    try {
      await foodService.deleteFoodItem(item.id, deleteReason);
      onDeleted(item.id);
      onClose();
    } catch {
      setError("Could not delete this item.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {error && <p className="error-message">{error}</p>}

        {!editing ? (
          <>
            <h2>{item.name}</h2>

            <div className="detail-list">
              <div className="detail-row">
                <span>Category</span>
                <span>{item.categoryName}</span>
              </div>
              {item.brand && (
                <div className="detail-row">
                  <span>Brand</span>
                  <span>{item.brand}</span>
                </div>
              )}
              <div className="detail-row">
                <span>Quantity</span>
                <span>
                  {item.quantity} {item.unit}
                </span>
              </div>
              {item.purchaseDate && (
                <div className="detail-row">
                  <span>Purchase Date</span>
                  <span>{item.purchaseDate}</span>
                </div>
              )}
              <div className="detail-row">
                <span>Expiration Date</span>
                <span>{item.expirationDate}</span>
              </div>
              {item.storageLocation && (
                <div className="detail-row">
                  <span>Storage</span>
                  <span>{item.storageLocation.replace("_", " ")}</span>
                </div>
              )}
              {item.minimumStock != null && (
                <div className="detail-row">
                  <span>Minimum Stock</span>
                  <span>{item.minimumStock}</span>
                </div>
              )}
              {item.price != null && (
                <div className="detail-row">
                  <span>Price</span>
                  <span>{item.price}</span>
                </div>
              )}
              {item.notes && (
                <div className="detail-row">
                  <span>Notes</span>
                  <span>{item.notes}</span>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Close
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setEditing(true)}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setConsuming(true)}
              >
                Consume
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={() => setShowDeleteReason(true)}
              >
                Delete
              </button>
            </div>

            {consuming && (
              <form onSubmit={handleConsume} className="inline-panel">
                <div className="form-field">
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
                </div>
                <p className="inline-panel-hint">
                  Current quantity: {item.quantity} {item.unit}
                </p>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setConsuming(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Confirming..." : "Confirm"}
                  </button>
                </div>
              </form>
            )}

            {showDeleteReason && (
              <div className="inline-panel">
                <p className="inline-panel-hint">
                  Why are you removing "{item.name}"?
                </p>

                <div className="radio-group">
                  {DELETE_REASONS.map((reason) => (
                    <label key={reason} className="radio-option">
                      <input
                        type="radio"
                        name="deleteReason"
                        value={reason}
                        checked={deleteReason === reason}
                        onChange={(e) => setDeleteReason(e.target.value)}
                      />
                      {reason.charAt(0) + reason.slice(1).toLowerCase()}
                    </label>
                  ))}
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowDeleteReason(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn-danger"
                    onClick={confirmDelete}
                  >
                    Confirm Delete
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <h2>Edit Food Item</h2>
            <form onSubmit={handleUpdate} className="modal-form">
              <div className="form-field form-field-full">
                <label htmlFor="name">Food Name *</label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field form-field-full">
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
              </div>

              <div className="form-field form-field-full">
                <label htmlFor="brand">Brand</label>
                <input
                  id="brand"
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
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
              </div>

              <div className="form-field">
                <label htmlFor="unit">Unit *</label>
                <input
                  id="unit"
                  name="unit"
                  value={form.unit}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="purchaseDate">Purchase Date</label>
                <input
                  id="purchaseDate"
                  name="purchaseDate"
                  type="date"
                  value={form.purchaseDate}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label htmlFor="expirationDate">Expiration Date *</label>
                <input
                  id="expirationDate"
                  name="expirationDate"
                  type="date"
                  value={form.expirationDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
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
              </div>

              <div className="form-field">
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
              </div>

              <div className="form-field">
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
              </div>

              <div className="form-field form-field-full">
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="modal-actions form-field-full">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
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
