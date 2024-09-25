/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/upload/route.ts
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { dbConnect } from "@/config/dbConnect";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/AuthOptions";
import { User } from "@/lib/Schemas/UserSchema";
import { Session } from "@/lib/Types";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Handle POST requests
export async function POST(req: Request) {
  try {
    // Get the session with the defined type
    const session = (await getServerSession(authOptions as any)) as Session;

    // Check if session exists
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: fileStr } = await req.json(); // Extract base64 data from the request body
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: "vogue_pass", // Replace with your preset
    });

    if (uploadResponse.secure_url) {
      const userId = session.user.id; // TypeScript recognizes session.user.id
      await dbConnect();

      // Find the user by ID and update the image field
      await User.findByIdAndUpdate(
        userId,
        { image: uploadResponse.secure_url }, // Update the image field
        { new: true } // Return the updated document
      );

      // Optional: log the updated user information
      // console.log("Updated User:", updatedUser);
    }

    return NextResponse.json(
      { url: uploadResponse.secure_url },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
