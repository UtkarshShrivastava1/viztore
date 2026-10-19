import type { Metadata } from "next";
import { branding } from "@repo/shared-types/branding.config";
import ForRetailersContent from "./PageContent";

export const metadata: Metadata = {
  title: `For Retailers — ${branding.appName}`,
  description:
    `Digitize, manage, and grow your store with ${branding.appName}. Manage products, inventory, billing, customers, and orders from one platform while getting discovered by nearby shoppers.`,
};

export default function ForRetailersPage() {
  return <ForRetailersContent />;
}
