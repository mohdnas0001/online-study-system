// app/api/seed/route.ts
import { NextResponse } from "next/server";
import User from "@/_lib/models/User";
import dbConnect from "@/_lib/mongodb";

export async function POST() {
  try {
    await dbConnect();
    await User.deleteMany({}); 
    await User.insertMany([
      { username: "admin", password: "password123", role: "admin" },
      { username: "student1", password: "password123", role: "student" },
    ]);
    return NextResponse.json({ status: true, message: "Users seeded successfully" });
  } catch (error) {
    return NextResponse.json(
      { status: false, message: "Seeding failed", error: String(error) },
      { status: 500 }
    );
  }
}