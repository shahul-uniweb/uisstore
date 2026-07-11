import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import { Smartphone, Languages, Package, ShoppingCart, UserCheck, LogIn, ShieldCheck, Truck, User, History, Heart, MousePointer2 } from "lucide-react";

const features = [
  { icon: Smartphone, label: "Responsive Website", desc: "Flawless on every screen size", color: "#E61C83" },
  { icon: Languages, label: "English & Arabic", desc: "Full bilingual store with RTL", color: "#F9A349" },
  { icon: Package, label: "Product Listings", desc: "Rich catalogs with variants", color: "#16A7E0" },
  { icon: ShoppingCart, label: "Add to Cart", desc: "Smooth one-tap cart", color: "#0D7ABD" },
  { icon: UserCheck, label: "Guest Checkout", desc: "Buy without an account", color: "#E61C83" },
  { icon: LogIn, label: "Registered Checkout", desc: "Save details for next time", color: "#F9A349" },
  { icon: ShieldCheck, label: "Secure Payments", desc: "KNET, Visa & Mastercard", color: "#16A7E0" },
  { icon: Truck, label: "Delivery Integration", desc: "Live courier tracking", color: "#0D7ABD" },
  { icon: User, label: "Customer Login", desc: "Personal accounts & profiles", color: "#E61C83" },
  { icon: History, label: "Order History", desc: "Track every past order", color: "#F9A349" },
  { icon: Heart, label: "Wishlist", desc: "Save favourites for later", color: "#16A7E0" },
  { icon: MousePointer2, label: "Mobile Shopping", desc: "Designed mobile-first", color: "#0D7ABD" },
];

