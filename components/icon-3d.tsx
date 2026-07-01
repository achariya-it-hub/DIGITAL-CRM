"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Icon3DProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "h-10 w-10 text-lg",
  md: "h-14 w-14 text-xl",
  lg: "h-20 w-20 text-2xl",
};

const gradients = {
  indigo: "from-indigo-500 to-purple-600",
  pink: "from-pink-500 to-rose-600",
  green: "from-emerald-500 to-teal-600",
  amber: "from-amber-500 to-orange-600",
  blue: "from-blue-500 to-cyan-600",
  red: "from-red-500 to-pink-600",
};

export function Icon3D({ children, className, gradient = "indigo", size = "md" }: Icon3DProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, rotateY: 10 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative flex items-center justify-center rounded-2xl bg-gradient-to-br shadow-xl transition-shadow duration-300",
        gradients[gradient as keyof typeof gradients] || gradients.indigo,
        sizes[size],
        className
      )}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/10 to-transparent" />
      <span className="relative z-10 text-white drop-shadow-sm">{children}</span>
    </motion.div>
  );
}
