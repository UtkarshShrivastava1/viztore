import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import PlatformEcosystem from "@/components/platform/PlatformEcosystem";
import PlatformColumns from "@/components/platform/PlatformColumns";
import PlatformHighlights from "@/components/platform/PlatformHighlights";
import PlatformSearchFlow from "@/components/platform/PlatformSearchFlow";
import PlatformCategories from "@/components/platform/PlatformCategories";
import PlatformIntegrations from "@/components/platform/PlatformIntegrations";

export default function PlatformPage() {
  return (
    <>
     <Navbar  />
      <main>
        <PageHero
          badge="The Platform"
          heading="One Platform."
          highlight="Complete Retail Commerce."
          description="Manage your business, discover customers, source inventory, and deliver better shopping experiences — all from one connected platform."
        />
        <PlatformEcosystem />
        <PlatformColumns />
        <PlatformHighlights />
        <PlatformSearchFlow />
        <PlatformCategories />
        <PlatformIntegrations />
      </main>
      <Footer />
    </>
  );
}
