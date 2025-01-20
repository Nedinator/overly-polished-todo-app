"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { cn } from "@/lib/utils"; // ShadCN helper for conditional classes
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export type Todo = {
  _id: string;
  text: string;
  completed: boolean;
  dueAt: string;
};

export default function CalendarView() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);

  // Handle session authentication
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [status, router]);

  // Fetch todos once the session is authenticated
  useEffect(() => {
    if (status === "authenticated") {
      const fetchTodos = async () => {
        try {
          const res = await fetch("/api/todos");
          if (!res.ok) {
            throw new Error("Failed to fetch todos");
          }
          const data: Todo[] = await res.json();
          setTodos(data);
        } catch (error) {
          console.error("Error fetching todos:", error);
        }
      };

      fetchTodos();
    }
  }, [status]);

  // Map todos to FullCalendar event format
  const events = todos.map((todo) => ({
    id: todo._id,
    title: todo.text,
    start: todo.dueAt,
    allDay: true,
    backgroundColor: todo.completed ? "green" : "red",
    borderColor: todo.completed ? "darkgreen" : "darkred",
  }));

  // Filter todos based on the selected date
  useEffect(() => {
    if (selectedDate) {
      const filtered = todos.filter(
        (todo) =>
          new Date(todo.dueAt).toDateString() ===
          new Date(selectedDate).toDateString()
      );
      setFilteredTodos(filtered);
    } else {
      setFilteredTodos([]);
    }
  }, [selectedDate, todos]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <motion.div
      className={cn(
        "flex flex-col md:flex-row p-4 h-screen w-full bg-transparent text-foreground"
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Calendar Section */}
      <div className="md:w-2/3 w-full p-4 bg-transparent">
        <h1 className="text-3xl font-bold mb-6">Todos Calendar</h1>
        <FullCalendar
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
            listPlugin,
          ]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
          }}
          events={events}
          dateClick={(info) => setSelectedDate(info.dateStr)}
          editable
          selectable
          eventContent={(eventInfo) => (
            <div>
              <b>{eventInfo.timeText}</b>
              <span>{eventInfo.event.title}</span>
            </div>
          )}
        />
      </div>

      {/* Todos Details Section */}
      <div className="md:w-1/3 w-full p-4 bg-transparent border-l border-muted-foreground md:overflow-auto h-full">
        <h2 className="text-2xl font-semibold mb-4">
          Todos for {selectedDate || "..."}
        </h2>
        {filteredTodos.length > 0 ? (
          <ul className="space-y-4">
            {filteredTodos.map((todo) => (
              <li
                key={todo._id}
                className={cn(
                  "p-4 border rounded-lg",
                  todo.completed ? "border-green-500" : "border-red-500"
                )}
              >
                <h3 className="text-lg font-medium">{todo.text}</h3>
                <p className="text-sm">
                  Due Date: {new Date(todo.dueAt).toLocaleDateString()}
                </p>
                <p
                  className={cn(
                    "font-semibold",
                    todo.completed ? "text-green-500" : "text-red-500"
                  )}
                >
                  {todo.completed ? "Completed" : "Pending"}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            No todos for the selected date.
          </p>
        )}
      </div>
    </motion.div>
  );
}
