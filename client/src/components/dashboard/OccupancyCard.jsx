// ==========================================================
// OccupancyCard
// Multi-tone radial donut showing room occupancy split across
// Occupied / Vacant / Maintenance, backed by dashboard.rooms
// { total_rooms, available_rooms, occupied_rooms, maintenance_rooms }
// ==========================================================

const SEGMENT_COLORS = {
  occupied: "#7C3AED",
  vacant: "#93C5FD",
  maintenance: "#F472B6",
};

function OccupancyCard({ rooms, loading }) {
  const total = rooms?.total_rooms || 0;
  const occupied = rooms?.occupied_rooms || 0;
  const maintenance = rooms?.maintenance_rooms || 0;
  // "Vacant" = everything else, so the three segments always add up to total.
  const vacant = Math.max(total - occupied - maintenance, 0);
  const percent = total ? Math.round((occupied / total) * 100) : 0;

  const size = 168;
  const stroke = 16;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const segments = [
    { key: "occupied", value: occupied, color: SEGMENT_COLORS.occupied },
    { key: "vacant", value: vacant, color: SEGMENT_COLORS.vacant },
    { key: "maintenance", value: maintenance, color: SEGMENT_COLORS.maintenance },
  ];

  let cumulative = 0;

  if (loading) {
    return (
      <div className="panel">
        <div className="panel-header">
          <h3>Room Occupancy</h3>
        </div>
        <div className="skeleton" style={{ width: 168, height: 168, borderRadius: "50%", margin: "0 auto" }} />
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <h3>Room Occupancy</h3>
          <div className="panel-sub">{total} rooms across all hostels</div>
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
            {percent}%
          </text>
          <text x="50%" y="63%" textAnchor="middle" className="occupancy-ring-caption">
            Occupied
          </text>
        </svg>

        <div className="occupancy-legend">
          <div className="occupancy-legend-item">
            <span>
              <span className="dot" style={{ background: SEGMENT_COLORS.occupied }} />
              Occupied
            </span>
            <span className="num">{occupied}</span>
          </div>
          <div className="occupancy-legend-item">
            <span>
              <span className="dot" style={{ background: SEGMENT_COLORS.vacant }} />
              Vacant
            </span>
            <span className="num">{vacant}</span>
          </div>
          <div className="occupancy-legend-item">
            <span>
              <span className="dot" style={{ background: SEGMENT_COLORS.maintenance }} />
              Maintenance
            </span>
            <span className="num">{maintenance}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OccupancyCard;