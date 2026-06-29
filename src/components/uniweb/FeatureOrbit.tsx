import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { SectionHeader } from "./SectionHeader";
import { Smartphone, Languages, Package, ShoppingCart, UserCheck, LogIn, ShieldCheck, Truck, User, History, Heart, MousePointer2 } from "lucide-react";

const features = [
  { icon: Smartphone, label: "Responsive Website", color: "#E61C83" },
  { icon: Languages, label: "English & Arabic", color: "#F9A349" },
  { icon: Package, label: "Product Listings", color: "#16A7E0" },
  { icon: ShoppingCart, label: "Add to Cart", color: "#0D7ABD" },
  { icon: UserCheck, label: "Guest Checkout", color: "#E61C83" },
  { icon: LogIn, label: "Registered Checkout", color: "#F9A349" },
  { icon: ShieldCheck, label: "Secure Payments", color: "#16A7E0" },
  { icon: Truck, label: "Delivery Integration", color: "#0D7ABD" },
  { icon: User, label: "Customer Login", color: "#E61C83" },
  { icon: History, label: "Order History", color: "#F9A349" },
  { icon: Heart, label: "Wishlist", color: "#16A7E0" },
  { icon: MousePointer2, label: "Mobile Shopping", color: "#0D7ABD" },
];

