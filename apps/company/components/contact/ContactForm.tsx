"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  ListFilter,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  const handleReset = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
    setSubmitted(false);
  };

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-9 shadow-sm transition-all hover:shadow-md">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Send us a message
        </h2>
        <p className="mt-1.5 text-sm text-slate-500">
          Fill in the details below and our team will get back to you soon.
        </p>
      </div>

      {submitted ? (
        <div className="mt-8 rounded-2xl bg-emerald-50/80 border border-emerald-200 p-8 text-center animate-fade-in">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Thank you, {formData.fullName || "friend"}!
          </h3>
          <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Your message has been received. Our team will review your enquiry
            and get back to you at{" "}
            <span className="font-semibold text-slate-900">
              {formData.email}
            </span>{" "}
            within 24 business hours.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white transition-all hover:bg-slate-800"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Row 1: Name and Email */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Full name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Email address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Phone Number */}
          <div>
            <label
              htmlFor="phone"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Phone number <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex rounded-xl border border-slate-200 bg-white transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10">
              <div className="flex items-center gap-1.5 pl-3.5 pr-2.5 text-slate-500 border-r border-slate-100 text-xs font-semibold select-none">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                <span>+91</span>
              </div>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter mobile number"
                className="w-full rounded-r-xl bg-transparent py-2.5 pl-3 pr-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none"
              />
            </div>
          </div>

          {/* Row 3: Subject Dropdown */}
          <div>
            <label
              htmlFor="subject"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Subject <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <ListFilter className="h-4 w-4" />
              </div>
              <select
                id="subject"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              >
                <option value="" disabled>
                  Select your enquiry
                </option>
                <option value="Retailer Onboarding">
                  Retailer Onboarding &amp; Store Setup
                </option>
                <option value="Customer Support">
                  Customer Support &amp; Orders
                </option>
                <option value="Platform Demo">
                  Platform Demo &amp; Product Tour
                </option>
                <option value="Partnership & Suppliers">
                  Partnership &amp; Supplier Network
                </option>
                <option value="General Support">General Support &amp; Feedback</option>
              </select>
              {/* Custom Dropdown Arrow */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M6 8l4 4 4-4"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Row 4: Message */}
          <div>
            <label
              htmlFor="message"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Message <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute top-3 left-3.5 text-slate-400">
                <MessageSquare className="h-4 w-4" />
              </div>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                value={formData.message}
                onChange={handleChange}
                placeholder="How can we help you?"
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 active:scale-[0.99] disabled:opacity-75 disabled:pointer-events-none"
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <span>Send Message</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
