import {
    FaUserGraduate,
    FaUserCheck,
    FaBed,
    FaDoorOpen
} from "react-icons/fa";

export default function StudentStats({ students = [] }) {

    const totalStudents = students.length;

    const activeStudents = students.filter(
        student => student.status === "Active"
    ).length;

    const allocatedStudents = students.filter(
        student =>
            student.room_number !== null &&
            student.room_number !== undefined &&
            student.room_number !== ""
    ).length;

    const vacantStudents =
        totalStudents - allocatedStudents;

    const stats = [

        {
            title: "Total Students",
            value: totalStudents,
            icon: <FaUserGraduate />,
            className: "blue"
        },

        {
            title: "Active Students",
            value: activeStudents,
            icon: <FaUserCheck />,
            className: "green"
        },

        {
            title: "Room Allocated",
            value: allocatedStudents,
            icon: <FaBed />,
            className: "orange"
        },

        {
            title: "Vacant",
            value: vacantStudents,
            icon: <FaDoorOpen />,
            className: "red"
        }

    ];

    return (

        <div className="student-stats">

            {

                stats.map((item, index) => (

                    <div
                        key={index}
                        className={`student-stat-card ${item.className}`}
                    >

                        <div className="student-stat-icon">

                            {item.icon}

                        </div>

                        <div className="student-stat-content">

                            <h2>

                                {item.value}

                            </h2>

                            <p>

                                {item.title}

                            </p>

                        </div>

                    </div>

                ))

            }

        </div>

    );

}