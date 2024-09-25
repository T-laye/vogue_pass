// src/app/api/auth/sendOtp/route.ts

import { NextRequest, NextResponse } from "next/server";
import { mailOptions, transporter } from "@/config/nodemailer";
import { dbConnect, dbDisconnect } from "@/config/dbConnect";
import Otp from "@/lib/Schemas/OtpSchema";

const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
};

export const POST = async (req: NextRequest) => {
  await dbConnect(); // Ensure database connection

  const data = await req.json();

  if (!data.email) {
    return NextResponse.json({ message: "Bad Request" }, { status: 400 });
  }

  const otp = generateOtp();
  const expires = Date.now() + 300000; // OTP expires in 5 minutes

  // Store the OTP in MongoDB
  await Otp.findOneAndUpdate(
    { email: data.email },
    { otp, expires },
    { upsert: true } // Insert if not exists
  );

  try {
    await transporter.sendMail({
      ...mailOptions,
      to: data.email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}. It will expire in 5 minutes.`,
      html: `<h1>Your OTP Code</h1> <p>Your OTP code is: <strong>${otp}</strong>. It will expire in 5 minutes.</p>`,
    });

    return NextResponse.json(
      { message: "OTP sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 400 }
    );
  } finally {
    await dbDisconnect();
  }
};
