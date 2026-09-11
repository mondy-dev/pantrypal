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
      .then(([inv, exp, cons, waste]) => {
        setInventory(inv);
        setExpiration(exp);
        setConsumption(cons);
        setWaste(waste);
      })
      .catch(() => setError("Could not load reports."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading reports...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div style={{ padding: "32px" }}>
      <h1>Reports</h1>

      <section style={{ marginBottom: "32px" }}>
        <h2>Inventory Report</h2>
        <p>Total items: {inventory.totalItems}</p>

        <h3>By Category</h3>
        <ul>
          {Object.entries(inventory.itemsByCategory).map(([name, count]) => (
            <li key={name}>
              {name}: {count}
            </li>
          ))}
        </ul>

        <h3>By Storage Location</h3>
        <ul>
          {Object.entries(inventory.itemsByStorageLocation).map(
            ([name, count]) => (
              <li key={name}>
                {name.replace("_", " ")}: {count}
              </li>
            ),
          )}
        </ul>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2>Expiration Report</h2>
        <p style={{ color: "var(--color-danger)" }}>
          Expired: {expiration.expiredCount}
        </p>
        <p style={{ color: "var(--color-danger)" }}>
          Expiring this week: {expiration.expiringThisWeekCount}
        </p>
        <p style={{ color: "var(--color-warning)" }}>
          Expiring this month: {expiration.expiringThisMonthCount}
        </p>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2>Consumption Report</h2>
        {consumption.mostConsumed.length === 0 && (
          <p>No consumption data yet.</p>
        )}
        <ul>
          {consumption.mostConsumed.map((entry) => (
            <li key={entry.foodItemName}>
              {entry.foodItemName} — consumed {entry.timesConsumed} time(s),
              total {entry.totalQuantityConsumed}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Food Waste Report</h2>
        <p style={{ color: "var(--color-danger)" }}>
          Items wasted: {waste.wastedItemCount}
        </p>
        <p>Items fully consumed (not wasted): {waste.consumedFullyCount}</p>
        <p>Estimated waste value: ₱{waste.estimatedWasteValue}</p>
      </section>
    </div>
  );
}

export default Reports;
