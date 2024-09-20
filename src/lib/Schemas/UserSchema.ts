import mongoose, { Schema } from "mongoose";
import { IUser } from "../Types";

// User Schema
const userSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    events: [
      {
        type: Schema.Types.ObjectId,
        ref: "Event", // Relating User to Event
      },
    ],
    tickets: [
      {
        type: Schema.Types.ObjectId,
        ref: "Ticket", // Relating User to Ticket
      },
    ],
    notifications: [
      {
        message: {
          type: String,
        },
        read: {
          type: Boolean,
          default: false,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    role: {
      type: String,
      enum: ["user", "admin"], // Example roles
      default: "user",
    },
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt
);

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export { User };

