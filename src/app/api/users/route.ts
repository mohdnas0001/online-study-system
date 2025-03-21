// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/_lib/mongodb";
import User from "@/_lib/models/User";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  // Extract the Authorization header
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("No token provided in Authorization header");
    return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  let decoded: { id: string; username: string; role?: string };

  try {
    // Verify the JWT token
    decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      username: string;
      role?: string;
    };
    console.log("Decoded token:", decoded);

    // Restrict access to admins only
    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }
  } catch (error) {
    console.error("Token verification failed:", error);
    return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
  }

  try {
    // Connect to the database
    await dbConnect();

    // Fetch all users, selecting only username and role fields
    const users = await User.find({}, "username role").lean();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}