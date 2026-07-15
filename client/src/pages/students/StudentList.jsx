import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

import DashboardLayout from "../../layouts/DashboardLayout";

import StudentStats from "../../components/student/StudentStats";
import StudentFilters from "../../components/student/StudentFilters";
import StudentTable from "../../components/student/StudentTable";

import {

    getAllStudents

} from "../../services/studentService";

import "../../styles/student.css";
export default function StudentList() {

    const navigate = useNavigate();

    const [students, setStudents] = useState([]);

    const [filteredStudents, setFilteredStudents] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [filters, setFilters] = useState({

        course: "",

        semester: "",

        status: ""

    });

    useEffect(() => {

        loadStudents();

    }, []);

    useEffect(() => {

        filterStudents();

    }, [

        students,

        search,

        filters

    ]);

    const loadStudents = async () => {

        try {

            const response = await getAllStudents();

const data = response.data.data || [];
console.log(data);
console.log(Array.isArray(data));
            setStudents(data);

            setFilteredStudents(data);

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };
    // =====================================
// Filter Students
// =====================================

const filterStudents = () => {

    let data = [...students];

    // Search

    if (search.trim() !== "") {

        data = data.filter((student) =>

            student.full_name
                ?.toLowerCase()
                .includes(search.toLowerCase())

            ||

            student.email
                ?.toLowerCase()
                .includes(search.toLowerCase())

            ||

            student.phone
                ?.includes(search)

        );

    }

    // Course

    if (filters.course !== "") {

        data = data.filter(

            student =>

                student.course === filters.course

        );

    }

    // Semester

    if (filters.semester !== "") {

        data = data.filter(

            student =>

                String(student.semester) ===

                String(filters.semester)

        );

    }

    // Status

    if (filters.status !== "") {

        data = data.filter(

            student =>

                student.status === filters.status

        );

    }

    setFilteredStudents(data);

};

// =====================================
// Actions
// =====================================

const handleView = (student) => {

    navigate(

        `/students/profile/${student.id}`

    );

};

const handleEdit = (student) => {

    navigate(

        `/students/edit/${student.id}`

    );

};

const handleDelete = (student) => {

    const confirmDelete = window.confirm(

        `Delete ${student.full_name}?`

    );

    if (confirmDelete) {

        alert(

            "Delete functionality will be connected in next phase."

        );

    }

};

// =====================================
// UI
// =====================================

return (

    <DashboardLayout>

        <div className="student-page">

            {/* ======================== */}
            {/* Header */}
            {/* ======================== */}

            <div className="student-header">

                <div>

                    <h1>

                        Student Management

                    </h1>

                    <p>

                        Manage all hostel students from one place.

                    </p>

                </div>
<button

    className="add-student-btn"

    onClick={() => navigate("/students/add")}

>

    <FaPlus />

    Add Student

</button>
            </div>
                        {/* ======================== */}
            {/* Statistics */}
            {/* ======================== */}

            <StudentStats

                students={students}

            />

            {/* ======================== */}
            {/* Search & Filters */}
            {/* ======================== */}

            <StudentFilters

                search={search}

                setSearch={setSearch}

                filters={filters}

                setFilters={setFilters}

            />

            {/* ======================== */}
            {/* Students Table */}
            {/* ======================== */}

            <div className="student-table-wrapper">

                {

                    loading

                    ?

                    (

                        <div className="student-loading">

                            Loading students...

                        </div>

                    )

                    :

                    (

                        <StudentTable

                            students={filteredStudents}

                            loading={loading}

                            onView={handleView}

                            onEdit={handleEdit}

                            onDelete={handleDelete}

                        />

                    )

                }

            </div>

            {/* ======================== */}
            {/* Footer */}
            {/* ======================== */}

            <div className="student-footer">

                <span>

                    Showing

                    {" "}

                    <strong>

                        {filteredStudents.length}

                    </strong>

                    {" "}

                    of

                    {" "}

                    <strong>

                        {students.length}

                    </strong>

                    {" "}

                    Students

                </span>

            </div>
                    </div>

    </DashboardLayout>

);

}