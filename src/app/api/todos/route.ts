import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/mongo";
import Todo from "@/models/todo";
import { getServerSession } from "next-auth";

// Helper to get the user ID from the session
const getUserId = async (req: NextRequest) => {
  const session = await getServerSession(req); // Use the correct session method for App Router

  console.log("Session", session);

  if (!session) {
    throw new Error("Unauthorized");
  }
  return session.user?.email;
};

// Export a named handler for GET requests
export const GET = async (req: NextRequest) => {
  try {
    await connectDb();

    const userId = await getUserId(req); // Get the user ID from the session

    // Get todos for the current user
    const todos = await Todo.find({ userId });
    return NextResponse.json(todos, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
};

// Export a named handler for POST requests
export const POST = async (req: NextRequest) => {
  try {
    await connectDb();

    const userId = await getUserId(req); // Get the user ID from the session

    const body = await req.json(); // Parse the request body
    const { text } = body;

    // Create a new todo for the current user
    const newTodo = new Todo({
      text,
      completed: false,
      userId, // Associate the new todo with the user
    });
    await newTodo.save();
    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    await connectDb();

    const userId = await getUserId(req); // Get the user ID from the session

    const body = await req.json(); // Parse the request body
    const { id, text, completed } = body;

    // Update the todo for the current user
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: id, userId },
      { text, completed },
      { new: true }
    );
    return NextResponse.json(updatedTodo, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
};
