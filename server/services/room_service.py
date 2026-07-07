from config.extensions import db
from models.room import Room


# ==========================================
# Create Room
# ==========================================
def create_room(data):

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

    return room


# ==========================================
# Get All Rooms
# ==========================================
def get_all_rooms():

    rooms = Room.query.all()

    room_list = []

    for room in rooms:

        room_list.append({
            "id": room.id,
            "hostel_id": room.hostel_id,
            "room_number": room.room_number,
            "floor": room.floor,
            "room_type": room.room_type,
            "sharing_type": room.sharing_type,
            "monthly_fee": room.monthly_fee,
            "total_beds": room.total_beds,
            "available_beds": room.available_beds,
            "status": room.status,
            "description": room.description,
            "facilities": room.facilities,
            "created_at": room.created_at,
            "updated_at": room.updated_at
        })

    return room_list


# ==========================================
# Get Room By ID
# ==========================================
def get_room_by_id(room_id):

    room = Room.query.get(room_id)

    if room is None:
        return None

    return {
        "id": room.id,
        "hostel_id": room.hostel_id,
        "room_number": room.room_number,
        "floor": room.floor,
        "room_type": room.room_type,
        "sharing_type": room.sharing_type,
        "monthly_fee": room.monthly_fee,
        "total_beds": room.total_beds,
        "available_beds": room.available_beds,
        "status": room.status,
        "description": room.description,
        "facilities": room.facilities,
        "created_at": room.created_at,
        "updated_at": room.updated_at
    }


# ==========================================
# Update Room
# ==========================================
def update_room(room_id, data):

    room = Room.query.get(room_id)

    if room is None:
        return None

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

    return room


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