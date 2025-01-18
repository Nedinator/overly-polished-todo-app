import mongoose, { Schema, Document } from "mongoose";

interface ITodo extends Document {
  id: number;
  text: string;
  completed: boolean;
  userId: string;
  createdAt: Date;
  remindAt: Date;
  updatedAt: Date;
  dueAt: Date;
}

const TodoSchema: Schema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
    default: async function () {
      const lastTodo = await mongoose.models.Todo.findOne({
        userId: (this as any).userId,
      }).sort({ id: -1 });
      return lastTodo ? lastTodo.id + 1 : 1;
    },
  },
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
