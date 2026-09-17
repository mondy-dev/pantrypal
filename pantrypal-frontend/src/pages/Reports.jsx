import { useEffect, useState } from "react";
import * as reportService from "../services/reportService";

function Reports() {
  const [inventory, setInventory] = useState(null);
  const [expiration, setExpiration] = useState(null);
  const [consumption, setConsumption] = useState(null);
  const [waste, setWaste] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      reportService.getInventoryReport(),
      reportService.getExpirationReport(),
      reportService.getConsumptionReport(),
      reportService.getWasteReport(),
    ])
      .then(([inv, exp, cons, wasteData]) => {
        setInventory(inv);
        setExpiration(exp);
        setConsumption(cons);
        setWaste(wasteData);
      })
      .catch(() => setError("Could not load reports."))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="page">
        <p>Loading reports...</p>
      </div>
    );
  if (error)
    return (
      <div className="page">
        <p className="error-message">{error}</p>
      </div>
    );

  return (
    <div className="page">
      <div className="page-header">
        <h1>Reports</h1>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-value">{inventory.totalItems}</span>
          <span className="stat-label">Total Items</span>
        </div>
        <div className="stat-card stat-card-danger">
          <span className="stat-value">{expiration.expiredCount}</span>
          <span className="stat-label">Expired</span>
        </div>
        <div className="stat-card stat-card-danger">
          <span className="stat-value">{expiration.expiringThisWeekCount}</span>
          <span className="stat-label">Expiring This Week</span>
        </div>
        <div className="stat-card stat-card-warning">
          <span className="stat-value">
            {expiration.expiringThisMonthCount}
          </span>
          <span className="stat-label">Expiring This Month</span>
        </div>
      </div>

      <div className="report-columns">
        <section className="report-section">
          <h2 className="section-heading">Inventory by Category</h2>
          <div className="bar-list">
            {Object.entries(inventory.itemsByCategory).map(([name, count]) => (
              <div key={name} className="bar-row">
                <span className="bar-label">{name}</span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${(count / inventory.totalItems) * 100}%`,
                    }}
                  />
                </div>
                <span className="bar-count">{count}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="report-section">
          <h2 className="section-heading">Inventory by Storage Location</h2>
          <div className="bar-list">
            {Object.entries(inventory.itemsByStorageLocation).map(
              ([name, count]) => (
                <div key={name} className="bar-row">
                  <span className="bar-label">{name.replace("_", " ")}</span>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{
                        width: `${(count / inventory.totalItems) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="bar-count">{count}</span>
                </div>
              ),
            )}
          </div>
        </section>
      </div>

      <section className="report-section">
        <h2 className="section-heading">Most Consumed</h2>
        {consumption.mostConsumed.length === 0 ? (
          <p className="report-empty">No consumption data yet.</p>
        ) : (
          <div className="consumption-list">
            {consumption.mostConsumed.map((entry) => (
              <div key={entry.foodItemName} className="consumption-row">
                <span className="consumption-name">{entry.foodItemName}</span>
                <span className="consumption-meta">
                  {entry.timesConsumed}× consumed · total{" "}
                  {entry.totalQuantityConsumed}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="report-section">
        <h2 className="section-heading">Food Waste</h2>
        <div className="stat-grid">
          <div className="stat-card stat-card-danger">
            <span className="stat-value">{waste.wastedItemCount}</span>
            <span className="stat-label">Items Wasted</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{waste.consumedFullyCount}</span>
            <span className="stat-label">Fully Consumed</span>
          </div>
          <div className="stat-card stat-card-warning">
            <span className="stat-value">₱{waste.estimatedWasteValue}</span>
            <span className="stat-label">Estimated Waste Value</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Reports;
