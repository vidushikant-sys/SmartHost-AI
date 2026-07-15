import { useState } from "react";

import {

    FaUserGraduate,

    FaPhone,

    FaEnvelope,

    FaUniversity,

    FaBed,

    FaCalendarAlt,

    FaMapMarkerAlt,

    FaUserFriends,

    FaSave,

    FaTimes

} from "react-icons/fa";
function StudentForm({

    initialData = {},

    onSubmit,

    loading = false,

    buttonText = "Save Student"

}) {

    const [formData, setFormData] = useState({

        full_name:

            initialData.full_name || "",

        email:

            initialData.email || "",

        phone:

            initialData.phone || "",

        course:

            initialData.course || "",

        semester:

            initialData.semester || "",

        hostel_name:

            initialData.hostel_name || "",

        room_number:

            initialData.room_number || "",

        registration_number:

            initialData.registration_number || "",

        guardian_name:

            initialData.guardian_name || "",

        guardian_phone:

            initialData.guardian_phone || "",

        address:

            initialData.address || "",

        status:

            initialData.status || "Active"

    });

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]:

                e.target.value

        });

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        onSubmit(formData);

    };

    return (

        <form

            className="student-form"

            onSubmit={handleSubmit}

        >            {/* ================================= */}
            {/* Personal Information */}
            {/* ================================= */}

            <div className="form-section">

                <h2>

                    <FaUserGraduate />

                    Personal Information

                </h2>

                <div className="form-grid">

                    <div className="form-group">

                        <label>

                            Full Name

                        </label>

                        <input

                            type="text"

                            name="full_name"

                            value={formData.full_name}

                            onChange={handleChange}

                            placeholder="Enter Full Name"

                            required

                        />

                    </div>

                    <div className="form-group">

                        <label>

                            Registration Number

                        </label>

                        <input

                            type="text"

                            name="registration_number"

                            value={formData.registration_number}

                            onChange={handleChange}

                            placeholder="Registration Number"

                            required

                        />

                    </div>

                    <div className="form-group">

                        <label>

                            <FaEnvelope />

                            Email Address

                        </label>

                        <input

                            type="email"

                            name="email"

                            value={formData.email}

                            onChange={handleChange}

                            placeholder="student@email.com"

                            required

                        />

                    </div>

                    <div className="form-group">

                        <label>

                            <FaPhone />

                            Mobile Number

                        </label>

                        <input

                            type="text"

                            name="phone"

                            value={formData.phone}

                            onChange={handleChange}

                            placeholder="10 Digit Mobile Number"

                            required

                        />

                    </div>

                    <div className="form-group">

                        <label>

                            Course

                        </label>

                        <select

                            name="course"

                            value={formData.course}

                            onChange={handleChange}

                            required

                        >

                            <option value="">

                                Select Course

                            </option>

                            <option value="BCA">

                                BCA

                            </option>

                            <option value="BBA">

                                BBA

                            </option>

                            <option value="MCA">

                                MCA

                            </option>

                            <option value="MBA">

                                MBA

                            </option>

                        </select>

                    </div>

                    <div className="form-group">

                        <label>

                            Semester

                        </label>

                        <select

                            name="semester"

                            value={formData.semester}

                            onChange={handleChange}

                            required

                        >

                            <option value="">

                                Select Semester

                            </option>

                            <option value="1">

                                Semester 1

                            </option>

                            <option value="2">

                                Semester 2

                            </option>

                            <option value="3">

                                Semester 3

                            </option>

                            <option value="4">

                                Semester 4

                            </option>

                            <option value="5">

                                Semester 5

                            </option>

                            <option value="6">

                                Semester 6

                            </option>

                        </select>

                    </div>

                </div>

            </div>            {/* ================================= */}
            {/* Hostel Information */}
            {/* ================================= */}

            <div className="form-section">

                <h2>

                    <FaUniversity />

                    Hostel Information

                </h2>

                <div className="form-grid">

                    <div className="form-group">

                        <label>

                            Hostel Name

                        </label>

                        <input

                            type="text"

                            name="hostel_name"

                            value={formData.hostel_name}

                            onChange={handleChange}

                            placeholder="Hostel Name"

                        />

                    </div>

                    <div className="form-group">

                        <label>

                            <FaBed />

                            Room Number

                        </label>

                        <input

                            type="text"

                            name="room_number"

                            value={formData.room_number}

                            onChange={handleChange}

                            placeholder="Room Number"

                        />

                    </div>

                    <div className="form-group">

                        <label>

                            <FaUserFriends />

                            Guardian Name

                        </label>

                        <input

                            type="text"

                            name="guardian_name"

                            value={formData.guardian_name}

                            onChange={handleChange}

                            placeholder="Guardian Name"

                        />

                    </div>

                    <div className="form-group">

                        <label>

                            Guardian Phone

                        </label>

                        <input

                            type="text"

                            name="guardian_phone"

                            value={formData.guardian_phone}

                            onChange={handleChange}

                            placeholder="Guardian Mobile Number"

                        />

                    </div>

                    <div className="form-group full-width">

                        <label>

                            <FaMapMarkerAlt />

                            Address

                        </label>

                        <textarea

                            name="address"

                            rows="4"

                            value={formData.address}

                            onChange={handleChange}

                            placeholder="Complete Address"

                        />

                    </div>

                    <div className="form-group">

                        <label>

                            Student Status

                        </label>

                        <select

                            name="status"

                            value={formData.status}

                            onChange={handleChange}

                        >

                            <option value="Active">

                                Active

                            </option>

                            <option value="Inactive">

                                Inactive

                            </option>

                        </select>

                    </div>

                </div>

            </div>
                        {/* ================================= */}
            {/* Action Buttons */}
            {/* ================================= */}

            <div className="student-form-actions">

                <button

                    type="submit"

                    className="save-btn"

                    disabled={loading}

                >

                    <FaSave />

                    {

                        loading

                            ? "Saving..."

                            : buttonText

                    }

                </button>

                <button

                    type="reset"

                    className="cancel-btn"

                    onClick={() =>

                        window.history.back()

                    }

                >

                    <FaTimes />

                    Cancel

                </button>

            </div>

        </form>

    );

}

export default StudentForm;