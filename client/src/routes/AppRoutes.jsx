import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { HostelProvider } from "../context/HostelContext";
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
import AllocateRoomPage from "../pages/rooms/AllocateRoomPage";

// ======================
// Fee Module
// ======================
import FeeList from "../pages/fees/FeeList";
import GenerateFee from "../pages/fees/GenerateFee";
import FeeDetails from "../pages/fees/FeeDetails";

// ======================
// Complaint Module
// ======================
import ComplaintList from "../pages/complaints/ComplaintList";
import FileComplaint from "../pages/complaints/FileComplaint";
import ComplaintDetails from "../pages/complaints/ComplaintDetails";

// ======================
// Notice Module
// ======================
import NoticeList from "../pages/notices/NoticeList";
import AddNotice from "../pages/notices/AddNotice";
import EditNotice from "../pages/notices/EditNotice";

function AppRoutes() {
  return (
    <AuthProvider>
      <HostelProvider>
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
              path="/rooms/allocate"
              element={
                <ProtectedRoute>
                  <AllocateRoomPage />
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

            {/* ================= Fee Routes ================= */}
            <Route
              path="/fees"
              element={
                <ProtectedRoute>
                  <FeeList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/fees/generate"
              element={
                <ProtectedRoute>
                  <GenerateFee />
                </ProtectedRoute>
              }
            />
            <Route
              path="/fees/:id"
              element={
                <ProtectedRoute>
                  <FeeDetails />
                </ProtectedRoute>
              }
            />

            {/* ================= Complaint Routes ================= */}
            <Route
              path="/complaints"
              element={
                <ProtectedRoute>
                  <ComplaintList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/complaints/add"
              element={
                <ProtectedRoute>
                  <FileComplaint />
                </ProtectedRoute>
              }
            />
            <Route
              path="/complaints/:id"
              element={
                <ProtectedRoute>
                  <ComplaintDetails />
                </ProtectedRoute>
              }
            />

            {/* ================= Notice Routes ================= */}
            <Route
              path="/notices"
              element={
                <ProtectedRoute>
                  <NoticeList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notices/new"
              element={
                <ProtectedRoute>
                  <AddNotice />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notices/:id/edit"
              element={
                <ProtectedRoute>
                  <EditNotice />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </HostelProvider>
    </AuthProvider>
  );
}

export default AppRoutes;
