import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Rocket, ShoppingBag, CreditCard, Package, Globe, MessageCircle, ArrowRight } from "lucide-react";
import { openLeadForm } from "@/lib/lead-form";

const orbitIcons = [
  { Icon: ShoppingBag, color: "#E61C83" },
  { Icon: CreditCard, color: "#16A7E0" },
  { Icon: Package, color: "#F9A349" },
  { Icon: Globe, color: "#0D7ABD" },
];

const stats = [
  { value: "100+", label: "Stores Launched" },
  { value: "EN/AR", label: "Bilingual Ready" },
  { value: "24/7", label: "Human Support" },
];

const headlineWords = ["Ready", "to", "Launch", "Your"];

export function FinalCta() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  // rocket lifts off as the section scrolls through the viewport
  const rocketY = useTransform(scrollYProgress, [0, 0.45, 1], [90, 0, -150]);
  const sceneScale = useTransform(scrollYProgress, [0, 0.35], [0.85, 1]);
  // background blobs drift at different speeds (parallax)
  const blobAY = useTransform(scrollYProgress, [0, 1], [90, -90]);
  const blobBY = useTransform(scrollYProgress, [0, 1], [-70, 70]);
  const ringRotate = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <section ref={ref} id="contact" className="relative pt-8 pb-16 lg:pt-10 lg:pb-24 overflow-hidden">
      {/* same soft background language as the rest of the page */}
      <div className="absolute inset-0 -z-10" style={{ background: "linear-gradient(180deg,#FFFFFF 0%,#FFF7FB 100%)" }} />

      {/* parallax glow blobs */}
      <motion.div
        className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full blur-3xl opacity-40 -z-10"
        style={{ background: "var(--gradient-warm)", y: blobAY }}
      />
      <motion.div
        className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full blur-3xl opacity-30 -z-10"
        style={{ background: "var(--gradient-blue)", y: blobBY }}
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center relative">
        {/* rocket + orbit scene */}
        <motion.div className="relative mx-auto h-64 w-64 sm:h-72 sm:w-72 mb-6" style={{ scale: sceneScale }}>
          {/* soft glowing core */}
          <div
            className="animate-pulse-scale absolute inset-10 rounded-full blur-2xl opacity-40"
            style={{ background: "var(--gradient-brand)", animationDuration: "4s" }}
          />
          {/* orbit rings — outer one rotates with scroll */}
          <motion.div className="absolute inset-0 rounded-full border border-dashed" style={{ borderColor: "rgba(16,24,40,0.12)", rotate: ringRotate }} />
          <div className="absolute inset-10 rounded-full border" style={{ borderColor: "rgba(16,24,40,0.08)" }} />

          {/* orbiting icons — CSS spin, inner counter-spin keeps them upright */}
          <div className="animate-orbit absolute inset-0">
            {orbitIcons.map(({ Icon, color }, i) => (
              <div
                key={i}
                className="absolute left-1/2 top-1/2"
                style={{ transform: `rotate(${i * 90}deg) translateX(clamp(7.5rem, 32vw, 8.5rem)) rotate(-${i * 90}deg)` }}
              >
                <div
                  className="animate-spin-ccw -ml-5 -mt-5 rounded-2xl p-2.5 shadow-glow"
                  style={{ background: color }}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </div>
            ))}
          </div>

          {/* rocket rides the scroll */}
          <motion.div className="absolute left-1/2 top-1/2 -ml-[44px] -mt-[44px]" style={{ y: rocketY, willChange: "transform" }}>
            <div className="animate-float-y relative" style={{ animationDuration: "2.2s" }}>
              {/* flickering exhaust */}
              <div
                className="animate-flicker absolute left-1/2 -bottom-10 -translate-x-1/2 w-10 h-14 rounded-b-full"
                style={{ background: "linear-gradient(180deg,#F9A349 0%,#E61C83 100%)", filter: "blur(8px)" }}
              />
              <div className="rounded-3xl p-5 bg-gradient-brand shadow-glow animate-pulse-glow">
                <Rocket className="h-12 w-12 text-white -rotate-45" />
              </div>
            </div>
          </motion.div>

          {/* rising sparks */}
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="animate-spark absolute left-1/2 bottom-14 h-1.5 w-1.5 rounded-full"
              style={
                {
                  background: ["#F9A349", "#E61C83", "#16A7E0", "#0D7ABD"][i % 4],
                  "--sx": `${(i % 2 ? 1 : -1) * (8 + i * 3)}px`,
                  "--sy": `${30 + (i % 3) * 12}px`,
                  animationDuration: `${0.9 + (i % 3) * 0.2}s`,
                  animationDelay: `${i * 0.14}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </motion.div>

        {/* word-by-word headline reveal — same fonts as every other section */}
        <h2
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight"
          style={{ color: "var(--brand-dark)", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {headlineWords.map((w, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="inline-block mr-[0.28em]"
            >
              {w}
            </motion.span>
          ))}
          <motion.span
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: headlineWords.length * 0.08 + 0.1, duration: 0.6, type: "spring" }}
            className="inline-block text-gradient-brand"
          >
            Online Store?
          </motion.span>
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 }}
          className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          Start selling online with a professional e-commerce website built for growth — payments, delivery and admin panel included.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.45 }}
          className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
        >
          <button
            type="button"
            onClick={openLeadForm}
            className="group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white bg-gradient-brand animate-gradient shadow-glow animate-pulse-glow hover:scale-[1.03] transition-transform"
          >
            Get Your Store Today
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          {/* The ONLY direct-to-WhatsApp CTA on the site. */}
          <a
            href="https://wa.me/message/W47MG2LLOHCBJ1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold glass hover:shadow-soft hover:scale-[1.02] transition"
            style={{ color: "var(--brand-deep)" }}
          >
            <MessageCircle className="h-4 w-4" />
            Talk to UiS Store Team
          </a>
        </motion.div>

        {/* trust stats — mirrors the Hero's row for a consistent close */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-10 flex items-center justify-center gap-6 sm:gap-10"
        >
          {stats.map((s, i) => (
            <div key={i} className="flex items-center gap-6 sm:gap-10">
              <div>
                <p className="text-xl sm:text-2xl font-extrabold" style={{ color: "var(--brand-dark)", fontFamily: "'Space Grotesk', sans-serif" }}>
                  {s.value}
                </p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
              {i < stats.length - 1 && <div className="h-8 w-px bg-border" />}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
