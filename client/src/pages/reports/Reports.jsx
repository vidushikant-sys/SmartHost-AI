import { useEffect, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useHostel } from "../../context/HostelContext";
import {
  getOverviewReport,
  getRevenueTrend,
  getStudentGrowth,
  getHostelPerformance,
  getComplaintInsights,
} from "../../services/reportService";
import "../../styles/reports.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

const MONTH_OPTIONS = [3, 6, 12];

function readCssVar(name, fallback) {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

function formatCurrency(n) {
  const num = Number(n || 0);
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num.toLocaleString("en-IN")}`;
}

function downloadCsv(filename, rows) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((h) => {
          const val = row[h] ?? "";
          const escaped = String(val).replace(/"/g, '""');
          return /[,"\n]/.test(escaped) ? `"${escaped}"` : escaped;
        })
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function Reports() {
  const { selectedHostelId, selectedHostel } = useHostel();

  const [months, setMonths] = useState(6);

  const [overview, setOverview] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [growth, setGrowth] = useState(null);
  const [performance, setPerformance] = useState([]);
  const [complaintInsights, setComplaintInsights] = useState(null);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [sortKey, setSortKey] = useState("hostel_name");
  const [sortDir, setSortDir] = useState("asc");

  function loadAll() {
    setLoading(true);
    setErrorMsg("");
    return Promise.all([
      getOverviewReport(selectedHostelId),
      getRevenueTrend(selectedHostelId, months),
      getStudentGrowth(selectedHostelId, months),
      getHostelPerformance(),
      getComplaintInsights(selectedHostelId),
    ])
      .then(([ov, rev, gr, perf, ci]) => {
        setOverview(ov);
        setRevenue(rev);
        setGrowth(gr);
        setPerformance(Array.isArray(perf) ? perf : []);
        setComplaintInsights(ci);
      })
      .catch((err) => setErrorMsg(err.message || "Failed to load reports"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHostelId, months]);

  const accent = readCssVar("--primary", "#2563EB");
  const success = "#22C55E";
  const warning = "#F59E0B";
  const danger = "#EF4444";

  const revenueChartData = useMemo(() => {
    if (!revenue) return null;
    return {
      labels: revenue.labels,
      datasets: [
        {
          label: "Generated",
          data: revenue.generated,
          borderColor: "#94A3B8",
          backgroundColor: "rgba(148,163,184,0.12)",
          tension: 0.35,
          fill: true,
          pointRadius: 3,
        },
        {
          label: "Collected",
          data: revenue.collected,
          borderColor: accent,
          backgroundColor: `${accent}22`,
          tension: 0.35,
          fill: true,
          pointRadius: 3,
        },
      ],
    };
  }, [revenue, accent]);

  const growthChartData = useMemo(() => {
    if (!growth) return null;
    return {
      labels: growth.labels,
      datasets: [
        {
          label: "New students",
          data: growth.counts,
          backgroundColor: accent,
          borderRadius: 6,
          maxBarThickness: 34,
        },
      ],
    };
  }, [growth, accent]);

  const complaintDoughnutData = useMemo(() => {
    if (!complaintInsights) return null;
    return {
      labels: ["Open", "In Progress", "Resolved"],
      datasets: [
        {
          data: [
            complaintInsights.open_complaints,
            complaintInsights.in_progress_complaints,
            complaintInsights.resolved_complaints,
          ],
          backgroundColor: [danger, warning, success],
          borderWidth: 0,
        },
      ],
    };
  }, [complaintInsights]);

  const sortedPerformance = useMemo(() => {
    const rows = [...performance];
    rows.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "string") {
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortDir === "asc" ? av - bv : bv - av;
    });
    return rows;
  }, [performance, sortKey, sortDir]);

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function handleExport() {
    downloadCsv(
      "hostel-performance.csv",
      sortedPerformance.map((r) => ({
        Hostel: r.hostel_name,
        "Total Rooms": r.total_rooms,
        "Occupied Rooms": r.occupied_rooms,
        "Occupancy %": r.occupancy_percentage,
        Students: r.total_students,
        "Revenue Collected": r.revenue_collected,
        "Revenue Due": r.revenue_due,
        "Open Complaints": r.open_complaints,
      }))
    );
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "bottom", labels: { boxWidth: 10, font: { size: 11.5 } } },
      tooltip: { padding: 10, cornerRadius: 8 },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "rgba(148,163,184,0.15)" }, beginAtZero: true },
    },
  };

  return (
    <DashboardLayout>
      <div className="reports-page">
        <div className="settings-header">
          <div>
            <h1>Reports &amp; Analytics</h1>
            <p>
              {selectedHostel ? selectedHostel.title : "All hostels"} · last {months} months
            </p>
          </div>

          <div className="reports-controls">
            <div className="reports-month-toggle">
              {MONTH_OPTIONS.map((m) => (
                <button
                  key={m}
                  className={months === m ? "active" : ""}
                  onClick={() => setMonths(m)}
                >
                  {m}M
                </button>
              ))}
            </div>
            <button className="reports-refresh-btn" onClick={loadAll} disabled={loading}>
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>

        {errorMsg && <p className="settings-error">{errorMsg}</p>}

        {loading && !overview && <p className="settings-hint">Loading reports...</p>}

        {overview && (
          <div className="reports-kpi-grid">
            <KpiCard
              label="Occupancy"
              value={`${overview.rooms.occupancy_percentage}%`}
              sub={`${overview.rooms.occupied_rooms}/${overview.rooms.total_rooms} rooms occupied`}
            />
            <KpiCard
              label="Students"
              value={overview.students.total_students}
              sub={`${overview.students.active_students} active`}
            />
            <KpiCard
              label="Fee Collection"
              value={formatCurrency(overview.fees.total_collection)}
              sub={`${formatCurrency(overview.fees.total_due)} due`}
            />
            <KpiCard
              label="Complaints"
              value={overview.complaints.total_complaints}
              sub={`${overview.complaints.open_complaints} open · avg ${overview.complaints.avg_resolution_hours}h resolve`}
            />
            <KpiCard
              label="Notices"
              value={overview.notices.active_notices}
              sub={`${overview.notices.total_notices} total`}
            />
            <KpiCard label="Hostels" value={overview.hostels.total_hostels} sub="managed properties" />
          </div>
        )}

        <div className="reports-chart-grid">
          <section className="settings-card reports-chart-card">
            <div className="settings-card-head">
              <h2>Revenue Trend</h2>
              <p>Fee generated vs. collected, last {months} months</p>
            </div>
            <div className="reports-chart-wrap">
              {revenueChartData && <Line data={revenueChartData} options={chartOptions} />}
            </div>
          </section>

          <section className="settings-card reports-chart-card">
            <div className="settings-card-head">
              <h2>Student Growth</h2>
              <p>New registrations, last {months} months</p>
            </div>
            <div className="reports-chart-wrap">
              {growthChartData && <Bar data={growthChartData} options={chartOptions} />}
            </div>
          </section>
        </div>

        <section className="settings-card">
          <div className="settings-card-head">
            <h2>Complaint Insights</h2>
            <p>Status mix and category breakdown</p>
          </div>

          {complaintInsights && (
            <div className="reports-complaint-grid">
              <div className="reports-doughnut-wrap">
                {complaintDoughnutData && (
                  <Doughnut
                    data={complaintDoughnutData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      cutout: "68%",
                      plugins: {
                        legend: { position: "bottom", labels: { boxWidth: 10, font: { size: 11.5 } } },
                      },
                    }}
                  />
                )}
              </div>

              <div className="reports-category-list">
                <p className="reports-category-heading">By category</p>
                {complaintInsights.by_category?.length === 0 && (
                  <p className="settings-hint">No complaints recorded yet.</p>
                )}
                {complaintInsights.by_category?.map((c) => {
                  const max = Math.max(...complaintInsights.by_category.map((x) => x.count), 1);
                  return (
                    <div className="reports-category-row" key={c.category}>
                      <span className="reports-category-label">{c.category}</span>
                      <div className="reports-category-bar-track">
                        <div
                          className="reports-category-bar-fill"
                          style={{ width: `${(c.count / max) * 100}%` }}
                        />
                      </div>
                      <span className="reports-category-count">{c.count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        <section className="settings-card">
          <div className="settings-card-head-row" style={{ justifyContent: "space-between", width: "100%" }}>
            <div>
              <h2>Hostel Performance</h2>
              <p>Side-by-side comparison across all hostels</p>
            </div>
            <button className="notif-mark-all-page" onClick={handleExport} disabled={!sortedPerformance.length}>
              Export CSV
            </button>
          </div>

          {sortedPerformance.length === 0 ? (
            <p className="settings-hint">No hostels to compare yet.</p>
          ) : (
            <div className="reports-table-wrap">
              <table className="reports-table">
                <thead>
                  <tr>
                    {[
                      ["hostel_name", "Hostel"],
                      ["total_rooms", "Rooms"],
                      ["occupancy_percentage", "Occupancy"],
                      ["total_students", "Students"],
                      ["revenue_collected", "Collected"],
                      ["revenue_due", "Due"],
                      ["open_complaints", "Open Complaints"],
                    ].map(([key, label]) => (
                      <th key={key} onClick={() => toggleSort(key)}>
                        {label}
                        {sortKey === key && <span>{sortDir === "asc" ? " ▲" : " ▼"}</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedPerformance.map((row) => (
                    <tr key={row.hostel_id}>
                      <td className="reports-table-name">{row.hostel_name}</td>
                      <td>
                        {row.occupied_rooms}/{row.total_rooms}
                      </td>
                      <td>
                        <span className="reports-occupancy-pill">{row.occupancy_percentage}%</span>
                      </td>
                      <td>{row.total_students}</td>
                      <td>{formatCurrency(row.revenue_collected)}</td>
                      <td className={row.revenue_due > 0 ? "reports-due" : ""}>
                        {formatCurrency(row.revenue_due)}
                      </td>
                      <td>{row.open_complaints}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}

function KpiCard({ label, value, sub }) {
  return (
    <div className="reports-kpi-card">
      <span className="reports-kpi-value">{value}</span>
      <span className="reports-kpi-label">{label}</span>
      {sub && <span className="reports-kpi-sub">{sub}</span>}
    </div>
  );
}

export default Reports;
