import mongoose, { Schema, Document } from "mongoose";

interface ITodo extends Document {
  text: string;
  completed: boolean;
  userId: string;
}

const TodoSchema: Schema = new Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  userId: { type: String, required: true }, // Store user ID from NextAuth
});

const Todo = mongoose.models.Todo || mongoose.model<ITodo>("Todo", TodoSchema);

export default Todo;
