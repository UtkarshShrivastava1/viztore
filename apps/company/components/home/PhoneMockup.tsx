import Image from "next/image";
import { motion } from "framer-motion";
import { floatAnimation } from "./animations";
import { branding } from "@repo/shared-types/branding.config";

export default function PhoneMockup() {
  return (
    <motion.div
      variants={floatAnimation}
      initial="initial"
      animate="animate"
      whileHover={{ y: -16, rotateX: 5, rotateY: 5 }} // Hover lift and slight rotation
      className="absolute left-1/2 top-1/2 z-30 h-[96%] w-[96%] -translate-x-1/2 -translate-y-1/2 skew-x-3" // Acute angle from original
      style={{
        transformStyle: "preserve-3d", // Enable 3D transforms for children
        transform: "translate(-50%, -50%) skewX(3deg) rotateX(5deg) rotateY(-5deg)", // Initial 3D rotation
        boxShadow: "0 40px 80px rgba(0,0,0,.45)", // Large drop shadow
      }}
    >
      <Image
        src="/images/desktopImage.png" // Using desktop image for the main phone
        alt={`${branding.appName} platform overview`}
        fill
        priority
        className="object-contain"
        style={{ filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.2))" }} // Additional shadow for depth
      />
      {/* Glass reflection can be added with an overlay div or more complex CSS */}
      <div className="absolute inset-0 rounded-3xl bg-white/10 backdrop-blur-sm" />
    </motion.div>
  );
}