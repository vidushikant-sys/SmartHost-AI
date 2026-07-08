from config.extensions import db


class FeePayment(db.Model):
    __tablename__ = "fee_payments"

    # -----------------------------------------
    # Primary Key
    # -----------------------------------------

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    # -----------------------------------------
    # Foreign Key
    # -----------------------------------------

    fee_id = db.Column(
        db.Integer,
        db.ForeignKey("fees.id"),
        nullable=False
    )

    # -----------------------------------------
    # Payment Information
    # -----------------------------------------

    payment_amount = db.Column(
        db.Float,
        nullable=False
    )

    payment_date = db.Column(
        db.Date,
        nullable=False
    )

    payment_method = db.Column(
        db.String(30),
        nullable=False
    )
    # Cash
    # UPI
    # Bank Transfer
    # Card

    transaction_id = db.Column(
        db.String(150)
    )

    received_by = db.Column(
        db.String(100)
    )

    remarks = db.Column(
        db.Text
    )

    # -----------------------------------------
    # Timestamp
    # -----------------------------------------

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

    updated_at = db.Column(
        db.DateTime,
        server_default=db.func.now(),
        onupdate=db.func.now()
    )

    # -----------------------------------------
    # Convert Object To Dictionary
    # -----------------------------------------

    def to_dict(self):

        return {

            "id": self.id,

            "fee_id": self.fee_id,

            "payment_amount": self.payment_amount,

            "payment_date": str(self.payment_date),

            "payment_method": self.payment_method,

            "transaction_id": self.transaction_id,

            "received_by": self.received_by,

            "remarks": self.remarks,

            "created_at": str(self.created_at),

            "updated_at": str(self.updated_at)

        }