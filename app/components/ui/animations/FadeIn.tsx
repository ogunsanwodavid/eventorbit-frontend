"use client";

import { ReactNode } from "react";

import { motion } from "framer-motion";

interface FadeInProps {
  children: ReactNode;
  duration?: number;
  delay?: number;
  y?: number; // vertical movement on fade in
}

export default function FadeIn({
  children,
  duration = 0.6,
  delay = 0.2,
  y = 20,
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
