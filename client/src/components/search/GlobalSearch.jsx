import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  searchStudentsByName,
  searchStudentsByPhone,
  searchRoomsByNumber,
  searchRoomsByType,
  searchRoomsBySharing,
  searchHostelsByTitle,
  searchComplaintsByTitle,
  searchComplaintsByStudentName,
} from "../../services/searchService";

// ==========================================================
// GlobalSearch
// Lives in TopNavbar. Debounced free-text search across
// Students, Rooms, Hostels (backend /api/search/*) and
// Complaints (filtered client-side from the already-fetched
// complaint list, since there is no dedicated complaint search
// endpoint on the backend).
// ==========================================================

const DEBOUNCE_MS = 300;
const MIN_CHARS = 2;
const MAX_PER_SECTION = 5;

function dedupeById(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [complaints, setComplaints] = useState([]);

  const debounceRef = useRef(null);
  const requestIdRef = useRef(0);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function runSearch(q) {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError("");

    const isPhoneLike = /^\d{3,}$/.test(q);

    const studentCalls = [searchStudentsByName(q).catch(() => [])];
    if (isPhoneLike) studentCalls.push(searchStudentsByPhone(q).catch(() => []));

    const roomCalls = [
      searchRoomsByNumber(q).catch(() => []),
      searchRoomsByType(q).catch(() => []),
      searchRoomsBySharing(q).catch(() => []),
    ];

    const hostelCall = searchHostelsByTitle(q).catch(() => []);

    const complaintCalls = [
      searchComplaintsByTitle(q).catch(() => []),
      searchComplaintsByStudentName(q).catch(() => []),
    ];

    try {
      const [studentResults, roomResults, hostelResults, complaintResults] = await Promise.all([
        Promise.all(studentCalls),
        Promise.all(roomCalls),
        hostelCall,
        Promise.all(complaintCalls),
      ]);

      if (requestId !== requestIdRef.current) return; // a newer search superseded this one

      setStudents(dedupeById(studentResults.flat()).slice(0, MAX_PER_SECTION));
      setRooms(dedupeById(roomResults.flat()).slice(0, MAX_PER_SECTION));
      setHostels((hostelResults || []).slice(0, MAX_PER_SECTION));
      setComplaints(dedupeById(complaintResults.flat()).slice(0, MAX_PER_SECTION));
    } catch (err) {
      if (requestId === requestIdRef.current) {
        setError(err.message || "Search failed");
      }
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }

  useEffect(() => {
    window.clearTimeout(debounceRef.current);

    const trimmed = query.trim();
    if (trimmed.length < MIN_CHARS) {
      setStudents([]);
      setRooms([]);
      setHostels([]);
      setComplaints([]);
      setLoading(false);
      setError("");
      return;
    }

    debounceRef.current = window.setTimeout(() => {
      runSearch(trimmed);
    }, DEBOUNCE_MS);

    return () => window.clearTimeout(debounceRef.current);
  }, [query]);

  function goTo(path) {
    setOpen(false);
    setQuery("");
    navigate(path);
  }

  const trimmed = query.trim();
  const hasQuery = trimmed.length >= MIN_CHARS;
  const totalResults = students.length + rooms.length + hostels.length + complaints.length;

  return (
    <div className="global-search-wrapper" ref={wrapperRef}>
      <div className="top-navbar-search">
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
          <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          placeholder="Search students, rooms, hostels, complaints..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false);
              e.currentTarget.blur();
            }
          }}
        />
        {query && (
          <button
            type="button"
            className="global-search-clear"
            onClick={() => setQuery("")}
            aria-label="Clear search"
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {open && hasQuery && (
        <div className="global-search-dropdown">
          {loading && <p className="global-search-status">Searching...</p>}

          {!loading && error && <p className="global-search-status">{error}</p>}

          {!loading && !error && totalResults === 0 && (
            <p className="global-search-status">No results for "{trimmed}"</p>
          )}

          {!loading && !error && totalResults > 0 && (
            <>
              <ResultSection
                title="Students"
                items={students}
                renderItem={(s) => (
                  <button key={`s-${s.id}`} onClick={() => goTo(`/students/${s.id}`)}>
                    <span className="gs-item-title">{s.full_name}</span>
                    <span className="gs-item-sub">{s.phone || s.email || "Student"}</span>
                  </button>
                )}
              />
              <ResultSection
                title="Rooms"
                items={rooms}
                renderItem={(r) => (
                  <button key={`r-${r.id}`} onClick={() => goTo(`/rooms/${r.id}`)}>
                    <span className="gs-item-title">Room {r.room_number}</span>
                    <span className="gs-item-sub">
                      {r.room_type} · {r.sharing_type}
                    </span>
                  </button>
                )}
              />
              <ResultSection
                title="Hostels"
                items={hostels}
                renderItem={(h) => (
                  <button key={`h-${h.id}`} onClick={() => goTo(`/hostels/${h.id}`)}>
                    <span className="gs-item-title">{h.title}</span>
                    <span className="gs-item-sub">
                      {h.city}
                      {h.state ? `, ${h.state}` : ""}
                    </span>
                  </button>
                )}
              />
              <ResultSection
                title="Complaints"
                items={complaints}
                renderItem={(c) => (
                  <button key={`c-${c.id}`} onClick={() => goTo(`/complaints/${c.id}`)}>
                    <span className="gs-item-title">{c.title}</span>
                    <span className="gs-item-sub">
                      {c.student_name} · {c.status}
                    </span>
                  </button>
                )}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

function ResultSection({ title, items, renderItem }) {
  if (!items.length) return null;
  return (
    <div className="global-search-section">
      <p className="global-search-section-title">{title}</p>
      <div className="global-search-items">{items.map(renderItem)}</div>
    </div>
  );
}

export default GlobalSearch;
