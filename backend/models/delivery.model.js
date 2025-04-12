const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DeliverySchema = new Schema(
  {
    status: {
      type: String,
      enum: ["ACCEPTED", "PICKED_UP", "DELIVERED", "CANCELLED"],
      required: true,
      default: "ACCEPTED",
    },
    donation: {
      type: Schema.Types.ObjectId,
      ref: "Donation",
      required: true,
      unique: true,
    },
    volunteer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pickedUpAt: Date,
    deliveredAt: Date,
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Delivery", DeliverySchema);
