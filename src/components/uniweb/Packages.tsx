import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { SectionHeader } from "./SectionHeader";
import { Check, Sparkles, TableProperties, X } from "lucide-react";
import { openLeadForm } from "@/lib/lead-form";

const plans = [
  {
    name: "Starter",
    price: "250",
    unit: "K.D / Year",
    ideal: "New & Small Shops",
    cta: "Choose Starter",
    color: "#0D7ABD",
    gradient: "linear-gradient(135deg,#16A7E0 0%,#0D7ABD 100%)",
    features: [
      "Up to 100 Products",
      "English & Arabic",
      "1 Payment Gateway",
      "0% Commissions",
      "Inventory Management",
      "Delivery Management",
      "GCC Countries Delivery",
      "1 Admin User",
      "Hosting",
      "Domain & SSL Certificate",
    ],
  },
  {
    name: "Basic",
    price: "450",
    unit: "K.D / Year",
    ideal: "Startups",
    cta: "Choose Basic",
    color: "#16A7E0",
    gradient: "linear-gradient(135deg,#0D7ABD 0%,#16A7E0 100%)",
    features: [
      "Up to 500 Products",
      "English & Arabic",
      "1 Payment Gateway",
      "0% Commissions",
      "Inventory Management",
      "Delivery Management",
      "GCC Countries Delivery",
      "5 Admin Users",
      "Basic SEO Setup",
      "Hosting",
      "Domain & SSL Certificate",
    ],
  },
  {
    name: "Advanced",
    price: "850",
    unit: "K.D / Year",
    ideal: "Growing Businesses",
    cta: "Choose Advanced",
    badge: "Most Popular",
    color: "#E61C83",
    gradient: "linear-gradient(135deg,#E61C83 0%,#F9A349 45%,#16A7E0 100%)",
    features: [
      "Up to 1000 Products",
      "English & Arabic",
      "2 Payment Gateways",
      "0% Commissions",
      "Inventory Management",
      "Delivery Management",
      "GCC Countries Delivery",
      "10 Admin Users",
      "Standard SEO Setup",
      "Hosting",
      "Domain & SSL Certificate",
    ],
    featured: true,
  },
  {
    name: "Premium",
    price: "Custom",
    unit: "Tailored Quote",
    ideal: "Established Brands",
    cta: "Contact for Premium",
    color: "#F9A349",
    gradient: "linear-gradient(135deg,#E61C83 0%,#F9A349 100%)",
    features: [
      "Unlimited Products",
      "English & Arabic",
      "Multiple Payment Gateways",
      "0% Commissions",
      "Store Management App",
      "Point of Sales (P.O.S)",
      "Inventory Management",
      "Delivery Management",
      "GCC Countries Delivery",
      "Unlimited Admin Users",
      "Advanced SEO Setup",
      "Hosting",
      "Domain & SSL Certificate",
    ],
  },
];

// Detailed comparison — columns follow the `plans` order (Starter, Basic, Advanced, Premium).
// `true` renders as an "Included" check; "—" renders as not included.
const comparisonRows: { feature: string; values: (string | true)[] }[] = [
  { feature: "Product Limit", values: ["Up to 100", "Up to 500", "Up to 1000", "Unlimited"] },
  { feature: "Store Management App", values: ["—", "—", "—", true] },
  { feature: "Language", values: ["English & Arabic", "English & Arabic", "English & Arabic", "English & Arabic"] },
  { feature: "Payment Gateways", values: ["1 Gateway", "1 Gateway", "2 Gateways", "Multiple"] },
  { feature: "Commissions", values: ["0%", "0%", "0%", "0%"] },
  { feature: "Inventory Management", values: [true, true, true, true] },
  { feature: "Delivery Management", values: [true, true, true, true] },
  { feature: "Point of Sales (P.O.S)", values: ["—", "—", "—", true] },
  { feature: "GCC Countries Delivery", values: [true, true, true, true] },
  { feature: "Admin Users", values: ["1 Admin", "5 Admins", "10 Admins", "Unlimited"] },
  { feature: "SEO Setup", values: ["—", "Basic", "Standard", "Advanced"] },
  { feature: "Technical Support", values: [true, true, true, true] },
  { feature: "Hosting", values: [true, true, true, true] },
  { feature: "Domain", values: [true, true, true, true] },
  { feature: "SSL Certificate", values: [true, true, true, true] },
];

function IncludedCheck({ gradient }: { gradient: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--brand-deep)" }}>
      <span className="rounded-full p-0.5" style={{ background: gradient }}>
        <Check className="h-3 w-3 text-white" strokeWidth={3} />
      </span>
      Included
    </span>
  );
}

