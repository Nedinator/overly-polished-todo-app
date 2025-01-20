import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/mongo";
import Todo from "@/models/todo";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { Session } from "@/types/Session";
import mongoose from "mongoose";

// Helper to get the user ID from the session
export const getUserId = async (req: NextRequest): Promise<string> => {
  const session: Session | null = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    throw new Error("Unauthorized");
  }

  return session.user?.email;
};

// Export a named handler for GET requests
export const GET = async (req: NextRequest): Promise<NextResponse> => {
  try {
    await connectDb();

    const userId = await getUserId(req); // Get the user ID from the session

    // Get todos for the current user
    const todos = await Todo.find({ userId });
    return NextResponse.json(todos, { status: 200 });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    } else {
      return NextResponse.json({ error: "Unknown error" }, { status: 401 });
    }
  }
};

// Export a named handler for POST requests
export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    await connectDb();

    const userId = await getUserId(req); // Get the user ID from the session

    const body = await req.json(); // Parse the request body
    const { text, dueAt } = body;

    // Create a new todo for the current user
    const newTodo = new Todo({
      text,
      completed: false,
      dueAt,
      userId, // Associate the new todo with the user
    });
    await newTodo.save();
    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    } else {
      return NextResponse.json({ error: "Unknown error" }, { status: 401 });
    }
  }
};

export const PUT = async (req: NextRequest): Promise<NextResponse> => {
  try {
    await connectDb();

    const userId = await getUserId(req); // Get the user ID from the session

    const body = await req.json(); // Parse the request body
    const { id, text, completed } = body;

    // Ensure the id is a valid MongoDB ObjectId
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID");
    }

    // Update the todo for the current user
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: id, userId },
      { text, completed },
      { new: true }
    );
    return NextResponse.json(updatedTodo, { status: 200 });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    } else {
      return NextResponse.json({ error: "Unknown error" }, { status: 401 });
    }
  }
};

export const DELETE = async (req: NextRequest): Promise<NextResponse> => {
  try {
    await connectDb();

    const userId = await getUserId(req); // Get the user ID from the session

    const body = await req.json(); // Parse the request body
    const { id } = body;

    // Ensure the id is a valid MongoDB ObjectId
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID");
    }

    // Delete the todo for the current user
    await Todo.deleteOne({ _id: id, userId });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    } else {
      return NextResponse.json({ error: "Unknown error" }, { status: 401 });
    }
  }
};
