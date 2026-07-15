import { FaUserGraduate, FaUserCheck, FaUserTimes, FaBed, FaUniversity, FaMoneyBillWave } from 'react-icons/fa';

function StudentStats({ students = [] }) {

    console.log("StudentStats Data:", students);
    console.log(Array.isArray(students));

    const totalStudents = students.length;
    const activeStudents = students.filter(

        student => student.status === "Active"

    ).length;

    const inactiveStudents = students.filter(

        student => student.status !== "Active"

    ).length;

    const allocatedRooms = students.filter(

        student => student.room_number

    ).length;

    const pendingFees = students.filter(

        student =>

            student.fee_status === "Pending"

    ).length;

    return (

        <div className="student-stats">

            <div className="student-stat-card total">

                <div className="stat-icon">

                    <FaUserGraduate />

                </div>

                <div>

                    <h3>

                        {totalStudents}

                    </h3>

                    <p>

                        Total Students

                    </p>

                </div>

            </div>

            <div className="student-stat-card active">

                <div className="stat-icon">

                    <FaUserCheck />

                </div>

                <div>

                    <h3>

                        {activeStudents}

                    </h3>

                    <p>

                        Active Students

                    </p>

                </div>

            </div>

            <div className="student-stat-card inactive">

                <div className="stat-icon">

                    <FaUserTimes />

                </div>

                <div>

                    <h3>

                        {inactiveStudents}

                    </h3>

                    <p>

                        Inactive Students

                    </p>

                </div>

            </div>
                        <div className="student-stat-card rooms">

                <div className="stat-icon">

                    <FaBed />

                </div>

                <div>

                    <h3>

                        {allocatedRooms}

                    </h3>

                    <p>

                        Room Allocated

                    </p>

                </div>

            </div>

            <div className="student-stat-card hostel">

                <div className="stat-icon">

                    <FaUniversity />

                </div>

                <div>

                    <h3>

                        {

                            new Set(

                                students.map(

                                    student => student.hostel_name

                                )

                            ).size

                        }

                    </h3>

                    <p>

                        Hostels

                    </p>

                </div>

            </div>

            <div className="student-stat-card fees">

                <div className="stat-icon">

                    <FaMoneyBillWave />

                </div>

                <div>

                    <h3>

                        {pendingFees}

                    </h3>

                    <p>

                        Pending Fees

                    </p>

                </div>

            </div>

        </div>

    );

}

export default StudentStats;