function ComparisonModal({ onClose }: { onClose: () => void }) {
  // lock page scroll + close on Escape while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="w-full max-w-5xl rounded-3xl p-[2px] bg-gradient-brand shadow-glow"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex max-h-[85vh] flex-col overflow-hidden rounded-[1.4rem] bg-white">
          {/* header */}
          <div className="flex items-center justify-between gap-3 border-b px-5 py-4 sm:px-7">
            <div>
              <h3
                className="text-lg sm:text-xl font-extrabold tracking-tight"
                style={{ color: "var(--brand-dark)", fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Detailed Package <span className="text-gradient-brand">Comparison</span>
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground lg:hidden">Swipe sideways to compare →</p>
            </div>
            <button
              aria-label="Close comparison"
              onClick={onClose}
              className="shrink-0 rounded-full p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* scrollable table (vertical + horizontal on small screens) */}
          <div className="overflow-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead>
                <tr>
                  <th className="sticky top-0 z-10 px-5 py-4 text-left text-xs font-bold uppercase tracking-widest text-white" style={{ background: "var(--brand-dark)" }}>
                    Feature
                  </th>
                  {plans.map((p) => (
                    <th key={p.name} className="sticky top-0 z-10 px-5 py-4 text-center text-xs font-bold uppercase tracking-widest text-white" style={{ background: p.gradient }}>
                      {p.name}
                      {p.featured && <span className="ml-1.5">★</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <motion.tr
                    key={row.feature}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 + i * 0.03 }}
                    className={i % 2 ? "bg-[#F5FAFF]" : "bg-white"}
                  >
                    <td className="px-5 py-3.5 font-semibold" style={{ color: "var(--brand-dark)" }}>{row.feature}</td>
                    {row.values.map((v, j) => (
                      <td key={j} className="px-5 py-3.5 text-center text-foreground/80" style={plans[j].featured ? { background: "rgba(230,28,131,0.04)" } : undefined}>
                        {v === true ? <IncludedCheck gradient={plans[j].gradient} /> : v}
                      </td>
                    ))}
                  </motion.tr>
                ))}
                {/* price row */}
                <tr className="border-t" style={{ borderColor: "rgba(16,24,40,0.08)" }}>
                  <td className="px-5 py-4 font-extrabold" style={{ color: "var(--brand-dark)" }}>Price (per year)</td>
                  {plans.map((p) => (
                    <td key={p.name} className="px-5 py-4 text-center">
                      <span className="text-lg font-extrabold" style={{ color: p.color, fontFamily: "'Space Grotesk', sans-serif" }}>
                        {p.price === "Custom" ? "Custom" : `${p.price} KD`}
                      </span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Packages() {
  const [showComparison, setShowComparison] = useState(false);

  return (
    <section id="packages" className="relative py-12 lg:py-20 overflow-hidden" style={{ background: "linear-gradient(180deg,#FFF7FB 0%,#FFFFFF 100%)" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Pricing" title="Choose the Right Package for Your Business" subtitle="Transparent pricing. Real e-commerce features. Built for Kuwait & beyond." />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:gap-6 lg:grid-cols-4" style={{ perspective: "1400px" }}>
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 60, rotateY: 20 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.15, duration: 0.8 }}
              whileHover={{ y: -10, rotateX: 3 }}
              className={`relative rounded-3xl p-1 ${p.featured ? "lg:scale-105 lg:-mt-4 z-10" : ""}`}
              style={{ background: p.gradient, transformStyle: "preserve-3d" }}
            >
              {p.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold text-white bg-[var(--brand-dark)] flex items-center gap-1.5 shadow-glow z-10">
                  <Sparkles className="h-3.5 w-3.5" /> {p.badge}
                </div>
              )}
              <div className="rounded-[1.4rem] bg-white h-full p-7 flex flex-col">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: p.color }}>{p.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">Ideal for {p.ideal}</p>
                </div>
                <div className="mt-5 flex items-end gap-1.5">
                  <span className="text-4xl font-extrabold" style={{ color: "var(--brand-dark)", fontFamily: "'Space Grotesk', sans-serif" }}>{p.price}</span>
                  <span className="text-xs text-muted-foreground pb-1.5">{p.unit}</span>
                </div>
                <div className="h-px my-6" style={{ background: `${p.color}20` }} />
                <ul className="space-y-3 flex-1">
                  {p.features.map((f, j) => (
                    <motion.li
                      key={j}
                      initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + j*0.04 }}
                      className="flex items-start gap-2.5 text-sm"
                    >
                      <span className="rounded-full p-0.5 mt-0.5" style={{ background: p.gradient }}>
                        <Check className="h-3 w-3 text-white" strokeWidth={3} />
                      </span>
                      <span className="text-foreground/80">{f}</span>
                    </motion.li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={openLeadForm}
                  className="mt-7 inline-flex justify-center items-center rounded-full px-6 py-3.5 text-sm font-bold text-white shadow-glow hover:scale-[1.03] transition-transform"
                  style={{ background: p.gradient }}
                >
                  {p.cta}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* detailed comparison trigger */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="flex items-center justify-center">
            <button
              onClick={() => setShowComparison(true)}
              className="group inline-flex items-center rounded-full p-[2px] bg-gradient-brand animate-gradient shadow-glow transition-transform hover:scale-[1.03] active:scale-95"
            >
              <span
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold"
                style={{ color: "var(--brand-dark)" }}
              >
                <TableProperties className="h-4 w-4" style={{ color: "var(--brand-magenta)" }} />
                View Detailed Comparison
              </span>
            </button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Compare all features across the four packages, side by side.
          </p>
        </motion.div>
      </div>

      <AnimatePresence>
        {showComparison && <ComparisonModal onClose={() => setShowComparison(false)} />}
      </AnimatePresence>
    </section>
  );
}
