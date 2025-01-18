import mongoose, { Schema, Document } from "mongoose";

interface ITodo extends Document {
  text: string;
  completed: boolean;
  userId: string;
  createdAt: Date;
  remindAt: Date;
  updatedAt: Date;
  dueAt: Date;
}

const TodoSchema: Schema = new Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  remindAt: { type: Date },
  updatedAt: { type: Date },
  dueAt: { type: Date },
});

const Todo = mongoose.models.Todo || mongoose.model<ITodo>("Todo", TodoSchema);

export default Todo;
