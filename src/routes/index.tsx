import { createFileRoute } from "@tanstack/react-router";
import { LoadingScreen } from "@/components/uniweb/LoadingScreen";
import { Navbar } from "@/components/uniweb/Navbar";
import { Hero } from "@/components/uniweb/Hero";
import { FeatureOrbit } from "@/components/uniweb/FeatureOrbit";
import { AdminDashboard } from "@/components/uniweb/AdminDashboard";
import { ServicesIslands } from "@/components/uniweb/ServicesIslands";
import { Packages } from "@/components/uniweb/Packages";
import { Operations } from "@/components/uniweb/Operations";
import { CmsPages } from "@/components/uniweb/CmsPages";
import { FinalCta } from "@/components/uniweb/FinalCta";
import { Footer } from "@/components/uniweb/Footer";
import { StickyMobileCta } from "@/components/uniweb/StickyMobileCta";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UiS Store — E-Commerce Packages" },
      { name: "description", content: "Mobile-first white-label e-commerce websites with payments, delivery, inventory and admin panel. Basic, Advanced and Premium packages." },
      { property: "og:title", content: "UiS Store — E-Commerce Packages" },
      { property: "og:description", content: "Launch your online store with UiS Store. Bilingual, secure, scalable e-commerce — built for growth." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <LoadingScreen />
      <Navbar />
      <main>
        <Hero />
        <FeatureOrbit />
        <AdminDashboard />
        <ServicesIslands />
        <Packages />
        <Operations />
        <CmsPages />
        <FinalCta />
      </main>
      <Footer />
      <StickyMobileCta />
    </div>
  );
}
