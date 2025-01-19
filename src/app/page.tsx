"use client";

import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function HomeSplash() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-white">
      <motion.h1
        className="text-5xl font-bold mb-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {session
          ? `Welcome back, ${session.user?.name}!`
          : "Welcome to Todoist"}
      </motion.h1>
      <motion.p
        className="text-xl mb-8 max-w-lg text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        {session
          ? "Explore your tasks and stay productive."
          : "Manage your to-dos with ease. Sign in to get started!"}
      </motion.p>
      {!session ? (
        <Button
          onClick={() => signIn("google")}
          className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-100"
        >
          Sign In with Google
        </Button>
      ) : (
        <div className="flex space-x-4">
          <Button
            onClick={() => (window.location.href = "/todo")}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-100"
          >
            View Todos
          </Button>
          <Button
            onClick={() => (window.location.href = "/settings")}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-100"
          >
            Settings
          </Button>
        </div>
      )}
      {/* Additional Sections */}
      <div className="mt-16 w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            className="bg-white p-6 rounded-lg shadow text-gray-800"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-bold mb-2 text-black">Why Use Us?</h2>
            <p>Stay organized and productive with our intuitive interface.</p>
          </motion.div>
          <motion.div
            className="bg-white p-6 rounded-lg shadow text-gray-800"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="text-xl font-bold mb-2 text-black">Features</h2>
            <p>Track your tasks, set reminders, and much more.</p>
          </motion.div>
          <motion.div
            className="bg-white p-6 rounded-lg shadow text-gray-800"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <h2 className="text-xl font-bold mb-2 text-black">Get Started</h2>
            <p>
              It's as easy as clicking the button above and signing in with
              Google!
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
