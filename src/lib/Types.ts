import { Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  profilePicture: string;
  events: [];
  tickets: [];
  notifications: [];
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEvent extends Document {
  _id: string;
  name: string;
  userId: string;
  address: string;
  image: string;
  status: string;
  tickets: [];
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITicket extends Document {
  _id: string;
  name: string;
  userId: string;
  eventId: string;
  image: string;
  type: string;
  typeName: string;
  createdAt: Date;
  updatedAt: Date;
}
