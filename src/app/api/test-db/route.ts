// app/api/test-db/route.ts
import dbConnect from "@/_lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json({ status: true, message: "MongoDB connected" });
  } catch (error) {
    return NextResponse.json(
      { status: false, message: "Connection failed", error: String(error) },
      { status: 500 }
    );
  }
}