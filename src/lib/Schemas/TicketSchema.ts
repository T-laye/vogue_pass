import mongoose, { Schema } from "mongoose";
import { ITicket } from "../Types";

// Ticket Schema
const ticketSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Relating Ticket to User
      required: true,
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event", // Relating Ticket to Event
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    typeName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Ticket =
  mongoose.models.Ticket || mongoose.model<ITicket>("Ticket", ticketSchema);

export {  Ticket };
