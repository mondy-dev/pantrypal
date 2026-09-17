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

function iconFor(actionType) {
  if (actionType === "ADDED") return "＋";
  if (actionType === "CONSUMED") return "✓";
  if (actionType === "DELETED") return "－";
  return "•";
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

  if (loading)
    return (
      <div className="page">
        <p>Loading history...</p>
      </div>
    );

  return (
    <div className="page">
      <div className="page-header">
        <h1>Inventory History</h1>
      </div>

      {error && <p className="error-message">{error}</p>}

      {history.length === 0 ? (
        <div className="empty-state">
          <p>No activity yet.</p>
        </div>
      ) : (
        <div className="history-list">
          {history.map((entry) => (
            <div key={entry.id} className="history-row">
              <div
                className={
                  "history-icon history-icon-" + entry.actionType.toLowerCase()
                }
              >
                {iconFor(entry.actionType)}
              </div>
              <div className="history-content">
                <p className="history-text">
                  {formatEntry(entry)}
                  {entry.note && (
                    <span className="history-note"> — "{entry.note}"</span>
                  )}
                </p>
                <p className="history-meta">
                  {entry.userName} ·{" "}
                  {new Date(entry.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;
