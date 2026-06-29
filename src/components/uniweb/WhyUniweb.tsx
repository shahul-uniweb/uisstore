import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import { Rocket, PaintBucket, Languages, Layers, Settings, Lock, Headphones } from "lucide-react";

const benefits = [
  { icon: Rocket, label: "Fast Launch", desc: "Go live in days, not months." },
  { icon: PaintBucket, label: "White Label Flexibility", desc: "100% your brand, end to end." },
  { icon: Languages, label: "Bilingual Store", desc: "Built for English & Arabic." },
  { icon: Layers, label: "Scalable Packages", desc: "Grow your plan as you grow." },
  { icon: Settings, label: "Easy Admin Control", desc: "Manage everything in one place." },
  { icon: Lock, label: "Secure Payments", desc: "Encrypted, PCI-friendly checkout." },
  { icon: Headphones, label: "Pro Support", desc: "Humans, not bots. Always." },
];

export function WhyUniweb() {
  return (
    <section id="why" className="relative py-20 lg:py-28 overflow-hidden" style={{ background: "linear-gradient(180deg,#FFFFFF 0%,#FFF7FB 100%)" }}>
      <motion.div
        className="absolute -left-32 top-1/3 h-80 w-80 rounded-full blur-3xl opacity-50 -z-0"
        style={{ background: "var(--gradient-warm)" }}
        animate={{ y: [0, 40, 0] }} transition={{ duration: 10, repeat: Infinity }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <SectionHeader eyebrow="Why Uniweb" title="Why Businesses Choose Uniweb" subtitle="The advantages that make Uniweb the partner for ambitious brands." />
        <div className="mt-14 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* 3D collage */}
          <div className="relative h-[420px] sm:h-[480px]" style={{ perspective: "1200px" }}>
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="absolute inset-0 rounded-3xl bg-gradient-blue opacity-30 blur-2xl" />
            <motion.div whileHover={{ rotateY: -8 }} initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="absolute top-0 left-4 w-44 rounded-2xl bg-white shadow-glow p-3" style={{ transformStyle: "preserve-3d" }}>
              <div className="h-20 rounded-lg bg-gradient-brand mb-2" />
              <div className="h-1.5 rounded-full bg-muted w-3/4 mb-1" />
              <div className="h-1.5 rounded-full bg-muted w-1/2" />
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="absolute top-20 right-2 w-40 rounded-2xl bg-gradient-warm p-4 text-white shadow-glow">
              <p className="text-xs opacity-80">Today's Sales</p>
              <p className="text-2xl font-extrabold">KWD 1,248</p>
              <p className="text-xs mt-1">▲ 24%</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="absolute bottom-12 left-0 w-52 rounded-2xl bg-white p-3 shadow-glow">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-xl bg-gradient-blue" />
                <div>
                  <p className="text-xs font-bold">Order Delivered</p>
                  <p className="text-[10px] text-muted-foreground">#1284 · 12 min ago</p>
                </div>
              </div>
            </motion.div>
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute bottom-0 right-6 w-44 rounded-2xl bg-gradient-blue p-4 text-white shadow-glow">
              <p className="text-xs opacity-80">New Customer</p>
              <p className="text-base font-bold">+ 38 today</p>
              <div className="flex -space-x-2 mt-2">
                {[0,1,2,3].map((i)=>(<div key={i} className="h-6 w-6 rounded-full border-2 border-white" style={{background:["#E61C83","#F9A349","#16A7E0","#0D7ABD"][i]}}/>))}
              </div>
            </motion.div>
          </div>

          {/* benefits */}
          <div className="grid sm:grid-cols-2 gap-3">
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl p-4 bg-white shadow-soft border border-white hover:shadow-glow transition-shadow"
                >
                  <div className="rounded-xl p-2 w-fit bg-gradient-brand">
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <p className="mt-3 font-bold text-sm" style={{ color: "var(--brand-dark)" }}>{b.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{b.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}