import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/_lib/mongodb";
import Questions from "@/_lib/models/Questions";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("No token provided in Authorization header");
    return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  let decoded: { id: string; username: string; role?: string };

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      username: string;
      role?: string;
    };
    console.log("Decoded token:", decoded);
  } catch (error) {
    console.error("Token verification failed:", error);
    return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
  }

  try {
    await dbConnect();
    const data = await req.json();
    if (!data.course) {
      return NextResponse.json({ error: "Course is required" }, { status: 400 });
    }
    const question = await Questions.create({
      ...data,
      createdBy: decoded.id,
    });
    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json({ error: "Failed to create question" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const course = searchParams.get("course");

    if (course) {
      // Fetch 20 random questions for the specified course
      const questions = await Questions.aggregate([
        { $match: { course } },
        { $sample: { size: 20 } }, // Randomly select 20
      ]).exec();
      return NextResponse.json(questions);
    }

    // If no course specified, return all questions
    const questions = await Questions.find().populate("createdBy", "username");
    return NextResponse.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
  }
}