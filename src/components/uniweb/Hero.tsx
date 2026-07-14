import { motion } from "framer-motion";
import { ShoppingBag, CreditCard, Truck, BarChart3, Globe, Plus } from "lucide-react";
import { openLeadForm } from "@/lib/lead-form";

export function Hero() {
  return (
    <section id="home" className="relative pt-28 pb-10 lg:pt-36 lg:pb-16 overflow-hidden">
      {/* animated bg */}
      <div className="absolute inset-0 -z-10" style={{ background: "linear-gradient(180deg,#FFF7FB 0%,#F3FBFF 60%,#FFFFFF 100%)" }} />
      <div
        className="animate-drift absolute -top-32 -left-32 h-96 w-96 rounded-full opacity-40 blur-3xl -z-10"
        style={{ background: "var(--gradient-warm)" }}
      />
      <div
        className="animate-drift-rev absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full opacity-20 blur-3xl -z-10"
        style={{ background: "var(--gradient-blue)" }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="text-center lg:text-left">
            <motion.span
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="inline-flex items-center rounded-full p-[1.5px] bg-gradient-brand animate-gradient shadow-glow"
            >
              <span
                className="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-1.5 text-xs font-bold backdrop-blur-sm"
                style={{ color: "var(--brand-magenta)" }}
              >
                <span className="h-2 w-2 rounded-full bg-gradient-brand animate-pulse" />
                White Label E-Commerce Solutions
              </span>
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight"
              style={{ color: "var(--brand-dark)", fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Launch Your Online Store in Kuwait with{" "}
              <span className="text-gradient-brand">UiS Store</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0"
            >
              Mobile-first e-commerce websites with KNET payments, GCC delivery, inventory and a powerful admin panel — built for real businesses in Kuwait &amp; beyond.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
            >
              <a href="#packages" className="inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-semibold text-white bg-gradient-brand shadow-glow hover:scale-[1.03] active:scale-95 transition-transform animate-gradient">
                View Packages
              </a>
              <button type="button" onClick={openLeadForm} className="inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-semibold glass hover:shadow-soft transition" style={{ color: "var(--brand-deep)" }}>
                Book a Demo
              </button>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-8 flex items-center gap-6 justify-center lg:justify-start text-xs text-muted-foreground">
              <div><span className="font-bold text-foreground text-lg">100+</span> Stores Launched</div>
              <div className="h-8 w-px bg-border" />
              <div><span className="font-bold text-foreground text-lg">EN/AR</span> Bilingual</div>
              <div className="h-8 w-px bg-border" />
              <div><span className="font-bold text-foreground text-lg">24/7</span> Support</div>
            </motion.div>
          </div>

          {/* 3D Scene */}
          <div className="relative h-[480px] sm:h-[540px] mx-auto w-full max-w-lg" style={{ perspective: "1200px" }}>
            <div
              className="animate-pulse-scale absolute inset-0 rounded-[3rem] opacity-50 blur-3xl"
              style={{ background: "var(--gradient-brand)" }}
            />
            {/* Phone */}
            <motion.div
              initial={{ opacity: 0, y: 60, rotateY: -20 }}
              animate={{ opacity: 1, y: 0, rotateY: -8 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="absolute left-1/2 top-6 -translate-x-1/2 w-56 sm:w-64 h-[420px] rounded-[2.5rem] bg-white shadow-2xl border-8 border-[var(--brand-dark)]"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="absolute top-2 left-1/2 -translate-x-1/2 h-5 w-20 rounded-full bg-[var(--brand-dark)]" />
              <div className="p-3 pt-8 h-full overflow-hidden">
                <div className="rounded-2xl h-24 bg-gradient-brand mb-3 flex items-end p-3">
                  <span className="text-white text-xs font-bold">New Arrivals</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[0,1,2,3].map((i) => (
                    <div
                      key={i}
                      className="animate-float-y-sm aspect-square rounded-xl"
                      style={{
                        background: ["#FFF7FB","#EEF9FF","#F3FBFF","#FFF7FB"][i],
                        animationDuration: `${2 + i * 0.2}s`,
                        animationDelay: `${i * 0.2}s`,
                      }}
                    >
                      <div className="h-1/2 rounded-t-xl" style={{ background: ["#E61C83","#16A7E0","#F9A349","#0D7ABD"][i], opacity: 0.85 }} />
                      <div className="p-1.5">
                        <div className="h-1.5 w-3/4 rounded bg-foreground/20 mb-1" />
                        <div className="h-1.5 w-1/2 rounded bg-foreground/10" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Floating cards — text colors chosen to pass WCAG 4.5:1 contrast on each bg */}
            <FloatCard delay={0.6} className="top-4 -left-2 sm:-left-6" color="#D6146F">
              <ShoppingBag className="h-5 w-5 text-white" />
              <div>
                <p className="text-[10px] text-white">Cart</p>
                <p className="text-sm font-bold text-white">3 items</p>
              </div>
            </FloatCard>
            <FloatCard delay={0.8} className="top-32 -right-2 sm:-right-6" color="#16A7E0">
              <CreditCard className="h-5 w-5" style={{ color: "#101828" }} />
              <div>
                <p className="text-[10px]" style={{ color: "#101828" }}>Paid</p>
                <p className="text-sm font-bold" style={{ color: "#101828" }}>KWD 24.500</p>
              </div>
            </FloatCard>
            <FloatCard delay={1.0} className="bottom-24 -left-2 sm:-left-8" color="#F9A349">
              <Truck className="h-5 w-5" style={{ color: "#101828" }} />
              <div>
                <p className="text-[10px]" style={{ color: "#101828" }}>Delivery</p>
                <p className="text-sm font-bold" style={{ color: "#101828" }}>On the way</p>
              </div>
            </FloatCard>
            <FloatCard delay={1.2} className="bottom-6 -right-2 sm:-right-6" color="#0D7ABD">
              <BarChart3 className="h-5 w-5 text-white" />
              <div>
                <p className="text-[10px] text-white">Sales</p>
                <p className="text-sm font-bold text-white">+38% ↑</p>
              </div>
            </FloatCard>
            <motion.div
              initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.4 }}
              className="absolute top-1/2 -right-4 sm:right-6 -translate-y-1/2 rounded-full glass px-3 py-1.5 flex items-center gap-1.5 shadow-soft"
            >
              <Globe className="h-3.5 w-3.5" style={{ color: "var(--brand-deep)" }} />
              <span className="text-xs font-bold">EN | عربي</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FloatCard({ children, className = "", color, delay = 0 }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.6, type: "spring" }}
      className={`absolute z-10 ${className}`}
    >
      <div
        className="animate-float-y flex items-center gap-2 rounded-2xl px-3 py-2.5 shadow-2xl"
        style={{
          background: color,
          boxShadow: `0 20px 40px -10px ${color}80`,
          animationDuration: "2.6s",
          animationDelay: `${delay}s`,
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}