"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "Learn Next.js", completed: false },
    { id: 2, text: "Build a to-do app", completed: false },
  ]);

  const [newTodo, setNewTodo] = useState<string>("");

  const handleAddTodo = () => {
    if (newTodo.trim() === "") return;
    setTodos((prevTodos) => [
      ...prevTodos,
      { id: Date.now(), text: newTodo, completed: false },
    ]);
    setNewTodo("");
  };

  const toggleComplete = (id: number) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (newTodo.trim() === "") {
        alert("Please enter a to-do");
      }
      handleAddTodo();
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-gray-800 text-white shadow rounded p-4">
      <h2 className="text-2xl font-bold mb-4">My To-Do List</h2>
      <ul className="list-none space-y-2">
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center gap-2">
            <Checkbox
              checked={todo.completed}
              onCheckedChange={() => toggleComplete(todo.id)}
            />
            <span
              className={`${
                todo.completed ? "line-through text-gray-500" : ""
              }`}
            >
              {todo.text}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <Input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new to-do..."
          className="w-full px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
        />
        <Button
          onClick={handleAddTodo}
          className="mt-2 w-full px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
        >
          Add To-Do
        </Button>
      </div>
    </div>
  );
}
