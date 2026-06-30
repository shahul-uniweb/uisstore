import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import { Check, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Basic",
    price: "450",
    unit: "K.D / Year",
    ideal: "Startups",
    cta: "Choose Basic",
    color: "#16A7E0",
    gradient: "linear-gradient(135deg,#0D7ABD 0%,#16A7E0 100%)",
    features: ["Up to 500 Products", "English Language", "1 Payment Gateway", "Basic Delivery Integration", "1 Admin User", "Basic SEO Setup", "1 Month Support", "1 Training Session"],
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
    features: ["Up to 1000 Products", "English & Arabic", "2 Payment Gateways", "Advanced Delivery Integration", "Up to 3 Admin Users", "WhatsApp Integration", "Advanced Notifications", "3 Months Support", "2 Training Sessions"],
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
    features: ["Unlimited Products", "English & Arabic", "Multiple Payment Gateways", "Advanced + Custom Delivery", "Unlimited Admin Users", "Advanced SEO", "Advanced Notifications", "6 Months Support", "Multiple Training Sessions"],
  },
];

const WHATSAPP_NUMBER = "96565702446";

// Builds a WhatsApp click-to-chat link pre-filled with the selected plan's
// name, price and feature list.
function waPackageLink(p: (typeof plans)[number]) {
  const price = p.price === "Custom" ? "Custom (Tailored Quote)" : `${p.price} ${p.unit}`;
  const message =
    `Hello UiS Store! 👋\n\n` +
    `I'm interested in the *${p.name}* package (${price}).\n\n` +
    `Features:\n${p.features.map((f) => `• ${f}`).join("\n")}\n\n` +
    `Could you please share more details?`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function Packages() {
  return (
    <section id="packages" className="relative py-12 lg:py-20 overflow-hidden" style={{ background: "linear-gradient(180deg,#FFF7FB 0%,#FFFFFF 100%)" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Pricing" title="Choose the Right Package for Your Business" subtitle="Transparent pricing. Real e-commerce features. Built for Kuwait & beyond." />
        <div className="mt-14 grid gap-6 lg:gap-8 lg:grid-cols-3" style={{ perspective: "1400px" }}>
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
                <div className="mt-5 flex items-end gap-2">
                  <span className="text-5xl font-extrabold" style={{ color: "var(--brand-dark)", fontFamily: "'Space Grotesk', sans-serif" }}>{p.price}</span>
                  <span className="text-sm text-muted-foreground pb-2">{p.unit}</span>
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
                <a
                  href={waPackageLink(p)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 inline-flex justify-center items-center rounded-full px-6 py-3.5 text-sm font-bold text-white shadow-glow hover:scale-[1.03] transition-transform"
                  style={{ background: p.gradient }}
                >
                  {p.cta}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}