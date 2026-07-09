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
import { Faq, faqs } from "@/components/uniweb/Faq";
import { FinalCta } from "@/components/uniweb/FinalCta";
import { Footer } from "@/components/uniweb/Footer";
import { StickyMobileCta } from "@/components/uniweb/StickyMobileCta";
import { LeadPopup } from "@/components/uniweb/LeadPopup";

const SITE = "https://uisstore.net";

// Structured data for Google rich results and AI assistants (Gemini, ChatGPT, etc.)
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE}/#uniweb`,
      name: "Uniweb IT Solutions",
      url: SITE,
      foundingDate: "2018",
      description:
        "Kuwait-based technology company with 8 years in the market, 60+ clients and 150+ delivered projects.",
      sameAs: [
        "https://www.facebook.com/Uniweb-It-Solutions-592337707835011/",
        "https://www.instagram.com/Uniweb_IT_Solutions/",
        "https://twitter.com/uniweb008",
        "https://www.linkedin.com/company/uniweb-it-solutions/",
        "https://www.youtube.com/channel/UCrf6TZek9ND-u2evvnJ7sRg",
        "https://www.tiktok.com/@uniwebitsolutions",
      ],
    },
    {
      "@type": "LocalBusiness",
      "@id": `${SITE}/#uisstore`,
      name: "UiS Store",
      alternateName: ["UiS Store Kuwait", "uisstore", "uisstore.net"],
      description:
        "White-label e-commerce website packages in Kuwait: bilingual English & Arabic online stores with KNET payments, GCC delivery, inventory management and admin panel.",
      url: SITE,
      logo: `${SITE}/og-image.png`,
      image: `${SITE}/og-image.png`,
      telephone: "+96565702446",
      email: "contact@uniwebonline.com",
      priceRange: "450 K.D - Custom",
      currenciesAccepted: "KWD",
      parentOrganization: { "@id": `${SITE}/#uniweb` },
      address: {
        "@type": "PostalAddress",
        streetAddress: "10th Floor, Office No.2, Sama Tower",
        addressLocality: "Kuwait City",
        addressCountry: "KW",
      },
      geo: { "@type": "GeoCoordinates", latitude: 29.3759, longitude: 47.9774 },
      areaServed: [
        { "@type": "Country", name: "Kuwait" },
        { "@type": "Country", name: "Saudi Arabia" },
        { "@type": "Country", name: "United Arab Emirates" },
        { "@type": "Country", name: "Qatar" },
        { "@type": "Country", name: "Bahrain" },
        { "@type": "Country", name: "Oman" },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      url: SITE,
      name: "UiS Store",
      publisher: { "@id": `${SITE}/#uisstore` },
      inLanguage: ["en", "ar"],
    },
    {
      "@type": "Service",
      "@id": `${SITE}/#service`,
      serviceType: "E-Commerce Website Development",
      name: "E-Commerce Website Packages Kuwait",
      provider: { "@id": `${SITE}/#uisstore` },
      areaServed: { "@type": "Country", name: "Kuwait" },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "UiS Store E-Commerce Packages",
        itemListElement: [
          {
            "@type": "Offer",
            name: "Basic Package",
            description:
              "Up to 1000 products, English & Arabic, 1 payment gateway, 0% commissions, inventory & delivery management, GCC delivery, 10 admin users, basic SEO, hosting, domain & SSL.",
            price: "450",
            priceCurrency: "KWD",
            priceSpecification: { "@type": "UnitPriceSpecification", price: "450", priceCurrency: "KWD", unitText: "per year" },
          },
          {
            "@type": "Offer",
            name: "Advanced Package",
            description:
              "Unlimited products, English & Arabic, 2 payment gateways, 0% commissions, inventory & delivery management, GCC delivery, unlimited admin users, standard SEO, hosting, domain & SSL.",
            price: "850",
            priceCurrency: "KWD",
            priceSpecification: { "@type": "UnitPriceSpecification", price: "850", priceCurrency: "KWD", unitText: "per year" },
          },
          {
            "@type": "Offer",
            name: "Premium Package",
            description:
              "Everything in Advanced plus Store Management App, Point of Sales (P.O.S), multiple payment gateways and advanced SEO. Custom tailored quote.",
          },
        ],
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE}/#faq`,
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "E-Commerce Website Kuwait | Online Store Packages from 450 K.D — UiS Store" },
      {
        name: "description",
        content:
          "Build your online store in Kuwait with UiS Store: bilingual English & Arabic e-commerce websites with KNET payments, GCC delivery, inventory management and a powerful admin panel. Packages from 450 K.D/year — hosting, domain & SSL included. By Uniweb IT Solutions.",
      },
      { property: "og:title", content: "E-Commerce Website Kuwait | Online Store Packages from 450 K.D — UiS Store" },
      {
        property: "og:description",
        content:
          "Bilingual e-commerce websites in Kuwait with KNET payments, GCC delivery and admin panel. Packages from 450 K.D/year — hosting, domain & SSL included.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/` },
    ],
    links: [{ rel: "canonical", href: `${SITE}/` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(structuredData),
      },
    ],
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
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <StickyMobileCta />
      <LeadPopup />
    </div>
  );
}
