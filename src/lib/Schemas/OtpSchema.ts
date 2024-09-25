// src/models/Otp.ts

import mongoose, { Schema } from "mongoose";
import { IOtp } from "../Types";

// Check if the model already exists to avoid OverwriteModelError
const otpSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Ensure one OTP per email at a time
    index: true, // Index for faster lookups
  },
  otp: {
    type: String,
    required: true,
  },
  expires: {
    type: Number,
    required: true,
  },
});

// Optional: TTL index to automatically delete expired OTPs
otpSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });

// Use `mongoose.models` to prevent overwriting the model
const Otp = mongoose.models.Otp || mongoose.model<IOtp>("Otp", otpSchema);
export default Otp;
