"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { text } from "stream/consumers";

// Interface for the Todo type
interface Todo {
  _id: string;
  text: string;
  completed: boolean;
}

export default function TodosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/api/auth/signin");
    }
  }, [session, status, router]);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>("");

  // Fetch todos on mount
  useEffect(() => {
    const fetchTodos = async () => {
      if (!session) return;
      const res = await fetch("/api/todos");
      const data = await res.json();
      setTodos(data);
    };
    fetchTodos();
  }, [session]);

  const handleAddTodo = async () => {
    if (newTodo.trim() === "") return;

    const res = await fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: newTodo }),
      credentials: "include",
    });

    if (!res.ok) {
      alert("Failed to add to-do");
      return;
    }

    const addedTodo = await res.json();
    setTodos((prevTodos) => [...prevTodos, addedTodo]);
    setNewTodo("");
  };

  const toggleComplete = async (id: string) => {
    const todoToToggle = todos.find((todo) => todo._id === id);
    if (!todoToToggle) return;

    const updatedTodo = {
      id,
      text: todoToToggle.text,
      completed: !todoToToggle.completed,
    };

    await fetch(`/api/todos`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTodo),
    });

    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo._id === id ? { ...todo, completed: updatedTodo.completed } : todo
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
    <motion.div
      className="w-full mx-auto bg-transparent text-white shadow-none p-4 mt-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-2xl font-bold mb-4">My To-Do List</h2>
      <ul className="list-none space-y-2">
        {todos.map((todo) => (
          <motion.li
            key={todo._id}
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Checkbox
              checked={todo.completed}
              onCheckedChange={() => toggleComplete(todo._id)}
              className="h-5 w-5 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-2 focus:ring-blue-500"
            />
            <span
              className={`${
                todo.completed ? "line-through text-gray-500" : ""
              }`}
            >
              {todo.text}
            </span>
          </motion.li>
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
    </motion.div>
  );
}
