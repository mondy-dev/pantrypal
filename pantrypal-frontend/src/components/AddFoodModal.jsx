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

function AddFoodModal({ onClose, onCreated }) {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    brand: "",
    quantity: "",
    unit: "",
    purchaseDate: "",
    expirationDate: "",
    storageLocation: "",
    minimumStock: "",
    price: "",
    notes: "",
  });

  useEffect(() => {
    categoryService
      .getCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        ...form,
        categoryId: Number(form.categoryId),
        quantity: Number(form.quantity),
        minimumStock: form.minimumStock ? Number(form.minimumStock) : null,
        price: form.price ? Number(form.price) : null,
        purchaseDate: form.purchaseDate || null,
        storageLocation: form.storageLocation || null,
      };

      const created = await foodService.createFoodItem(payload);
      onCreated(created);
      onClose();
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2>Add Food Item</h2>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="modal-form">
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
              placeholder="cans, kg, pcs"
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
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Adding..." : "Add Food"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddFoodModal;
