import { FaSearch, FaFilter } from "react-icons/fa";

export default function StudentFilters({

    search,
    setSearch,

    filters,
    setFilters

}) {

    return (

        <div className="student-filters">

            <div className="search-box">

                <FaSearch />

                <input

                    type="text"

                    placeholder="Search student by name, email or phone..."

                    value={search}

                    onChange={(e)=>setSearch(e.target.value)}

                />

            </div>

            <div className="filter-group">

                <FaFilter className="filter-icon"/>

                <select

                    value={filters.status}

                    onChange={(e)=>

                        setFilters({

                            ...filters,

                            status:e.target.value

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

                <select

                    value={filters.course}

                    onChange={(e)=>

                        setFilters({

                            ...filters,

                            course:e.target.value

                        })

                    }

                >

                    <option value="">

                        All Courses

                    </option>

                    <option>BCA</option>

                    <option>BBA</option>

                    <option>B.Com</option>

                    <option>MCA</option>

                </select>

                <select

                    value={filters.semester}

                    onChange={(e)=>

                        setFilters({

                            ...filters,

                            semester:e.target.value

                        })

                    }

                >

                    <option value="">

                        Semester

                    </option>

                    <option>1</option>

                    <option>2</option>

                    <option>3</option>

                    <option>4</option>

                    <option>5</option>

                    <option>6</option>

                </select>

            </div>

        </div>

    );

}