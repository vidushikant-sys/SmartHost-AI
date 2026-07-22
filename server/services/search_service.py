from models.student import Student
from models.room import Room
from models.property import Property
from models.fee import Fee
from models.complaint import Complaint



# ==================================================
# Search Students
# ==================================================

def search_students(filters):

    query = Student.query


    if filters.get("name"):

        query = query.filter(
            Student.full_name.ilike(
                f"%{filters['name']}%"
            )
        )


    if filters.get("email"):

        query = query.filter(
            Student.email.ilike(
                f"%{filters['email']}%"
            )
        )


    if filters.get("phone"):

        query = query.filter(
            Student.phone.ilike(
                f"%{filters['phone']}%"
            )
        )


    if filters.get("college"):

        query = query.filter(
            Student.college_name.ilike(
                f"%{filters['college']}%"
            )
        )


    if filters.get("course"):

        query = query.filter(
            Student.course.ilike(
                f"%{filters['course']}%"
            )
        )


    students = query.all()


    return [
        student.to_dict()
        for student in students
    ]



# ==================================================
# Search Rooms
# ==================================================

def search_rooms(filters):

    query = Room.query


    if filters.get("room_number"):

        query = query.filter(
            Room.room_number.ilike(
                f"%{filters['room_number']}%"
            )
        )


    if filters.get("status"):

        query = query.filter(
            Room.status == filters["status"]
        )


    if filters.get("room_type"):

        query = query.filter(
            Room.room_type.ilike(
                f"%{filters['room_type']}%"
            )
        )


    if filters.get("sharing_type"):

        query = query.filter(
            Room.sharing_type.ilike(
                f"%{filters['sharing_type']}%"
            )
        )


    if filters.get("hostel_id"):

        query = query.filter(
            Room.hostel_id == filters["hostel_id"]
        )


    rooms = query.all()


    return [
        room.to_dict()
        for room in rooms
    ]



# ==================================================
# Search Hostels
# ==================================================

def search_hostels(filters):

    query = Property.query


    if filters.get("city"):

        query = query.filter(
            Property.city.ilike(
                f"%{filters['city']}%"
            )
        )


    if filters.get("state"):

        query = query.filter(
            Property.state.ilike(
                f"%{filters['state']}%"
            )
        )


    if filters.get("hostel_type"):

        query = query.filter(
            Property.hostel_type.ilike(
                f"%{filters['hostel_type']}%"
            )
        )


    if filters.get("title"):

        query = query.filter(
            Property.title.ilike(
                f"%{filters['title']}%"
            )
        )


    hostels = query.all()


    return [
        hostel.to_dict()
        for hostel in hostels
    ]



# ==================================================
# Search Fees
# ==================================================

def search_fees(filters):

    query = Fee.query


    if filters.get("student_id"):

        query = query.filter(
            Fee.student_id == filters["student_id"]
        )


    if filters.get("status"):

        query = query.filter(
            Fee.payment_status ==
            filters["status"]
        )


    if filters.get("month"):

        query = query.filter(
            Fee.month == filters["month"]
        )


    if filters.get("year"):

        query = query.filter(
            Fee.year == filters["year"]
        )


    fees = query.all()


    return [
        fee.to_dict()
        for fee in fees
    ]



# ==================================================
# Search Complaints
# ==================================================

def search_complaints(filters):

    query = Complaint.query.join(
        Student,
        Complaint.student_id == Student.id
    )


    if filters.get("title"):

        query = query.filter(
            Complaint.title.ilike(
                f"%{filters['title']}%"
            )
        )


    if filters.get("category"):

        query = query.filter(
            Complaint.category.ilike(
                f"%{filters['category']}%"
            )
        )


    if filters.get("status"):

        query = query.filter(
            Complaint.status == filters["status"]
        )


    if filters.get("priority"):

        query = query.filter(
            Complaint.priority == filters["priority"]
        )


    if filters.get("student_name"):

        query = query.filter(
            Student.full_name.ilike(
                f"%{filters['student_name']}%"
            )
        )


    complaints = query.all()


    return [
        complaint.to_dict()
        for complaint in complaints
    ]