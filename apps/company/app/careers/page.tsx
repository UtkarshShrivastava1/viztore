import type { Metadata } from "next";
import { branding } from "@repo/shared-types/branding.config";
import CareersPageContent from "./CareersPageContent";

export const metadata: Metadata = {
  title: `Careers — Build the Future of Local Commerce | ${branding.appName}`,
  description:
    `Join the team at ${branding.appName}. We are helping local retailers go digital and making local shopping visible, accessible, and connected across India. Explore engineering, sales, design, and marketing opportunities.`,
  keywords: [
    `${branding.appName} careers`,
    `jobs at ${branding.appName}`,
    "frontend developer jobs Bhilai",
    "retail tech careers India",
    "startup jobs Bhilai",
    "product design intern",
    "business development executive",
  ],
  openGraph: {
    title: `Careers at ${branding.appName} — Build the Future of Local Commerce`,
    description:
      "Join a team that's helping local retailers go digital and making shopping in every city more visible, accessible and connected.",
    url: `https://${branding.domain}/careers`,
    siteName: branding.appName,
    type: "website",
  },
};

export default function CareersPage() {
  return <CareersPageContent />;
}
