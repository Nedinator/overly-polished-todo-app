import { NextApiRequest, NextApiResponse } from "next";
import connectDb from "@/lib/mongo";
import Todo from "@/models/todo";
import { getServerSession } from "next-auth";

// Helper to get the user ID from the session
const getUserId = async (req: NextApiRequest) => {
  const session = await getServerSession(req);

  console.log("Session", session);

  if (!session) {
    throw new Error("Unauthorized");
  }
  return session.user?.email;
};

// Export a named handler for GET requests
export const GET = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDb();

  const userId = await getUserId(req); // Get the user ID from the session

  // Get todos for the current user
  const todos = await Todo.find({ userId });
  return res.status(200).json(todos);
};

// Export a named handler for POST requests
export const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDb();

  const userId = await getUserId(req); // Get the user ID from the session

  // Create a new todo for the current user
  const { text } = req.body;
  const newTodo = new Todo({
    text,
    completed: false,
    userId, // Associate the new todo with the user
  });
  await newTodo.save();
  return res.status(201).json(newTodo);
};
