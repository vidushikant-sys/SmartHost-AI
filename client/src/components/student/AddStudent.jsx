import { useState } from "react";

import { useNavigate } from "react-router-dom";

import {

    FaArrowLeft,

    FaUserPlus

} from "react-icons/fa";

import DashboardLayout from "../../layouts/DashboardLayout";

import StudentForm from "../../components/student/StudentForm";

import {

    createStudent

} from "../../services/studentService";

import "../../styles/student.css";
export default function AddStudent() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (studentData) => {

        try {

            setLoading(true);

            await createStudent(studentData);

            alert(

                "Student Added Successfully."

            );

            navigate("/students");

        }

        catch (error) {

            console.error(error);

            alert(

                error?.response?.data?.message ||

                "Unable to add student."

            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <DashboardLayout>

            <div className="student-page">

                {/* ========================= */}
                {/* Header */}
                {/* ========================= */}

                <div className="student-header">

                    <div>

                        <h1>

                            <FaUserPlus />

                            {" "}

                            Add Student

                        </h1>

                        <p>

                            Register a new student into the hostel.

                        </p>

                    </div>

                    <button

                        className="back-btn"

                        onClick={() =>

                            navigate("/students")

                        }

                    >

                        <FaArrowLeft />

                        Back

                    </button>

                </div>
                                {/* ========================= */}
                {/* Student Form */}
                {/* ========================= */}

                <div className="student-form-card">

                    <StudentForm

                        loading={loading}

                        onSubmit={handleSubmit}

                        buttonText="Add Student"

                    />

                </div>

            </div>

        </DashboardLayout>

    );

}