export function FeatureOrbit() {
  const mobileRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: mobileRef, offset: ["start end", "end start"] });
  const phoneRotate = useTransform(scrollYProgress, [0, 1], [-12, 12]);
  const phoneY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const glowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 0.9]);

  // 6 orbit features + 6 carousel features
  const orbitFeatures = features.slice(0, 6);
  const carouselFeatures = features.slice(6);

  return (
    <section
      id="features"
      className="relative py-20 lg:py-28 overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at center, rgba(230,28,131,0.10), transparent 35%), radial-gradient(circle at right, rgba(22,167,224,0.12), transparent 40%), linear-gradient(180deg,#ffffff 0%,#f3fbff 100%)",
      }}
    >
      {/* Decorative floating blobs + particles (mobile-friendly) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-0">
        <motion.div
          className="absolute -top-16 -left-16 h-56 w-56 rounded-full blur-3xl opacity-40"
          style={{ background: "radial-gradient(circle,#E61C83,transparent 70%)" }}
          animate={{ x: [0, 20, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 -right-10 h-64 w-64 rounded-full blur-3xl opacity-40"
          style={{ background: "radial-gradient(circle,#16A7E0,transparent 70%)" }}
          animate={{ x: [0, -20, 0], y: [0, -25, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        {[...Array(14)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full"
            style={{
              top: `${(i * 53) % 100}%`,
              left: `${(i * 37) % 100}%`,
              background: ["#E61C83", "#F9A349", "#16A7E0", "#0D7ABD"][i % 4],
              opacity: 0.4,
            }}
            animate={{ y: [0, -12, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 3 + (i % 4), repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Feature Universe" title="Everything Your Online Store Needs" subtitle="A complete toolkit for selling online — from browsing to checkout to delivery." />

        {/* Desktop orbit */}
        <div className="hidden lg:block relative h-[640px] mt-16">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="absolute inset-0 flex items-center justify-center">
            <div className="relative h-[520px] w-[520px]">
              {features.map((f, i) => {
                const angle = (i / features.length) * Math.PI * 2;
                const r = 250;
                const x = Math.cos(angle) * r;
                const y = Math.sin(angle) * r;
                const Icon = f.icon;
                return (
                  <motion.div
                    key={i}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{ transform: `translate(${x}px, ${y}px) translate(-50%, -50%)` }}
                  >
                    <motion.div animate={{ rotate: -360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}>
                      <div className="glass rounded-2xl p-3 shadow-soft w-44 hover:scale-110 transition-transform">
                        <div className="flex items-center gap-2">
                          <div className="rounded-lg p-2" style={{ background: f.color }}>
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-sm font-semibold">{f.label}</span>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
          {/* Center phone */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div initial={{ scale: 0, rotateY: 180 }} whileInView={{ scale: 1, rotateY: 0 }} viewport={{ once: true }} transition={{ duration: 1 }} className="relative">
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-brand blur-2xl opacity-60 animate-pulse-glow" />
              <div className="relative w-44 h-72 rounded-[2rem] bg-gradient-brand p-1 shadow-glow">
                <div className="h-full w-full rounded-[1.7rem] bg-white p-3 flex flex-col gap-2">
                  <div className="h-20 rounded-xl bg-gradient-blue" />
                  <div className="grid grid-cols-2 gap-1.5 flex-1">
                    {[0,1,2,3].map((i) => <div key={i} className="rounded-lg" style={{ background: ["#FFF7FB","#F3FBFF","#EEF9FF","#FFF7FB"][i] }} />)}
                  </div>
                  <div className="h-8 rounded-xl bg-gradient-warm" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Mobile: 3D feature universe */}
        <div ref={mobileRef} className="lg:hidden mt-10">
          <div
            className="relative mx-auto"
            style={{ height: 520, perspective: "1200px" }}
          >
            {/* Animated glow behind phone */}
            <motion.div
              style={{ scale: glowScale }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full blur-3xl opacity-60"
            >
              <div className="h-full w-full rounded-full bg-gradient-brand" />
            </motion.div>

            {/* Connecting lines (SVG) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 360 520">
              <defs>
                <linearGradient id="lineGrad" x1="0" x2="1">
                  <stop offset="0%" stopColor="#E61C83" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#16A7E0" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              {orbitFeatures.map((_, i) => {
                const angle = (i / orbitFeatures.length) * Math.PI * 2 - Math.PI / 2;
                const r = 150;
                const x = 180 + Math.cos(angle) * r;
                const y = 260 + Math.sin(angle) * r;
                return (
                  <motion.line
                    key={i}
                    x1="180" y1="260" x2={x} y2={y}
                    stroke="url(#lineGrad)" strokeWidth="1" strokeDasharray="3 4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.4 + i * 0.1 }}
                  />
                );
              })}
            </svg>

            {/* Central 3D phone */}
            <motion.div
              initial={{ opacity: 0, scale: 0.6, rotateY: -30 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, type: "spring" }}
              style={{ rotate: phoneRotate, y: phoneY, transformStyle: "preserve-3d" }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
            >
              <div className="relative w-36 h-64 rounded-[2rem] bg-[var(--brand-dark)] p-1.5 shadow-glow">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 h-4 w-16 rounded-full bg-[var(--brand-dark)] z-10" />
                <div className="h-full w-full rounded-[1.7rem] bg-white p-2 pt-6 flex flex-col gap-1.5 overflow-hidden">
                  <div className="h-16 rounded-xl bg-gradient-brand flex items-end p-2">
                    <span className="text-[9px] font-bold text-white">SHOP NOW</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 flex-1">
                    {[0, 1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 2.5 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
                        className="rounded-lg p-1"
                        style={{ background: ["#FFF7FB", "#EEF9FF", "#F3FBFF", "#FFF7FB"][i] }}
                      >
                        <div className="h-1/2 rounded" style={{ background: ["#E61C83", "#16A7E0", "#F9A349", "#0D7ABD"][i], opacity: 0.85 }} />
                        <div className="h-1 w-3/4 mt-1 rounded bg-foreground/20" />
                        <div className="h-1 w-1/2 mt-0.5 rounded bg-foreground/10" />
                      </motion.div>
                    ))}
                  </div>
                  <div className="h-6 rounded-lg bg-gradient-warm" />
                </div>
              </div>
            </motion.div>

            {/* Orbiting feature pills */}
            {orbitFeatures.map((f, i) => {
              const angle = (i / orbitFeatures.length) * Math.PI * 2 - Math.PI / 2;
              const r = 150;
              const x = Math.cos(angle) * r;
              const y = Math.sin(angle) * r;
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  whileInView={{ opacity: 1, scale: 1, x, y }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, delay: 0.3 + i * 0.12, type: "spring", stiffness: 120 }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
                >
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
                  >
                    <div
                      className="glass rounded-2xl px-2.5 py-1.5 flex items-center gap-1.5 shadow-soft border border-white/60 backdrop-blur-md"
                      style={{ boxShadow: `0 8px 24px -8px ${f.color}80` }}
                    >
                      <motion.div
                        className="rounded-lg p-1.5"
                        style={{ background: f.color }}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                      >
                        <Icon className="h-3 w-3 text-white" />
                      </motion.div>
                      <span className="text-[10px] font-semibold whitespace-nowrap">{f.label}</span>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {/* Swipe carousel below */}
          <div className="mt-6 -mx-4 px-4 overflow-x-auto snap-x snap-mandatory flex gap-3 pb-4 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
            {carouselFeatures.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30, rotateY: -15 }}
                  whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: i * 0.06, type: "spring" }}
                  whileTap={{ scale: 0.95, rotateY: 10 }}
                  className="snap-center shrink-0 w-40 rounded-2xl p-4 glass border border-white/60 backdrop-blur-md"
                  style={{ boxShadow: `0 12px 28px -12px ${f.color}60`, transformStyle: "preserve-3d" }}
                >
                  <motion.div
                    className="rounded-xl p-2.5 w-fit mb-3"
                    style={{ background: f.color, boxShadow: `0 6px 16px -4px ${f.color}` }}
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.2 }}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </motion.div>
                  <p className="text-sm font-semibold">{f.label}</p>
                  <div
                    className="mt-2 h-1 w-12 rounded-full"
                    style={{ background: `linear-gradient(90deg, ${f.color}, transparent)` }}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}