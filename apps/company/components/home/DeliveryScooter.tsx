import { motion } from "framer-motion";
import { Bike } from "lucide-react";
import { scooterAnimation } from "./animations";

export default function DeliveryScooter() {
  return (
    <motion.div
      variants={scooterAnimation}
      initial="initial"
      whileHover="hover"
      className="absolute bottom-10 right-10 z-40 flex items-center justify-center rounded-full bg-viz-primary/10 p-3 text-viz-primary shadow-lg"
      style={{ transform: "rotate(3deg)" }} // Slight forward tilt
    >
      <Bike size={24} className="text-viz-primary" />
      {/* Simple speed trails - can be enhanced with SVG or more complex CSS */}
      <div className="absolute -right-2 top-1/2 h-1 w-6 -translate-y-1/2 rounded-full bg-gradient-to-r from-viz-accent/0 to-viz-accent/70 blur-sm" />
      <div className="absolute -right-4 top-1/2 h-0.5 w-8 -translate-y-1/2 rounded-full bg-gradient-to-r from-viz-accent/0 to-viz-accent/50 blur-sm" />
    </motion.div>
  );
}