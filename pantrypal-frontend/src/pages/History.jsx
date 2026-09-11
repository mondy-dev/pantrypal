import { useEffect, useState } from "react";
import * as foodService from "../services/foodService";

function formatEntry(entry) {
  const name = entry.foodItemName;

  if (entry.actionType === "ADDED") {
    return `Added ${entry.quantityChange} ${entry.unit} of ${name}`;
  }
  if (entry.actionType === "CONSUMED") {
    return `Consumed ${entry.quantityChange} ${entry.unit} of ${name}`;
  }
  if (entry.actionType === "DELETED") {
    return `Removed ${name}`;
  }
  return `${entry.actionType} — ${name}`;
}

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    foodService
      .getHistory()
      .then(setHistory)
      .catch(() => setError("Could not load history."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading history...</p>;

  return (
    <div style={{ padding: "32px" }}>
      <h1>Inventory History</h1>

      {error && <p className="error-message">{error}</p>}
      {history.length === 0 && <p>No activity yet.</p>}

      <ul>
        {history.map((entry) => (
          <li key={entry.id} style={{ marginBottom: "12px" }}>
            <div>
              ✓ {formatEntry(entry)}
              {entry.note && (
                <span style={{ color: "var(--color-ink-soft)" }}>
                  {" "}
                  — "{entry.note}"
                </span>
              )}
            </div>
            <div style={{ fontSize: "13px", color: "var(--color-ink-soft)" }}>
              {entry.userName} · {new Date(entry.createdAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default History;
