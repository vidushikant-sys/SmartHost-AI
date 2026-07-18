import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import RoomStats from "../../components/room/RoomStats";
import RoomFilters from "../../components/room/RoomFilters";
import RoomTable from "../../components/room/RoomTable";
import DeleteRoomModal from "../../components/room/DeleteRoomModal";
import { getAllRooms, deleteRoom } from "../../services/roomService";
import { useHostel } from "../../context/HostelContext";
import "../../styles/room.css";

const PAGE_SIZE = 8;

function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();
  const { hostels, selectedHostelId, selectedHostel } = useHostel();

  const hostelMap = useMemo(() => {
    const map = {};
    hostels.forEach((h) => {
      map[h.id] = h.title;
    });
    return map;
  }, [hostels]);

  function loadRooms() {
    setLoading(true);
    return getAllRooms(selectedHostelId)
      .then((data) => setRooms(data || []))
      .catch((err) => setErrorMsg(err.message || "Failed to load rooms"))
      .finally(() => setLoading(false));
  }

  // Re-fetch every time the globally-selected hostel changes.
  useEffect(() => {
    loadRooms();
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHostelId]);

  // Attach a friendly hostel_name to each room for display, since the
  // backend only returns hostel_id on the room record itself.
  const roomsWithHostelName = useMemo(
    () =>
      rooms.map((r) => ({
        ...r,
        hostel_name: hostelMap[r.hostel_id],
      })),
    [rooms, hostelMap]
  );

  function handleDeleteClick(room) {
    setDeleteTarget(room);
  }

  function handleCancelDelete() {
    setDeleteTarget(null);
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return roomsWithHostelName.filter((r) => {
      const matchesSearch =
        !q ||
        r.room_number?.toLowerCase().includes(q) ||
        r.room_type?.toLowerCase().includes(q) ||
        r.sharing_type?.toLowerCase().includes(q) ||
        r.hostel_name?.toLowerCase().includes(q);
      const matchesStatus = status === "All" || r.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [roomsWithHostelName, search, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  async function handleConfirmDelete() {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      await deleteRoom(deleteTarget.id);
      setDeleteTarget(null);
      await loadRooms();
    } catch (err) {
      setErrorMsg(err.message || "Failed to delete room");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="room-page">
        <div className="room-page-header">
          <div>
            <h1>Rooms</h1>
            <p className="room-page-subtitle">
              {selectedHostel
                ? `Showing rooms in ${selectedHostel.title}.`
                : "Manage every room across your hostels."}
            </p>
          </div>
          <button className="room-btn-primary" onClick={() => navigate("/rooms/add")}>
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Add Room
          </button>
        </div>

        {errorMsg && <div className="room-page-error">{errorMsg}</div>}

        <RoomStats rooms={roomsWithHostelName} loading={loading} />

        <div className="room-panel">
          <RoomFilters
            search={search}
            onSearchChange={(v) => { setSearch(v); setPage(1); }}
            status={status}
            onStatusChange={(v) => { setStatus(v); setPage(1); }}
          />

          <RoomTable
            rooms={paginated}
            loading={loading}
            onDelete={(room) => handleDeleteClick(room)}
          />

          {!loading && filtered.length > 0 && (
            <div className="room-pagination">
              <span>
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>
              <div className="room-pagination-btns">
                <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                  Prev
                </button>
                <span className="room-page-indicator">{page} / {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <DeleteRoomModal
        room={deleteTarget}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        deleting={deleting}
      />
    </DashboardLayout>
  );
}

export default RoomList;
