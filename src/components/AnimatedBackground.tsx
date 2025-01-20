"use client";

import { motion } from "framer-motion";

export default function AnimatedBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className="absolute inset-0 w-full h-full z-[-1]"
      initial={{ backgroundPosition: "0% 50%" }}
      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        backgroundImage: "linear-gradient(90deg, #1e3a8a, #9333ea, #2563eb)",
        backgroundSize: "300% 300%",
      }}
    >
      {children}
    </motion.div>
  );
}
