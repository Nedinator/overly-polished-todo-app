"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const SettingsPage: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  if (!session) {
    router.push("/api/auth/signin");
  }
  const handleDeleteUserData = async () => {
    try {
      const response = await fetch("/api/settings", {
        method: "DELETE",
      });

      if (response.ok) {
        alert("User data deleted successfully.");
        router.push("");
      } else {
        alert("Lol ima sell ur data now.");
      }
    } catch (error) {
      console.error("Error deleting user data:", error);
      alert("An error occurred while deleting user data.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl mb-4">Settings</h1>
        <Button onClick={handleDeleteUserData} className="mx-auto">
          Delete User Data
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
