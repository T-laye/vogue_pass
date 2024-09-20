import { dbConnect, dbDisconnect } from "@/config/dbConnect";
import { User } from "@/lib/Schemas/UserSchema";

import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  try {
    const user = await User.find({});

    // Return the response with the product data
    return NextResponse.json(user);
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
