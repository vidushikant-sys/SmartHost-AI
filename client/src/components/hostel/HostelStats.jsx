import { useMemo } from "react";

function formatCurrency(value) {
  const num = Number(value);
  if (!isFinite(num)) return "₹0";
  return `₹${Math.round(num).toLocaleString("en-IN")}`;
}

/**
 * Summary cards computed straight from the currently loaded hostel list —
 * no extra API calls needed.
 */
export default function HostelStats({ hostels }) {
  const stats = useMemo(() => {
    const total = hostels.length;
    const totalCapacity = hostels.reduce(
      (sum, h) => sum + (Number(h.total_capacity) || 0),
      0
    );
    const avgFee =
      total === 0
        ? 0
        : hostels.reduce((sum, h) => sum + (Number(h.monthly_fee) || 0), 0) / total;

    const byType = hostels.reduce((acc, h) => {
      acc[h.hostel_type] = (acc[h.hostel_type] || 0) + 1;
      return acc;
    }, {});

    const topType =
      Object.entries(byType).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

    return { total, totalCapacity, avgFee, topType };
  }, [hostels]);

  const cards = [
    {
      label: "Total Hostels",
      value: stats.total,
      icon: (
        <path
          d="M3 21V9l9-6 9 6v12M3 21h18M9 21v-6h6v6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      ),
    },
    {
      label: "Total Bed Capacity",
      value: stats.totalCapacity.toLocaleString("en-IN"),
      icon: (
        <path
          d="M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7M3 18h18M3 18v2M21 18v2M5 9V6a2 2 0 0 1 2-2h3v5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      ),
    },
    {
      label: "Average Monthly Fee",
      value: formatCurrency(stats.avgFee),
      icon: (
        <path
          d="M12 2v20M17 6.5c0-1.9-2.2-3.5-5-3.5S7 4.6 7 6.5 9.2 10 12 10s5 1.6 5 3.5-2.2 3.5-5 3.5-5-1.6-5-3.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      ),
    },
    {
      label: "Most Common Type",
      value: stats.topType,
      icon: (
        <path
          d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      ),
    },
  ];

  return (
    <div className="hostel-stats">
      {cards.map((card) => (
        <div className="hostel-stats__card" key={card.label}>
          <div className="hostel-stats__icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              {card.icon}
            </svg>
          </div>
          <div>
            <div className="hostel-stats__value">{card.value}</div>
            <div className="hostel-stats__label">{card.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
