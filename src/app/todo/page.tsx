"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  useSortable,
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Interface for the Todo type
interface Todo {
  _id: string;
  text: string;
  completed: boolean;
}

interface SortableItemProps {
  id: string;
  todo: Todo;
  toggleComplete: (id: string) => void;
  handleDelete: (id: string) => void;
}

function SortableItem({
  id,
  todo,
  toggleComplete,
  handleDelete,
}: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative flex items-center justify-between gap-4 group p-3 rounded-lg hover:bg-gray-800 transition-colors duration-300"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div className="flex items-center gap-2 flex-1">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => toggleComplete(todo._id)}
          className="h-5 w-5 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-2 focus:ring-blue-500"
          data-no-dnd="true" // Prevents the checkbox from triggering drag events
        />
        <span
          className={`${todo.completed ? "line-through text-gray-500" : ""}`}
        >
          {todo.text}
        </span>
      </motion.div>
      <motion.button
        onClick={() => handleDelete(todo._id)}
        className="flex items-center justify-center w-8 h-8 rounded-full border border-red-500 text-red-500 opacity-0 group-hover:opacity-100 group-hover:bg-transparent hover:bg-red-500 hover:text-white transition-colors duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          className="w-5 h-5"
        >
          <path d="M9 3h6a1 1 0 011 1v1h4a1 1 0 110 2H4a1 1 0 010-2h4V4a1 1 0 011-1zm-3 5h12l-1 13a2 2 0 01-2 2H9a2 2 0 01-2-2L6 8z" />
        </svg>
      </motion.button>
    </motion.li>
  );
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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10, // Adjust the distance as needed
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
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

  const handleDelete = async (id: string) => {
    await fetch(`/api/todos`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, session }),
    });

    setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!active || !over) return;

    if (active.id !== over.id) {
      setTodos((prevTodos) => {
        const oldIndex = prevTodos.findIndex((todo) => todo._id === active.id);
        const newIndex = prevTodos.findIndex((todo) => todo._id === over.id);

        return arrayMove(prevTodos, oldIndex, newIndex);
      });
    }
  }

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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={todos.map((todo) => todo._id)}
            strategy={verticalListSortingStrategy}
          >
            {todos.map((todo) => (
              <SortableItem
                key={todo._id}
                id={todo._id}
                todo={todo}
                toggleComplete={toggleComplete}
                handleDelete={handleDelete}
              />
            ))}
          </SortableContext>
        </DndContext>
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
