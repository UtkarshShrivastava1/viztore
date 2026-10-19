"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { branding } from "@repo/shared-types/branding.config";

export default function Hero() {
  return (
    <section
      id="home"
      className="
        relative
        overflow-hidden
        bg-gradient-to-br
        from-[#020A2A]
        via-[#061755]
        to-[#0A225F]    
       pt-20
        lg:pt-0
        sm:pt-70
  
      "
    >
      <div className="relative grid grid-cols-1 items-center gap-16 lg:grid-cols-1">
        {/* Right column - phone/desktop mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full h-full min-h-[440px] lg:min-h-[640px] rounded-lg"
        >
          {/* Mobile image: shown below lg */}
          <Image
            src="/images/mobile-image.png"
            alt={`${branding.appName} Dashboard`}
            fill
            priority
            className="block object-contain object-center rounded-md lg:hidden"
          />

          {/* Desktop image: shown at lg and up */}
          <Image
            src="/images/w_desktop_image.png"
            alt={`${branding.appName} Dashboard`}
            width={1600}
            height={900} 
            priority
            className="hidden object-cover object-top rounded-md lg:block"
          />
        </motion.div>
      </div>
    </section>
  );
}