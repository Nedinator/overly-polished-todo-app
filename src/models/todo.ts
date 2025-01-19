import mongoose, { Schema, Document } from "mongoose";

interface ITodo extends Document {
  text: string;
  completed: boolean;
  userId: string;
  createdAt: Date;
  remindAt: Date;
  updatedAt: Date;
  dueAt: Date;
  orderID: number;
}

const TodoSchema: Schema = new Schema({
  orderID: { type: Number },
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  remindAt: { type: Date },
  updatedAt: { type: Date },
  dueAt: { type: Date },
});

// Pre-save hook to generate 'id' field
TodoSchema.pre("save", async function (next) {
  // Only generate 'id' if the document is new
  if (this.isNew) {
    // Find the last todo for the current user, sorted by 'id'
    const lastTodo = await mongoose.models.Todo.findOne({
      userId: this.userId,
    }).sort({ orderID: -1 });

    // Set the 'orderID' field to the next number in the sequence
    this.orderID = lastTodo ? lastTodo.orderID + 1 : 1;
  }

  next(); // Continue with the save operation
});

const Todo = mongoose.models.Todo || mongoose.model<ITodo>("Todo", TodoSchema);

export default Todo;
