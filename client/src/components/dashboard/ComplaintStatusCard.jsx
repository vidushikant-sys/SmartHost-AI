// ==========================================================
// ComplaintStatusCard
// Donut breakdown of complaints by status, backed by
// dashboard.complaints { total_complaints, pending_complaints,
// in_progress_complaints, resolved_complaints }
// ==========================================================

const SEGMENT_COLORS = {
  open: "#EF4444",
  inProgress: "#F59E0B",
  resolved: "#22C55E",
};

function ComplaintStatusCard({ complaints, loading }) {
  const total = complaints?.total_complaints || 0;
  const open = complaints?.pending_complaints || 0;
  const inProgress = complaints?.in_progress_complaints || 0;
  const resolved = complaints?.resolved_complaints || 0;

  const size = 168;
  const stroke = 16;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const segments = [
    { key: "open", value: open, color: SEGMENT_COLORS.open },
    { key: "inProgress", value: inProgress, color: SEGMENT_COLORS.inProgress },
    { key: "resolved", value: resolved, color: SEGMENT_COLORS.resolved },
  ];

  let cumulative = 0;

  if (loading) {
    return (
      <div className="panel">
        <div className="panel-header">
          <h3>Complaint Status</h3>
        </div>
        <div className="skeleton" style={{ width: 168, height: 168, borderRadius: "50%", margin: "0 auto" }} />
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <h3>Complaint Status</h3>
          <div className="panel-sub">{total} complaints across all hostels</div>
        </div>
      </div>

      <div className="occupancy-ring-wrap">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--background, #EEF1F6)"
            strokeWidth={stroke}
          />

          {total > 0 &&
            segments
              .filter((s) => s.value > 0)
              .map((s) => {
                const segLen = (s.value / total) * circumference;
                const dashArray = `${segLen} ${circumference - segLen}`;
                const dashOffset = -cumulative;
                cumulative += segLen;

                return (
                  <circle
                    key={s.key}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={s.color}
                    strokeWidth={stroke}
                    strokeDasharray={dashArray}
                    strokeDashoffset={dashOffset}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                    style={{ transition: "stroke-dasharray 0.6s ease" }}
                  />
                );
              })}

          <text x="50%" y="47%" textAnchor="middle" className="occupancy-ring-value">
            {total}
          </text>
          <text x="50%" y="63%" textAnchor="middle" className="occupancy-ring-caption">
            Total
          </text>
        </svg>

        <div className="occupancy-legend">
          <div className="occupancy-legend-item">
            <span>
              <span className="dot" style={{ background: SEGMENT_COLORS.open }} />
              Open
            </span>
            <span className="num">{open}</span>
          </div>
          <div className="occupancy-legend-item">
            <span>
              <span className="dot" style={{ background: SEGMENT_COLORS.inProgress }} />
              In Progress
            </span>
            <span className="num">{inProgress}</span>
          </div>
          <div className="occupancy-legend-item">
            <span>
              <span className="dot" style={{ background: SEGMENT_COLORS.resolved }} />
              Resolved
            </span>
            <span className="num">{resolved}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComplaintStatusCard;