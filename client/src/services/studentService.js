import axios from "axios";

// ==========================================
// Base API URL
// ==========================================

const API_URL = "http://127.0.0.1:5000/api/student";

// ==========================================
// Get All Students
// ==========================================

export const getAllStudents = async () => {

    const response = await axios.get(
        `${API_URL}/all`
    );

    return response.data;

};

// ==========================================
// Get Student By ID
// ==========================================

export const getStudentById = async (id) => {

    const response = await axios.get(
        `${API_URL}/${id}`
    );

    return response.data;

};

// ==========================================
// Add Student
// ==========================================

export const addStudent = async (studentData) => {

    const response = await axios.post(
        `${API_URL}/add`,
        studentData
    );

    return response.data;

};

// ==========================================
// Update Student
// ==========================================

export const updateStudent = async (id, studentData) => {

    const response = await axios.put(
        `${API_URL}/update/${id}`,
        studentData
    );

    return response.data;

};

// ==========================================
// Delete Student
// ==========================================

export const deleteStudent = async (id) => {

    const response = await axios.delete(
        `${API_URL}/delete/${id}`
    );

    return response.data;

};