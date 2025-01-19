import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/mongo";
import Todo from "@/models/todo";
import { getUserId } from "../todos/route";

export const DELETE = async (req: NextRequest): Promise<NextResponse> => {
  try {
    await connectDb();
    const userId = await getUserId(req);
    await Todo.deleteMany({ userId });
    return NextResponse.json({ message: "Account deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    } else {
      return NextResponse.json({ error: "Unknown error" }, { status: 401 });
    }
  }
};
