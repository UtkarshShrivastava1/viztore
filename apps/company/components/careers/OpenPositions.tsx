"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Briefcase,
  Mail,
  Copy,
  Check,
  Send,
} from "lucide-react";
import { branding } from "@repo/shared-types/branding.config";

interface JobPosition {
  id: string;
  title: string;
  department: string;
  departmentColor: string;
  location: string;
  type: string;
  description: string;
  subject: string;
  email: string;
}

const positions: JobPosition[] = [
  {
    id: "frontend-dev",
    title: "Frontend Developer (Next.js)",
    department: "Engineering",
    departmentColor: "bg-blue-50 text-blue-700 border-blue-200",
    location: "Bhilai / Remote",
    type: "Full-time",
    description:
      "Build and improve the customer and retailer experience using Next.js, React and modern web technologies.",
    subject: "Frontend Developer Application",
    email: branding.supportEmail,
  },
  {
    id: "bde",
    title: "Business Development Executive",
    department: "Sales",
    departmentColor: "bg-sky-50 text-sky-700 border-sky-200",
    location: "Bhilai / Durg / Raipur",
    type: "Full-time",
    description:
      `Onboard new retailers, build partnerships and drive adoption of ${branding.appName} in local markets.`,
    subject: "BDE Application",
    email: branding.supportEmail,
  },
  {
    id: "product-design-intern",
    title: "Product Design Intern",
    department: "Design",
    departmentColor: "bg-purple-50 text-purple-700 border-purple-200",
    location: "Remote / Bhilai",
    type: "Internship",
    description:
      "Work on UI/UX for web and mobile, create design assets and improve the overall product experience.",
    subject: "Product Design Intern Application",
    email: branding.supportEmail,
  },
  {
    id: "marketing-intern",
    title: "Marketing Intern",
    department: "Marketing",
    departmentColor: "bg-amber-50 text-amber-700 border-amber-200",
    location: "Remote / Bhilai",
    type: "Internship",
    description:
      "Support content, social media, market research and retailer outreach initiatives.",
    subject: "Marketing Intern Application",
    email: branding.supportEmail,
  },
];

const categories = ["All", "Engineering", "Sales", "Design", "Marketing"];

export default function OpenPositions() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredPositions =
    selectedCategory === "All"
      ? positions
      : positions.filter((job) => job.department === selectedCategory);

  const handleCopy = (job: JobPosition, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const textToCopy = `To: ${job.email}\nSubject: ${job.subject}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(job.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <section id="open-positions" className="bg-white py-16 lg:py-5 ">
      <div className="container-viz">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-10 border-b border-slate-100">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Open Positions
            </h2>
            <p className="mt-2 text-base text-slate-500 sm:text-lg">
              Explore current opportunities and be a part of {branding.appName}.
            </p>
          </div>

          {/* Department Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30 font-semibold"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Position Cards List */}
        <div className="mt-8 space-y-4 sm:space-y-5">
          {filteredPositions.map((job, index) => {
            const mailtoUrl = `mailto:${job.email}?subject=${encodeURIComponent(
              job.subject
            )}&body=${encodeURIComponent(
              `Hi ${branding.appName} Hiring Team,\n\nI am excited to apply for the ${job.title} position at ${branding.appName}.\n\nPlease find my resume attached. I have also shared my details below:\n\nName:\nPhone:\nPortfolio / LinkedIn:\nWhy I'd love to join ${branding.appName}:\n\nLooking forward to hearing from you!\n\nBest regards,\n`
            )}`;

            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                className="group relative rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm transition-all duration-200 hover:border-blue-200 hover:shadow-md"
              >
                <div className="grid grid-cols-1 items-center gap-5 lg:grid-cols-12 lg:gap-6">
                  {/* Left Column: Job Title & Tags */}
                  <div className="lg:col-span-4 xl:col-span-4">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {job.title}
                    </h3>
                    <div className="mt-3 flex flex-wrap items-center gap-2.5 text-xs">
                      {/* Department pill */}
                      <span
                        className={`rounded-lg border px-2.5 py-1 font-semibold ${job.departmentColor}`}
                      >
                        {job.department}
                      </span>

                      {/* Location */}
                      <span className="inline-flex items-center gap-1 text-slate-500 font-medium">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        {job.location}
                      </span>

                      {/* Type */}
                      <span className="inline-flex items-center gap-1 text-slate-500 font-medium">
                        <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                        {job.type}
                      </span>
                    </div>
                  </div>

                  {/* Middle Column: Description */}
                  <div className="lg:col-span-4 xl:col-span-4">
                    <p className="text-sm leading-relaxed text-slate-600 font-normal">
                      {job.description}
                    </p>
                  </div>

                  {/* Right Column: Apply via Email Card */}
                  <div className="lg:col-span-4 xl:col-span-4 flex items-center justify-start lg:justify-end">
                    <div className="relative w-full sm:w-auto">
                      <a
                        href={mailtoUrl}
                        className="flex w-full sm:w-auto items-center gap-3.5 rounded-xl border border-blue-100 bg-blue-50/70 p-3 sm:px-4 sm:py-3 transition-all duration-200 hover:bg-blue-100/80 hover:border-blue-200 group/btn"
                      >
                        {/* Mail Icon Square */}
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm shadow-blue-600/30 transition-transform duration-200 group-hover/btn:scale-105">
                          <Mail className="h-5 w-5" />
                        </div>

                        {/* Email Text Instructions */}
                        <div className="text-left min-w-0 pr-1">
                          <div className="flex items-center gap-1 text-xs font-bold text-slate-900 group-hover/btn:text-blue-700">
                            <span>Apply via Email</span>
                            <Send className="h-3 w-3 text-blue-500 opacity-70 group-hover/btn:translate-x-0.5 transition-transform" />
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            Send your resume to{" "}
                            <span className="font-semibold text-blue-600">
                              {job.email}
                            </span>
                          </div>
                          <div className="text-[11px] font-medium text-slate-700 truncate mt-0.5">
                            Subject: {job.subject}
                          </div>
                        </div>

                        {/* Quick Copy Button */}
                        <button
                          type="button"
                          onClick={(e) => handleCopy(job, e)}
                          title="Copy email and subject"
                          aria-label="Copy email and subject"
                          className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-blue-200/60 bg-white text-slate-500 hover:text-blue-600 hover:border-blue-300 transition-colors"
                        >
                          {copiedId === job.id ? (
                            <Check className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </a>

                      {/* Toast notification when copied */}
                      {copiedId === job.id && (
                        <div className="absolute -top-8 right-0 rounded-md bg-slate-900 px-2.5 py-1 text-[11px] font-medium text-white shadow-md animate-fade-in">
                          Copied email & subject!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty state if filtered category has no jobs */}
        {filteredPositions.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-200 p-12 text-center">
            <p className="text-sm text-slate-500">
              No positions currently open in this category. Check back soon or
              send an open application below!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
