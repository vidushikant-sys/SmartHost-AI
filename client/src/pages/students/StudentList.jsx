import { useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";

import StudentStats from "../../components/student/StudentStats";
import StudentFilters from "../../components/student/StudentFilters";

import "../../styles/student.css";

export default function StudentList() {

    const [search, setSearch] = useState("");

    const [filters, setFilters] = useState({

        status: "",

        course: "",

        semester: ""

    });

    return (

        <DashboardLayout>

            <div className="student-page">

                {/* =========================== */}
                {/* Header */}
                {/* =========================== */}

                <div className="student-header">

                    <div>

                        <h1>

                            Student Management

                        </h1>

                    </div>

                    <p>

                        Manage all hostel students from one place.

                    </p>

                </div>

                {/* =========================== */}
                {/* Statistics */}
                {/* =========================== */}

                <StudentStats />

                {/* =========================== */}
                {/* Filters */}
                {/* =========================== */}

                <StudentFilters

                    search={search}

                    setSearch={setSearch}

                    filters={filters}

                    setFilters={setFilters}

                />

                {/* =========================== */}
                {/* Demo Card */}
                {/* =========================== */}

                <div className="student-card">

                    <h2>

                        Student Module

                    </h2>

                    <p>

                        Student Management module has been successfully connected.

                    </p>

                </div>

            </div>

        </DashboardLayout>

    );

}