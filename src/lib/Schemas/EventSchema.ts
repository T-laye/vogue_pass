import mongoose, { Schema } from "mongoose";
import { IEvent } from "../Types";

// Event Schema
const eventSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Relating Event to User
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"], // Example statuses
      default: "pending",
    },
    tickets: [
      {
        type: Schema.Types.ObjectId,
        ref: "Ticket", // Relating Event to Tickets
      },
    ],
    approved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Event =
  mongoose.models.Event || mongoose.model<IEvent>("Event", eventSchema);

 export {Event}