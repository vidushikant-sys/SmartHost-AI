# SmartHost AI — Dashboard UI

Drop-in, production-style Admin Dashboard UI for `client/`. No new npm
packages required (chart + progress ring are hand-built SVG, no
recharts/tailwind needed) — it uses the project's existing plain-CSS +
`variables.css` design tokens.

## Files (copy into `client/src/`, same paths)

```
src/
├── pages/dashboard/Dashboard.jsx
├── components/dashboard/
│   ├── StatCard.jsx
│   ├── RevenueChart.jsx
│   ├── OccupancyCard.jsx
│   ├── RecentActivity.jsx
│   ├── QuickActions.jsx
│   ├── NoticeBoard.jsx
│   └── UpcomingFees.jsx
├── components/layout/
│   ├── Sidebar.jsx           ← NEW: collapsible left nav
│   ├── DashboardLayout.jsx   ← NEW: wraps Sidebar + TopNavbar around any page
│   └── TopNavbar.jsx
├── services/dashboardService.js
└── styles/
    ├── dashboard.css
    ├── sidebar.css
    ├── dashboardLayout.css
    └── topNavbar.css
```

### What changed with the Sidebar addition
- `Sidebar.jsx` is a dark, collapsible nav with sections
  **Overview** (Dashboard), **Management** (Hostels, Students, Rooms,
  Fees, Complaints, Notices), **Insights** (Reports, Settings). Collapse
  state persists in `localStorage`.
- `DashboardLayout.jsx` is the new shell: `<Sidebar/>` on the left,
  `<TopNavbar/>` + page content on the right. `Dashboard.jsx` now wraps
  its content in `<DashboardLayout>` instead of rendering `TopNavbar`
  directly — reuse `DashboardLayout` the same way for every other
  logged-in page (Students, Rooms, Fees, etc.) so navigation stays
  consistent everywhere.
- `TopNavbar.jsx` no longer shows the brand/logo block — it moved to
  the Sidebar to avoid duplication. Search + notifications + admin
  menu stay in the top bar.

## 1. Wire up the route

`src/AppRoutes.jsx` mein add karo:

```jsx
import Dashboard from "./pages/dashboard/Dashboard";
// ...
<Route path="/dashboard" element={<Dashboard />} />
```

## 2. API base URL

Service `import.meta.env.VITE_API_URL` use karta hai, fallback
`http://localhost:5000/api`. Agar backend kisi aur port/host pe hai to
`client/.env` banao:

```
VITE_API_URL=http://localhost:5000/api
```

## 3. Auth

Login ke baad, response se `token` aur `admin` object
`localStorage` mein save karna hoga (Login.jsx abhi backend se connect
nahi hai — jab connect karo, ye do lines add karna):

```js
localStorage.setItem("token", data.token);
localStorage.setItem("admin", JSON.stringify(data.admin));
```

TopNavbar isi se admin ka naam/initial dikhata hai aur Logout button
dono keys clear karke `/` pe redirect karta hai.

## 4. Endpoints used (already exist in your Flask backend)

| Widget | Endpoint |
|---|---|
| Stat cards, Occupancy | `GET /api/dashboard/` |
| Revenue chart | `GET /api/fees/monthly-collection/:month/:year` (last 6 months) |
| Upcoming Fees | `GET /api/fees/pending` |
| Notice Board | `GET /api/notice/all` |
| Recent Activity | `GET /api/complaint/all` |

All calls send `Authorization: Bearer <token>`. If one endpoint fails,
that widget alone falls back to empty state — the rest of the
dashboard still renders (via `Promise.allSettled`).

## 5. Quick Actions links

`QuickActions.jsx` navigates to `/students/new`, `/rooms/allocate`,
`/fees/new`, `/notices/new` — update these paths once those pages/routes
exist in your router.

## Notes
- Verified with `npm run build` — compiles clean, no new dependencies added.
- Fully responsive: 4-col stats → 2-col → 1-col; side rail stacks below
  main content under 1180px.
- Colors pull from your existing `variables.css` (`--primary`,
  `--success`, `--warning`, `--danger`, `--shadow`, `--radius`) so it
  matches the rest of the app automatically.
