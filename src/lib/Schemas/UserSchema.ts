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
      // Only required if the user did not sign up with Google
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      required: function (this: any) {
        return !this.google;
      },
    },
    google: {
      type: Boolean,
      required: true,
      default: false,
    },
    phone: {
      type: String,
    },
    image: {
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

// Prevent model overwrite in development environments
const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export { User };
