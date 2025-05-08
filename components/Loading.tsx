"use client";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="flex flex-col items-center"
      >
        <motion.div
          animate={{
            rotate: 360,
            transition: { repeat: Infinity, duration: 1, ease: "linear" },
          }}
          className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full"
        />
        <span className="text-white text-lg font-semibold mt-4 animate-pulse">
          Cargando...
        </span>
      </motion.div>
    </div>
  );
}
