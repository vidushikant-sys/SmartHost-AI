import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";

// Student
import StudentList from "../pages/students/StudentList";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* Student */}

        <Route
          path="/students"
          element={<StudentList />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;