export function FeatureOrbit() {
  return (
    <section
      id="features"
      className="relative py-12 lg:py-20 overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at center, rgba(230,28,131,0.10), transparent 35%), radial-gradient(circle at right, rgba(22,167,224,0.12), transparent 40%), linear-gradient(180deg,#ffffff 0%,#f3fbff 100%)",
      }}
    >
      {/* Decorative floating blobs + particles — CSS-driven (compositor, not JS) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-0">
        <div
          className="animate-drift absolute top-6 -left-12 h-56 w-56 rounded-full blur-3xl opacity-25"
          style={{ background: "radial-gradient(circle,#E61C83,transparent 70%)" }}
        />
        <div
          className="animate-drift-rev absolute bottom-10 -right-10 h-64 w-64 rounded-full blur-3xl opacity-40"
          style={{ background: "radial-gradient(circle,#16A7E0,transparent 70%)" }}
        />
        {[...Array(14)].map((_, i) => (
          <span
            key={i}
            className="animate-twinkle absolute h-1.5 w-1.5 rounded-full"
            style={{
              top: `${(i * 53) % 100}%`,
              left: `${(i * 37) % 100}%`,
              background: ["#E61C83", "#F9A349", "#16A7E0", "#0D7ABD"][i % 4],
              animationDuration: `${3 + (i % 4)}s`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Feature Universe" title="Everything Your Online Store Needs" subtitle="A complete toolkit for selling online — from browsing to checkout to delivery." />

        {/* Desktop: device flanked by feature cards */}
        <div className="hidden lg:grid grid-cols-[1fr_auto_1fr] items-center gap-8 xl:gap-12 mt-16">
          {/* left column (inward-facing) */}
          <div className="flex flex-col gap-4">
            {features.slice(0, 6).map((f, i) => (
              <FeatureRow key={i} f={f} i={i} side="left" />
            ))}
          </div>

          {/* center phone */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring" }}
            className="relative mx-2"
          >
            <div
              aria-hidden
              className="animate-spin-slow absolute -inset-3 rounded-[3rem] opacity-40 blur-2xl"
              style={{
                background: "conic-gradient(from 0deg,#E61C83,#F9A349,#16A7E0,#0D7ABD,#E61C83)",
                animationDuration: "14s",
              }}
            />
            <div
              className="animate-float-y relative w-52 h-[26rem] rounded-[2.4rem] bg-[var(--brand-dark)] p-1.5 shadow-glow"
              style={{ animationDuration: "3.5s" }}
            >
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 h-5 w-20 rounded-full bg-[var(--brand-dark)] z-10" />
              <div className="h-full w-full rounded-[2rem] bg-white p-3 pt-7 flex flex-col gap-2 overflow-hidden">
                <div className="h-24 rounded-xl bg-gradient-brand flex items-end p-3">
                  <span className="text-xs font-bold text-white">SHOP NOW</span>
                </div>
                <div className="grid grid-cols-2 gap-2 flex-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="rounded-lg p-1.5" style={{ background: ["#FFF7FB", "#F3FBFF", "#EEF9FF", "#FFF7FB"][i] }}>
                      <div className="h-1/2 rounded" style={{ background: ["#E61C83", "#16A7E0", "#F9A349", "#0D7ABD"][i], opacity: 0.85 }} />
                      <div className="h-1.5 w-3/4 mt-1.5 rounded bg-foreground/20" />
                      <div className="h-1.5 w-1/2 mt-1 rounded bg-foreground/10" />
                    </div>
                  ))}
                </div>
                <div className="h-9 rounded-xl bg-gradient-warm" />
              </div>
            </div>
          </motion.div>

          {/* right column */}
          <div className="flex flex-col gap-4">
            {features.slice(6).map((f, i) => (
              <FeatureRow key={i} f={f} i={i} side="right" />
            ))}
          </div>
        </div>

        {/* Mobile: compact phone + clean feature grid */}
        <div className="lg:hidden mt-10">
          {/* compact floating phone */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring" }}
            className="relative mx-auto w-40"
          >
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-brand blur-2xl opacity-40" />
            <div className="animate-float-y-sm relative w-40 h-72 rounded-[2rem] bg-[var(--brand-dark)] p-1.5 shadow-glow">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 h-4 w-16 rounded-full bg-[var(--brand-dark)] z-10" />
              <div className="h-full w-full rounded-[1.7rem] bg-white p-2 pt-6 flex flex-col gap-1.5 overflow-hidden">
                <div className="h-16 rounded-xl bg-gradient-brand flex items-end p-2">
                  <span className="text-[9px] font-bold text-white">SHOP NOW</span>
                </div>
                <div className="grid grid-cols-2 gap-1 flex-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="rounded-lg p-1"
                      style={{ background: ["#FFF7FB", "#EEF9FF", "#F3FBFF", "#FFF7FB"][i] }}
                    >
                      <div className="h-1/2 rounded" style={{ background: ["#E61C83", "#16A7E0", "#F9A349", "#0D7ABD"][i], opacity: 0.85 }} />
                      <div className="h-1 w-3/4 mt-1 rounded bg-foreground/20" />
                      <div className="h-1 w-1/2 mt-0.5 rounded bg-foreground/10" />
                    </div>
                  ))}
                </div>
                <div className="h-6 rounded-lg bg-gradient-warm" />
              </div>
            </div>
          </motion.div>

          {/* clean 2-column feature grid */}
          <div className="mt-10 grid grid-cols-2 gap-3">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: i * 0.04, duration: 0.4 }}
                  className="flex items-center gap-2.5 rounded-2xl p-3 shadow-soft border border-white"
                  style={{ background: `linear-gradient(135deg,#fff 0%, ${f.color}10 100%)` }}
                >
                  <span
                    className="rounded-xl p-2 shrink-0"
                    style={{ background: f.color, boxShadow: `0 6px 16px -6px ${f.color}` }}
                  >
                    <Icon className="h-4 w-4 text-white" />
                  </span>
                  <span className="text-xs font-semibold leading-tight" style={{ color: "var(--brand-dark)" }}>
                    {f.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// Desktop feature card: richer content (label + description), a colored
// connector node + line pointing toward the central phone, gentle float and
// a glow on hover. `side` mirrors the layout for the left / right columns.
function FeatureRow({
  f,
  i,
  side,
}: {
  f: (typeof features)[number];
  i: number;
  side: "left" | "right";
}) {
  const Icon = f.icon;
  const isLeft = side === "left";
  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: i * 0.08, duration: 0.5 }}
      className="group relative"
    >
      <div
        className={`animate-float-y-sm relative flex items-center gap-4 rounded-2xl border border-white p-4 shadow-soft transition-all hover:scale-[1.03] group-hover:shadow-glow ${isLeft ? "flex-row-reverse text-right" : "text-left"}`}
        style={{
          background: `linear-gradient(135deg,#ffffff 0%, ${f.color}12 100%)`,
          animationDuration: `${3 + (i % 3) * 0.5}s`,
          animationDelay: `${i * 0.2}s`,
        }}
      >
        <span
          className="shrink-0 rounded-xl p-2.5 transition-transform group-hover:scale-110"
          style={{ background: f.color, boxShadow: `0 8px 20px -6px ${f.color}` }}
        >
          <Icon className="h-5 w-5 text-white" />
        </span>
        <div className="flex-1">
          <p className="text-sm font-bold leading-tight" style={{ color: "var(--brand-dark)" }}>{f.label}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{f.desc}</p>
        </div>
        {/* connector node + line toward the phone (inner edge) */}
        <span
          className={`absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full ring-4 ring-white ${isLeft ? "-right-1.5" : "-left-1.5"}`}
          style={{ background: f.color }}
        />
        <span
          aria-hidden
          className={`absolute top-1/2 h-px w-10 -translate-y-1/2 ${isLeft ? "right-0 translate-x-full" : "left-0 -translate-x-full"}`}
          style={{ background: `linear-gradient(${isLeft ? "90deg" : "270deg"}, ${f.color}, transparent)` }}
        />
      </div>
    </motion.div>
  );
}