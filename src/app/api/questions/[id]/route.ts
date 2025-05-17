import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/_lib/mongodb";
import Questions from "@/_lib/models/Questions";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const { id } = params;
    console.log("GET request for question ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error("Invalid ObjectId:", id);
      return NextResponse.json({ error: "Invalid question ID" }, { status: 400 });
    }

    const question = await Questions.findById(id).populate("createdBy", "username");
    if (!question) {
      console.error("Question not found for ID:", id);
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    console.log("Returning question:", question);
    return NextResponse.json(question);
  } catch (error) {
    console.error("Error fetching question:", error);
    return NextResponse.json({ error: "Failed to fetch question" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
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

  if (decoded.role !== "admin") {
    return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
  }

  try {
    await dbConnect();
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid question ID" }, { status: 400 });
    }

    const data = await req.json();
    const { text, options, correctAnswer, course } = data;

    if (!text || !options || !correctAnswer || !course) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    if (!Array.isArray(options) || options.length !== 4) {
      return NextResponse.json({ error: "Exactly four options are required" }, { status: 400 });
    }
    if (options.some((opt: string) => opt.trim() === "")) {
      return NextResponse.json({ error: "All options must be non-empty" }, { status: 400 });
    }
    if (!options.includes(correctAnswer)) {
      return NextResponse.json({ error: "Correct answer must be one of the options" }, { status: 400 });
    }

    const question = await Questions.findByIdAndUpdate(
      id,
      { text, options, correctAnswer, course },
      { new: true }
    );
    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Question updated successfully", question });
  } catch (error) {
    console.error("Error updating question:", error);
    return NextResponse.json({ error: "Failed to update question" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
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

  if (decoded.role !== "admin") {
    return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
  }

  try {
    await dbConnect();
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid question ID" }, { status: 400 });
    }

    const question = await Questions.findByIdAndDelete(id);
    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Question deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting question:", error);
    return NextResponse.json({ error: "Failed to delete question" }, { status: 500 });
  }
}