import React from 'react';
import { ArrowRight } from 'lucide-react';

export interface WorkflowStep {
  number: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color?: string;
  previewMockup?: React.ReactNode;
}

interface StepWorkflowProps {
  steps: WorkflowStep[];
  title?: string;
  subtitle?: string;
}

export const StepWorkflow: React.FC<StepWorkflowProps> = ({ steps, title, subtitle }) => {
  return (
    <div className="w-full">
      {(title || subtitle) && (
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          {title && (
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {title}
            </h2>
          )}
          {subtitle && <p className="text-sm sm:text-base text-slate-500 mt-2">{subtitle}</p>}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isLast = idx === steps.length - 1;

          return (
            <div key={idx} className="relative flex flex-col items-center text-center group">
              {/* Step Number & Icon Header */}
              <div className="relative mb-5 flex flex-col items-center">
                {/* Number Badge */}
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                  {step.number}
                </span>

                {/* Circle Icon */}
                <div className="w-14 h-14 rounded-2xl bg-blue-50/80 border border-blue-100 flex items-center justify-center text-[#0038ed] shadow-2xs group-hover:scale-105 group-hover:bg-[#0038ed] group-hover:text-white transition-all duration-300">
                  <Icon className="w-6 h-6 stroke-[1.8]" />
                </div>
              </div>

              {/* Connecting arrow for larger screens */}
              {!isLast && (
                <div className="hidden lg:flex items-center justify-center absolute top-10 left-[62%] w-[76%] z-0 text-slate-300 pointer-events-none">
                  <div className="w-full border-t-2 border-dashed border-slate-200" />
                  <ArrowRight className="w-4 h-4 -ml-2 text-slate-300 shrink-0" />
                </div>
              )}

              {/* Content */}
              <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-2 leading-tight">
                {step.title}
              </h3>
              <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed max-w-[220px]">
                {step.description}
              </p>

              {/* Optional preview mockup */}
              {step.previewMockup && (
                <div className="mt-4 w-full">{step.previewMockup}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
