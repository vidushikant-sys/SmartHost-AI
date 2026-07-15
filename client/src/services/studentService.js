import axios from "axios";

const API = axios.create({

    baseURL: "http://127.0.0.1:5000/api"

});

// ================================
// Get JWT Token
// ================================

API.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    if (token) {

        config.headers.Authorization = `Bearer ${token}`;

    }

    return config;

});

// ================================
// Get All Students
// ================================

export const getAllStudents = () =>

    API.get("/student/all");

// ================================
// Get Student By Id
// ================================

export const getStudentById = (id) =>

    API.get(`/student/${id}`);

// ================================
// Create Student
// ================================

export const createStudent = (data) =>

    API.post("/student/create", data);

// ================================
// Update Student
// ================================

export const updateStudent = (id, data) =>

    API.put(`/student/update/${id}`, data);

// ================================
// Delete Student
// ================================

export const deleteStudent = (id) =>

    API.delete(`/student/delete/${id}`);