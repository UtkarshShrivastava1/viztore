import type { Metadata } from "next";
import { branding } from "@repo/shared-types/branding.config";
import TermsPageContent from "./TermsPageContent";

export const metadata: Metadata = {
  title: `Terms & Conditions — ${branding.appName}`,
  description:
    `The terms that guide your use of ${branding.appName}. Learn about customer terms, retailer terms, ordering, payments, and platform policies.`,
  keywords: [
    `${branding.appName} terms and conditions`,
    `${branding.appName} legal`,
    "retailer terms",
    "customer terms",
    "user agreement",
  ],
  openGraph: {
    title: `Terms & Conditions — ${branding.appName}`,
    description:
      `The terms that guide your use of ${branding.appName}. Learn about customer terms, retailer terms, ordering, payments, and platform policies.`,
    url: `https://${branding.domain}/terms-and-conditions`,
    siteName: branding.appName,
    type: "website",
  },
};

export default function TermsPage() {
  return <TermsPageContent />;
}
