import type { Metadata } from "next";
import { branding } from "@repo/shared-types/branding.config";
import ContactPageContent from "./ContactPageContent";

export const metadata: Metadata = {
  title: `Contact Us — Let's Talk | ${branding.appName}`,
  description:
    `Have a question about ${branding.appName}? Connect with our team for assistance, product enquiries, retailer onboarding or any other support. We're here to help your store grow.`,
  keywords: [
    `Contact ${branding.appName}`,
    `${branding.appName} support`,
    "retailer onboarding",
    "local store software enquiry",
    `${branding.appName} Durg Chhattisgarh`,
  ],
  openGraph: {
    title: `Contact Us — Let's Talk | ${branding.appName}`,
    description:
      "We're here to help your store grow. Connect with our team for assistance, product enquiries, retailer onboarding or any other support.",
    url: `https://${branding.domain}/contact`,
    siteName: branding.appName,
    type: "website",
  },
};

export default function ContactPage() {
  return <ContactPageContent />;
}
