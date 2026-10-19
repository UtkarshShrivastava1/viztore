"use client";

import { motion } from "framer-motion";
import { Users2, Lightbulb, BarChart2, Heart } from "lucide-react";

interface ValueItem {
  icon: typeof Users2;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
}

const valuesList: ValueItem[] = [
  {
    icon: Users2,
    title: "Meaningful Impact",
    description: "Work on a product that empowers local businesses across India.",
    iconBg: "bg-blue-100/80",
    iconColor: "text-blue-600",
  },
  {
    icon: Lightbulb,
    title: "Learn & Grow",
    description: "Work with modern tech, solve real problems and grow your career.",
    iconBg: "bg-amber-100/80",
    iconColor: "text-amber-600",
  },
  {
    icon: BarChart2,
    title: "Collaborative Team",
    description: "Small, focused team with high ownership and faster learning.",
    iconBg: "bg-blue-100/80",
    iconColor: "text-blue-600",
  },
  {
    icon: Heart,
    title: "Flexible Work",
    description: "Supportive environment with flexibility and work-life balance.",
    iconBg: "bg-amber-100/80",
    iconColor: "text-amber-600",
  },
];

export default function CareersValues() {
  return (
    <section className="bg-slate-50/80 py-10 lg:py-9 border-b border-slate-200/60">
      <div className="container-viz">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {valuesList.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="group flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${item.iconBg} ${item.iconColor} transition-transform duration-200 group-hover:scale-105`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm leading-relaxed text-slate-500">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
