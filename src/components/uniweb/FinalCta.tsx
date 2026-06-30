import { motion } from "framer-motion";
import { Rocket, ShoppingBag, CreditCard, Package } from "lucide-react";
import { Logo } from "./Logo";

export function FinalCta() {
  return (
    <section id="contact" className="relative pt-8 pb-16 lg:pt-10 lg:pb-24 overflow-hidden">
      <div className="absolute inset-0 -z-10" style={{ background: "linear-gradient(180deg,#FFFFFF 0%,#FFF7FB 100%)" }} />
      <motion.div className="absolute inset-0 -z-10 opacity-40" style={{ background: "var(--gradient-brand)", backgroundSize: "200% 200%" }} animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 12, repeat: Infinity }} />
      {/* watermark logo */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-[0.04]">
        <Logo className="h-[500px] w-[500px]" />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center relative">
        {/* rocket scene */}
        <div className="relative h-48 sm:h-64 mb-8">
          <motion.div
            initial={{ y: 60, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute left-1/2 bottom-0 -translate-x-1/2"
          >
            {/* continuous thrust / hover */}
            <motion.div
              animate={{ y: [0, -16, 0] }}
              transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
              style={{ willChange: "transform" }}
            >
              {/* fast-flickering exhaust flame */}
              <motion.div
                animate={{ scaleY: [1, 1.6, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 0.22, repeat: Infinity }}
                className="absolute left-1/2 -bottom-12 -translate-x-1/2 w-12 h-16 rounded-b-full"
                style={{ background: "linear-gradient(180deg,#F9A349 0%,#E61C83 100%)", filter: "blur(8px)" }}
              />
              <div className="relative rounded-3xl p-5 bg-gradient-brand shadow-glow animate-pulse-glow">
                <Rocket className="h-12 w-12 text-white -rotate-45" />
              </div>
            </motion.div>

            {/* rising exhaust sparks */}
            {[...Array(7)].map((_, i) => (
              <motion.span
                key={i}
                className="absolute left-1/2 -bottom-6 h-1.5 w-1.5 rounded-full"
                style={{ background: ["#F9A349", "#E61C83", "#16A7E0", "#FFFFFF"][i % 4] }}
                initial={{ opacity: 0 }}
                animate={{
                  y: [0, 34 + (i % 3) * 14],
                  x: [0, (i % 2 ? 1 : -1) * (8 + i * 3)],
                  opacity: [0, 1, 0],
                  scale: [1, 0.3],
                }}
                transition={{ duration: 0.8 + (i % 3) * 0.2, repeat: Infinity, delay: i * 0.12, ease: "easeIn" }}
              />
            ))}
          </motion.div>
          {/* floating cards */}
          {[
            { Icon: ShoppingBag, x: -120, y: -10, color: "#E61C83", delay: 0.4 },
            { Icon: CreditCard, x: 120, y: 10, color: "#16A7E0", delay: 0.6 },
            { Icon: Package, x: -80, y: 80, color: "#F9A349", delay: 0.8 },
            { Icon: Package, x: 100, y: 90, color: "#0D7ABD", delay: 1 },
          ].map((c, i) => {
            const Icon = c.Icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40, scale: 0 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: c.delay, type: "spring" }}
                className="absolute left-1/2 top-1/2"
                style={{ transform: `translate(calc(-50% + ${c.x}px), calc(-50% + ${c.y}px))` }}
              >
                <motion.div animate={{ y: [0, -10] }} transition={{ duration: 1.6, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: i*0.2 }} className="rounded-2xl p-3 shadow-glow" style={{ background: c.color, willChange: "transform" }}>
                  <Icon className="h-5 w-5 text-white" />
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight" style={{ color: "var(--brand-dark)", fontFamily: "'Space Grotesk', sans-serif" }}>
          Ready to Launch Your <span className="text-gradient-brand">Online Store?</span>
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          Start selling online with a professional e-commerce website built for growth.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <a href="#packages" className="inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-bold text-white bg-gradient-brand shadow-glow animate-pulse-glow hover:scale-[1.03] transition-transform">
            Get Your Store Today
          </a>
          <a href="https://wa.me/message/W47MG2LLOHCBJ1" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-bold glass hover:shadow-soft transition" style={{ color: "var(--brand-deep)" }}>
            Talk to UiS Store Team
          </a>
        </motion.div>
      </div>
    </section>
  );
}