from config.extensions import db
from models.property import Property


# ==========================================
# Create Hostel
# ==========================================
def create_property(data, owner_id):

    property_obj = Property(
        owner_id=owner_id,
        title=data.get("title"),
        description=data.get("description"),
        hostel_type=data.get("hostel_type"),
        address=data.get("address"),
        city=data.get("city"),
        state=data.get("state"),
        country=data.get("country"),
        pincode=data.get("pincode"),
        monthly_fee=data.get("monthly_fee"),
        total_capacity=data.get("total_capacity"),
        bedrooms=data.get("bedrooms", 0),
        bathrooms=data.get("bathrooms", 0),
        amenities=data.get("amenities", [])
    )

    db.session.add(property_obj)
    db.session.commit()

    return property_obj


# ==========================================
# Get All Hostels
# ==========================================
def get_all_properties():

    properties = Property.query.all()

    return [property_obj.to_dict() for property_obj in properties]


# ==========================================
# Get Hostel By ID
# ==========================================
def get_property_by_id(property_id):

    property_obj = Property.query.get(property_id)

    if property_obj is None:
        return None

    return property_obj.to_dict()


# ==========================================
# Update Hostel
# ==========================================
def update_property(property_id, data, owner_id):

    property_obj = Property.query.get(property_id)

    if property_obj is None:
        return None

    if property_obj.owner_id != int(owner_id):
        return False

    property_obj.title = data.get("title", property_obj.title)
    property_obj.description = data.get("description", property_obj.description)
    property_obj.hostel_type = data.get("hostel_type", property_obj.hostel_type)

    property_obj.address = data.get("address", property_obj.address)
    property_obj.city = data.get("city", property_obj.city)
    property_obj.state = data.get("state", property_obj.state)
    property_obj.country = data.get("country", property_obj.country)
    property_obj.pincode = data.get("pincode", property_obj.pincode)

    property_obj.monthly_fee = data.get("monthly_fee", property_obj.monthly_fee)
    property_obj.total_capacity = data.get("total_capacity", property_obj.total_capacity)

    property_obj.bedrooms = data.get("bedrooms", property_obj.bedrooms)
    property_obj.bathrooms = data.get("bathrooms", property_obj.bathrooms)

    property_obj.amenities = data.get("amenities", property_obj.amenities)

    db.session.commit()

    return property_obj


# ==========================================
# Delete Hostel
# ==========================================
def delete_property(property_id, owner_id):

    property_obj = Property.query.get(property_id)

    if property_obj is None:
        return None

    if property_obj.owner_id != int(owner_id):
        return False

    db.session.delete(property_obj)
    db.session.commit()

    return True