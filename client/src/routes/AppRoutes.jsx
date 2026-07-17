import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

import Login from "../auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";

// ======================
// Student Module
// ======================
import StudentList from "../pages/students/StudentList";
import AddStudent from "../pages/students/AddStudent";
import EditStudent from "../pages/students/EditStudent";
import StudentProfile from "../pages/students/StudentProfile";

// ======================
// Hostel Module
// ======================
import HostelList from "../pages/hostels/HostelList";
import AddHostel from "../pages/hostels/AddHostel";
import EditHostel from "../pages/hostels/EditHostel";
import HostelProfile from "../pages/hostels/HostelProfile";

// ======================
// Room Module
// ======================
import RoomList from "../pages/rooms/RoomList";
import AddRoom from "../pages/rooms/AddRoom";
import EditRoom from "../pages/rooms/EditRoom";
import RoomDetails from "../pages/rooms/RoomDetails";

function AppRoutes() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Login />} />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* ================= Student Routes ================= */}
          <Route
            path="/students"
            element={
              <ProtectedRoute>
                <StudentList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students/add"
            element={
              <ProtectedRoute>
                <AddStudent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students/:id"
            element={
              <ProtectedRoute>
                <StudentProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students/:id/edit"
            element={
              <ProtectedRoute>
                <EditStudent />
              </ProtectedRoute>
            }
          />

          {/* ================= Hostel Routes ================= */}
          <Route
            path="/hostels"
            element={
              <ProtectedRoute>
                <HostelList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hostels/add"
            element={
              <ProtectedRoute>
                <AddHostel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hostels/:id"
            element={
              <ProtectedRoute>
                <HostelProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hostels/:id/edit"
            element={
              <ProtectedRoute>
                <EditHostel />
              </ProtectedRoute>
            }
          />

          {/* ================= Room Routes ================= */}
          <Route
            path="/rooms"
            element={
              <ProtectedRoute>
                <RoomList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rooms/add"
            element={
              <ProtectedRoute>
                <AddRoom />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rooms/:id"
            element={
              <ProtectedRoute>
                <RoomDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rooms/:id/edit"
            element={
              <ProtectedRoute>
                <EditRoom />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default AppRoutes;