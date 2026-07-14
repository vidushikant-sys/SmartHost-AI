// ==========================================================
// OccupancyCard
// Radial progress ring showing overall room occupancy,
// backed by dashboard.rooms { total_rooms, available_rooms, occupied_rooms }
// ==========================================================

function OccupancyCard({ rooms, loading }) {
  const total = rooms?.total_rooms || 0;
  const occupied = rooms?.occupied_rooms || 0;
  const available = rooms?.available_rooms || 0;
  const percent = total ? Math.round((occupied / total) * 100) : 0;

  const size = 168;
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

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
            stroke="#EEF1F6"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#2563EB"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
          <text
            x="50%"
            y="47%"
            textAnchor="middle"
            className="occupancy-ring-value"
          >
            {percent}%
          </text>
          <text
            x="50%"
            y="63%"
            textAnchor="middle"
            className="occupancy-ring-caption"
          >
            Occupied
          </text>
        </svg>

        <div className="occupancy-legend">
          <div className="occupancy-legend-item">
            <span>
              <span className="dot" style={{ background: "#2563EB" }} />
              Occupied
            </span>
            <span className="num">{occupied}</span>
          </div>
          <div className="occupancy-legend-item">
            <span>
              <span className="dot" style={{ background: "#22C55E" }} />
              Available
            </span>
            <span className="num">{available}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OccupancyCard;
