import { motion } from "framer-motion";
import { MapPin, Store } from "lucide-react";
import { floatStoreAnimation, pinAnimation } from "./animations";

interface FloatingStoreProps {
  positionClasses: string;
  scale: number;
  opacity: number;
blur?: string;
  delay: number;
}

export default function FloatingStore({
  positionClasses,
  scale,
  opacity,
  blur = "",
  delay,
}: FloatingStoreProps) {
  return (
    <motion.div
      variants={floatStoreAnimation(delay)}
      initial="initial"
      animate="animate"
      className={`absolute z-20 flex flex-col items-center rounded-xl bg-white p-3 shadow-lg ${positionClasses} ${blur}`}
      style={{ scale, opacity }}
    >
      {/* Blue roof */}
      <div className="h-3 w-full rounded-t-lg bg-blue-600" />
      {/* Storefront */}
      <div className="flex h-10 w-full items-center justify-center rounded-b-lg bg-white text-viz-primary">
        <Store size={20} />
      </div>
      {/* Yellow Pin */}
      <motion.div variants={pinAnimation} initial="initial" animate="animate" className="absolute -top-2 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-viz-accent text-viz-navy shadow-md">
        <MapPin size={14} />
      </motion.div>
      {/* Glow underneath (simple shadow for now) */}
      <div className="absolute inset-x-0 bottom-0 h-4 bg-viz-accent/20 blur-md" />
    </motion.div>
  );
}