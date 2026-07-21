import NoticeCard from "./NoticeCard";

function NoticeGrid({ notices, loading, onDelete }) {
  if (loading) {
    return (
      <div className="notice-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="room-skeleton-row" style={{ height: 160 }} />
        ))}
      </div>
    );
  }

  if (!notices || notices.length === 0) {
    return (
      <div className="room-empty-state">
        <svg viewBox="0 0 24 24" fill="none" width="40" height="40">
          <path d="M9 17H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v4M9 17v3l4-3h5a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p>No notices posted yet. Post one to get started.</p>
      </div>
    );
  }

  return (
    <div className="notice-grid">
      {notices.map((n) => (
        <NoticeCard key={n.id} notice={n} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default NoticeGrid;
