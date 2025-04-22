import mongoose from "mongoose";
const Schema = mongoose.Schema;

const DeliverySchema = new Schema(
  {
    status: {
      type: String,
      enum: ["STAND_BY","ACCEPTED", "PICKED_UP", "DELIVERED", "CANCELLED"],
      required: true,
      default: "ACCEPTED",
    },
    donation: {
      type: Schema.Types.ObjectId,
      ref: "Donation",
      required: true,
      unique: true,
    },
    request: {
      type: Schema.Types.ObjectId,
      ref: "Request",
      required: true,
    },
    volunteer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pickupLocation: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
        index: "2dsphere",
      },
    },
    pickupLocationName: {
      type: String,
      required: true,
      trim: true,
    },
    
    pickedUpAt: Date,
    deliveredAt: Date,
    notes: String,
  },
  { timestamps: true }
);

export const Delivery = mongoose.model("Delivery", DeliverySchema);
