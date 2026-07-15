import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";

// Student
import StudentList from "../pages/students/StudentList";
import AddStudent from "../pages/students/AddStudent";
import EditStudent from "../pages/students/EditStudent";

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
        <Route

    path="/students/edit/:id"

    element={<EditStudent />}

/>
        <Route

    path="/students/add"

    element={<AddStudent />}

/>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;