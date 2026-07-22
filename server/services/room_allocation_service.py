from datetime import datetime

from config.extensions import db

from models.student import Student
from models.room import Room
from models.room_allocation import RoomAllocation
from validators.allocation_validator import AllocationValidator
from services.notification_service import notify_student


# =====================================================
# Helper Function
# =====================================================

def allocation_to_dict(allocation):

    return {

        "id": allocation.id,

        "student_id": allocation.student_id,

        "student_name": allocation.student.full_name,

        "room_id": allocation.room_id,

        "room_number": allocation.room.room_number,

        "allocated_date": str(allocation.allocated_date),

        "vacated_date": (
            str(allocation.vacated_date)
            if allocation.vacated_date
            else None
        ),

        "allocation_status": allocation.allocation_status,

        "remarks": allocation.remarks,

        "created_at": str(allocation.created_at),

        "updated_at": str(allocation.updated_at)

    }


# =====================================================
# Allocate Room
# =====================================================

def allocate_room(data):

    is_valid, errors = AllocationValidator.validate_allocate(data)

    if not is_valid:
        return None, errors

    student_id = data.get("student_id")

    room_id = data.get("room_id")

    allocated_date = datetime.strptime(
        data.get("allocated_date"),
        "%Y-%m-%d"
    ).date()

    remarks = data.get("remarks")

    # -----------------------------------------
    # Check Student
    # -----------------------------------------

    student = Student.query.get(student_id)

    if student is None:
        return None, "Student not found"

    if student.status != "Active":
        return None, "Student is not active"

    # -----------------------------------------
    # Check Room
    # -----------------------------------------

    room = Room.query.get(room_id)

    if room is None:
        return None, "Room not found"

    if room.status == "Maintenance":
        return None, "Room is under maintenance"

    if room.available_beds <= 0:
        return None, "Room is Full"

    # -----------------------------------------
    # Check Existing Allocation
    # -----------------------------------------

    existing = RoomAllocation.query.filter_by(
        student_id=student_id,
        allocation_status="Allocated"
    ).first()

    if existing:
        return None, "Student already allocated"

    # -----------------------------------------
    # Create Allocation
    # -----------------------------------------

    allocation = RoomAllocation(

        student_id=student_id,

        room_id=room_id,

        allocated_date=allocated_date,

        allocation_status="Allocated",

        remarks=remarks

    )

    db.session.add(allocation)

    # -----------------------------------------
    # Update Room
    # -----------------------------------------

    room.available_beds -= 1

    if room.available_beds == 0:
        room.status = "Occupied"

    db.session.commit()

    notify_student(
        student_id,
        "Room Allocated",
        f"Room {room.room_number} has been allocated to you effective {allocated_date}.",
        type="Allocation"
    )

    return allocation, None
# =====================================================
# Get All Allocations
# =====================================================

def get_all_allocations():

    allocations = RoomAllocation.query.order_by(
        RoomAllocation.id.desc()
    ).all()

    return [
        allocation_to_dict(allocation)
        for allocation in allocations
    ]


# =====================================================
# Get Allocation By Student
# =====================================================

def get_student_allocation(student_id):

    allocation = RoomAllocation.query.filter_by(
        student_id=student_id,
        allocation_status="Allocated"
    ).first()

    if allocation is None:
        return None

    return allocation_to_dict(allocation)


# =====================================================
# Get Allocation By Room
# =====================================================

def get_room_allocations(room_id):

    allocations = RoomAllocation.query.filter_by(
        room_id=room_id,
        allocation_status="Allocated"
    ).all()

    return [
        allocation_to_dict(allocation)
        for allocation in allocations
    ]
    # =====================================================
# Transfer Room
# =====================================================

def transfer_room(student_id, data):

    is_valid, errors = AllocationValidator.validate_transfer(data)

    if not is_valid:
        return None, errors

    new_room_id = data.get("room_id")

    transfer_date = datetime.strptime(
        data.get("allocated_date"),
        "%Y-%m-%d"
    ).date()

    remarks = data.get("remarks")

    # -----------------------------------------
    # Active Allocation
    # -----------------------------------------

    current = RoomAllocation.query.filter_by(
        student_id=student_id,
        allocation_status="Allocated"
    ).first()

    if current is None:
        return None, "Student has no active room"

    # -----------------------------------------
    # New Room
    # -----------------------------------------

    new_room = Room.query.get(new_room_id)

    if new_room is None:
        return None, "Room not found"

    if new_room.status == "Maintenance":
        return None, "Room is under maintenance"

    if new_room.available_beds <= 0:
        return None, "Room is Full"

    if current.room_id == new_room_id:
        return None, "Student is already in this room"

    # -----------------------------------------
    # Old Room
    # -----------------------------------------

    old_room = Room.query.get(current.room_id)

    old_room.available_beds += 1

    if old_room.status in ("Full", "Occupied"):
        old_room.status = "Available"

    # -----------------------------------------
    # New Room Update
    # -----------------------------------------

    new_room.available_beds -= 1

    if new_room.available_beds == 0:
        new_room.status = "Occupied"

    # -----------------------------------------
    # Close Old Allocation
    # -----------------------------------------

    current.allocation_status = "Transferred"
    current.vacated_date = transfer_date

    # -----------------------------------------
    # Create New Allocation
    # -----------------------------------------

    new_allocation = RoomAllocation(

        student_id=student_id,

        room_id=new_room_id,

        allocated_date=transfer_date,

        allocation_status="Allocated",

        remarks=remarks

    )

    db.session.add(new_allocation)

    db.session.commit()

    notify_student(
        student_id,
        "Room Transferred",
        f"You have been transferred from Room {old_room.room_number} to Room {new_room.room_number}, effective {transfer_date}.",
        type="Allocation"
    )

    return new_allocation, None
# =====================================================
# Vacate Room
# =====================================================

def vacate_room(student_id, data):

    is_valid, errors = AllocationValidator.validate_vacate(data)

    if not is_valid:
        return None, errors

    vacated_date = datetime.strptime(
        data.get("vacated_date"),
        "%Y-%m-%d"
    ).date()

    remarks = data.get("remarks")

    # -----------------------------------------
    # Active Allocation
    # -----------------------------------------

    allocation = RoomAllocation.query.filter_by(
        student_id=student_id,
        allocation_status="Allocated"
    ).first()

    if allocation is None:
        return None, "Student has no active room"

    # -----------------------------------------
    # Room
    # -----------------------------------------

    room = Room.query.get(allocation.room_id)

    if room is None:
        return None, "Room not found"

    # -----------------------------------------
    # Update Allocation
    # -----------------------------------------

    allocation.allocation_status = "Vacated"
    allocation.vacated_date = vacated_date
    allocation.remarks = remarks

    # -----------------------------------------
    # Update Room
    # -----------------------------------------

    room.available_beds += 1

    if room.available_beds > 0 and room.status != "Maintenance":
        room.status = "Available"

    db.session.commit()

    notify_student(
        student_id,
        "Room Vacated",
        f"Room {room.room_number} has been marked as vacated, effective {vacated_date}.",
        type="Allocation"
    )

    return allocation, None