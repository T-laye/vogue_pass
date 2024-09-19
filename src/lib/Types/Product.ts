import { Document } from "mongoose";

export interface IProduct extends Document {
  _id: string;
  name: string;
  price: number;
  description: string;
}
