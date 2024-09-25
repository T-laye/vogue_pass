import { dbConnect, dbDisconnect } from "@/config/dbConnect";
import { User } from "@/lib/Schemas/UserSchema";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await dbConnect();
    // Get the user data from the request body
    const body = await req.json();
    // console.log(body);
    const { name, email, password, phone } = body;

    // Check if all required fields are provided
    if (!name || !email || !password || !phone) {
      return NextResponse.json(
        { error: "Please provide all required fields" },
        { status: 400 }
      );
    }

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already registered" },
        { status: 400 }
      );
    }

    // Hash the password before saving the user
    const hashedPassword = await hash(password, 12);

    // Create the new user in the database
    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashedPassword, // Store the hashed password
    });

    // Return the response with the created user data (excluding the password)
    return NextResponse.json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (err: unknown) {
    // Check if the error is an instance of Error and handle it accordingly
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    } else {
      // Fallback for unknown errors
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 }
      );
    }
  } finally {
    // Ensure disconnection happens after the response or error
    await dbDisconnect();
  }
}
