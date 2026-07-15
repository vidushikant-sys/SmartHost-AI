import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import {

    FaArrowLeft,

    FaUserEdit

} from "react-icons/fa";

import DashboardLayout from "../../layouts/DashboardLayout";

import StudentForm from "../../components/student/StudentForm";

import {

    getStudentById,

    updateStudent

} from "../../services/studentService";

import "../../styles/student.css";
export default function EditStudent() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [student, setStudent] = useState(null);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    useEffect(() => {

        loadStudent();

    }, []);

    const loadStudent = async () => {

        try {

            const response = await getStudentById(id);

            setStudent(response.data);

        }

        catch (error) {

            console.error(error);

            alert(

                "Unable to load student."

            );

            navigate("/students");

        }

        finally {

            setLoading(false);

        }

    };

    const handleUpdate = async (studentData) => {

        try {

            setSaving(true);

            await updateStudent(id, studentData);

            alert(

                "Student Updated Successfully."

            );

            navigate("/students");

        }

        catch (error) {

            console.error(error);

            alert(

                error?.response?.data?.message ||

                "Unable to update student."

            );

        }

        finally {

            setSaving(false);

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

                            <FaUserEdit />

                            {" "}

                            Edit Student

                        </h1>

                        <p>

                            Update student information.

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
                {/* Loading */}
                {/* ========================= */}

                {

                    loading

                    ?

                    (

                        <div className="student-loading">

                            Loading Student Details...

                        </div>

                    )

                    :

                    (

                        <div className="student-form-card">

                            <StudentForm

                                initialData={student}

                                loading={saving}

                                onSubmit={handleUpdate}

                                buttonText="Update Student"

                            />

                        </div>

                    )

                }

            </div>

        </DashboardLayout>

    );

}