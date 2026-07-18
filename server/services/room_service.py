from config.extensions import db
from models.room import Room
from validators.room_validator import RoomValidator

# ==========================================
# Create Room
# ==========================================
def create_room(data):

    is_valid, errors = RoomValidator.validate(data)

    if not is_valid:
        return None, errors

    room = Room(
        hostel_id=data.get("hostel_id"),
        room_number=data.get("room_number"),
        floor=data.get("floor"),
        room_type=data.get("room_type"),
        sharing_type=data.get("sharing_type"),
        monthly_fee=data.get("monthly_fee"),
        total_beds=data.get("total_beds"),
        available_beds=data.get("available_beds"),
        status=data.get("status", "Available"),
        description=data.get("description"),
        facilities=data.get("facilities")
    )

    db.session.add(room)
    db.session.commit()

    return room, None

# ==========================================
# Get All Rooms
# ==========================================
def get_all_rooms(hostel_id=None):

    query = Room.query

    if hostel_id:
        query = query.filter(Room.hostel_id == hostel_id)

    rooms = query.all()

    return [room.to_dict() for room in rooms]
# ==========================================
# Get Room By ID
# ==========================================
def get_room_by_id(room_id):

    room = Room.query.get(room_id)

    if room is None:
        return None

    return room.to_dict()


# ==========================================
# Update Room
# ==========================================
def update_room(room_id, data):

    is_valid, errors = RoomValidator.validate(data)

    if not is_valid:
        return None, errors

    room = Room.query.get(room_id)

    if room is None:
        return None, "Room not found"

    # NOTE: hostel_id is now updated too (it was previously skipped here,
    # so a room's hostel could never actually be changed via this update
    # function even if a valid hostel_id was sent).
    room.hostel_id = data.get("hostel_id", room.hostel_id)
    room.room_number = data.get("room_number", room.room_number)
    room.floor = data.get("floor", room.floor)
    room.room_type = data.get("room_type", room.room_type)
    room.sharing_type = data.get("sharing_type", room.sharing_type)
    room.monthly_fee = data.get("monthly_fee", room.monthly_fee)
    room.total_beds = data.get("total_beds", room.total_beds)
    room.available_beds = data.get("available_beds", room.available_beds)
    room.status = data.get("status", room.status)
    room.description = data.get("description", room.description)
    room.facilities = data.get("facilities", room.facilities)

    db.session.commit()

    return room, None

# ==========================================
# Delete Room
# ==========================================
def delete_room(room_id):

    room = Room.query.get(room_id)

    if room is None:
        return False

    db.session.delete(room)
    db.session.commit()

    return True