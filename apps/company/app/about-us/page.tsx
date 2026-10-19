import type { Metadata } from "next";
import { branding } from "@repo/shared-types/branding.config";
import AboutUsContent from "./PageContent";

export const metadata: Metadata = {
  title: `About Us — ${branding.appName}`,
  description:
    `${branding.appName} is building the future of local retail — a connected retail commerce platform that helps retailers digitize their businesses and creates a better shopping experience for customers.`,
};

export default function AboutUsPage() {
  return <AboutUsContent />;
}
