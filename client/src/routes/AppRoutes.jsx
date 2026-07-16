import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

import Login from "../auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";

import StudentList from "../pages/students/StudentList";
import AddStudent from "../pages/students/AddStudent";
import EditStudent from "../pages/students/EditStudent";
import StudentProfile from "../pages/students/StudentProfile";

import HostelList from "../pages/hostels/HostelList";
import AddHostel from "../pages/hostels/AddHostel";
import EditHostel from "../pages/hostels/EditHostel";
import HostelProfile from "../pages/hostels/HostelProfile";

function AppRoutes() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Login />} />

          {/* Protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default AppRoutes;