import {

    FaSearch,

    FaFilter,

    FaTimes

} from "react-icons/fa";
function StudentFilters({

    search,

    setSearch,

    filters,

    setFilters

}) {

    const clearFilters = () => {

        setSearch("");

        setFilters({

            course: "",

            semester: "",

            status: ""

        });

    };

    return (

        <div className="student-filter-card">

            <div className="filter-title">

                <FaFilter />

                <span>

                    Search & Filters

                </span>

            </div>

            <div className="student-filter-grid">

                {/* ====================== */}
                {/* Search */}
                {/* ====================== */}

                <div className="filter-group">

                    <label>

                        Search Student

                    </label>

                    <div className="search-box">

                        <FaSearch />

                        <input

                            type="text"

                            placeholder="Name, Email or Phone"

                            value={search}

                            onChange={(e) =>

                                setSearch(

                                    e.target.value

                                )

                            }

                        />

                    </div>

                </div>

                {/* ====================== */}
                {/* Course */}
                {/* ====================== */}

                <div className="filter-group">

                    <label>

                        Course

                    </label>

                    <select

                        value={filters.course}

                        onChange={(e) =>

                            setFilters({

                                ...filters,

                                course: e.target.value

                            })

                        }

                    >

                        <option value="">

                            All Courses

                        </option>

                        <option>

                            BCA

                        </option>

                        <option>

                            BBA

                        </option>

                        <option>

                            MCA

                        </option>

                        <option>

                            MBA

                        </option>

                    </select>

                </div>
                                {/* ====================== */}
                {/* Semester */}
                {/* ====================== */}

                <div className="filter-group">

                    <label>

                        Semester

                    </label>

                    <select

                        value={filters.semester}

                        onChange={(e) =>

                            setFilters({

                                ...filters,

                                semester: e.target.value

                            })

                        }

                    >

                        <option value="">

                            All Semesters

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

                {/* ====================== */}
                {/* Status */}
                {/* ====================== */}

                <div className="filter-group">

                    <label>

                        Status

                    </label>

                    <select

                        value={filters.status}

                        onChange={(e) =>

                            setFilters({

                                ...filters,

                                status: e.target.value

                            })

                        }

                    >

                        <option value="">

                            All Status

                        </option>

                        <option value="Active">

                            Active

                        </option>

                        <option value="Inactive">

                            Inactive

                        </option>

                    </select>

                </div>

            </div>

            {/* ====================== */}
            {/* Clear Button */}
            {/* ====================== */}

            <div className="filter-footer">

                <button

                    className="clear-filter-btn"

                    onClick={clearFilters}

                >

                    <FaTimes />

                    Clear Filters

                </button>

            </div>

        </div>

    );

}

export default StudentFilters;