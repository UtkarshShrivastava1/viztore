import { Variants } from "framer-motion";

export const floatAnimation: Variants = {
  initial: { y: 0 },
  animate: {
    y: [0, -12, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const floatStoreAnimation = (delay: number): Variants => ({
  initial: { y: 0 },
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    },
  },
});

export const pinAnimation: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.08, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const scooterAnimation: Variants = {
  initial: { x: 0 },
  hover: {
    x: 5,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};