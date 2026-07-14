import { useState } from "react";

// ==========================================================
// RevenueChart
// Lightweight, dependency-free SVG bar chart showing the fee
// collection trend for the last N months.
//
// Props:
//  - data: [{ label: "Jan", year: 2026, total: 45000 }, ...]
//  - loading: bool
// ==========================================================

function formatCurrency(n) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
}

function RevenueChart({ data = [], loading }) {
  const [hoverIndex, setHoverIndex] = useState(null);

  const width = 640;
  const height = 240;
  const paddingLeft = 10;
  const paddingRight = 10;
  const paddingBottom = 28;
  const paddingTop = 10;

  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;

  const total = data.reduce((sum, d) => sum + d.total, 0);
  const max = Math.max(...data.map((d) => d.total), 1);
  const barSlot = data.length ? chartW / data.length : 0;
  const barWidth = Math.min(46, barSlot * 0.5);

  const peakIndex = data.reduce(
    (best, d, i) => (d.total > (data[best]?.total ?? -1) ? i : best),
    0
  );

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <h3>Revenue Overview</h3>
          <div className="panel-sub">Fee collection, last {data.length || 6} months</div>
        </div>
        <div className="revenue-legend">
          <span className="amount">{loading ? "—" : formatCurrency(total)}</span>
          <span className="panel-sub">total collected</span>
        </div>
      </div>

      {loading ? (
        <div className="skeleton" style={{ width: "100%", height: 220 }} />
      ) : data.length === 0 ? (
        <div className="empty-state">No revenue data available yet.</div>
      ) : (
        <div className="chart-wrap" style={{ position: "relative" }}>
          <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="240">
            {[0.25, 0.5, 0.75].map((f) => (
              <line
                key={f}
                x1={paddingLeft}
                x2={width - paddingRight}
                y1={paddingTop + chartH * (1 - f)}
                y2={paddingTop + chartH * (1 - f)}
                stroke="#EEF1F6"
                strokeWidth="1"
              />
            ))}

            {data.map((d, i) => {
              const barH = max ? (d.total / max) * chartH : 0;
              const x = paddingLeft + i * barSlot + (barSlot - barWidth) / 2;
              const y = paddingTop + chartH - barH;

              return (
                <g
                  key={`${d.label}-${d.year}-${i}`}
                  className={`chart-bar-group ${i === peakIndex ? "is-peak" : ""}`}
                  onMouseEnter={() => setHoverIndex(i)}
                  onMouseLeave={() => setHoverIndex(null)}
                >
                  <rect
                    className="chart-bar"
                    x={x}
                    y={y}
                    width={barWidth}
                    height={Math.max(barH, 3)}
                    rx={6}
                  />
                  <rect
                    x={x}
                    y={paddingTop}
                    width={barWidth}
                    height={chartH}
                    fill="transparent"
                  />
                  <text
                    className="chart-axis-label"
                    x={x + barWidth / 2}
                    y={height - 8}
                    textAnchor="middle"
                  >
                    {d.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {hoverIndex !== null && (
            <div
              className="chart-tooltip"
              style={{
                left: `${
                  ((paddingLeft + hoverIndex * barSlot + barSlot / 2) / width) * 100
                }%`,
                top: `${
                  ((paddingTop + chartH - (max ? (data[hoverIndex].total / max) * chartH : 0)) /
                    height) *
                  100
                }%`,
              }}
            >
              {data[hoverIndex].label} {data[hoverIndex].year} —{" "}
              {formatCurrency(data[hoverIndex].total)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RevenueChart;
