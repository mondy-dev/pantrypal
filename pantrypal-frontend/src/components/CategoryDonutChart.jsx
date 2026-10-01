const SIZE = 168;
const RADIUS = 62;
const STROKE = 24;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function CategoryDonutChart({ data }) {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  let cumulative = 0;

  return (
    <div className="donut-chart-row">
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="donut-chart"
        role="img"
        aria-label="Inventory by category"
      >
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={STROKE}
        />
        {total > 0 &&
          data.map((d) => {
            const fraction = d.count / total;
            const dash = fraction * CIRCUMFERENCE;
            const offset = -((cumulative / total) * CIRCUMFERENCE);
            cumulative += d.count;

            return (
              <circle
                key={d.name}
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                fill="none"
                stroke={d.color}
                strokeWidth={STROKE}
                strokeDasharray={`${dash} ${CIRCUMFERENCE - dash}`}
                strokeDashoffset={offset}
                transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
              />
            );
          })}
        <text
          x={SIZE / 2}
          y={SIZE / 2 - 4}
          textAnchor="middle"
          className="donut-center-value"
        >
          {total}
        </text>
        <text
          x={SIZE / 2}
          y={SIZE / 2 + 16}
          textAnchor="middle"
          className="donut-center-label"
        >
          Items
        </text>
      </svg>

      <div className="donut-legend">
        {data.length === 0 ? (
          <p className="report-empty">No items yet.</p>
        ) : (
          data.map((d) => (
            <div key={d.name} className="donut-legend-item">
              <span
                className="donut-legend-swatch"
                style={{ background: d.color }}
              />
              <span className="donut-legend-name">{d.name}</span>
              <span className="donut-legend-count">{d.count}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CategoryDonutChart;
