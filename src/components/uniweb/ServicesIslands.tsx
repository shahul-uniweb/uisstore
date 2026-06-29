import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import { Globe, Server, Lock, LifeBuoy, Search, GraduationCap, KeyRound, Cloud } from "lucide-react";

const services = [
  { icon: Globe, label: "Domain Registration", note: "1 Year", color: "#E61C83" },
  { icon: Server, label: "Web Hosting", note: "1 Year", color: "#F9A349" },
  { icon: Lock, label: "SSL Certificate", note: "Always-on HTTPS", color: "#16A7E0" },
  { icon: LifeBuoy, label: "Technical Support", note: "Real humans", color: "#0D7ABD" },
  { icon: Search, label: "Basic SEO Setup", note: "Get found", color: "#E61C83" },
  { icon: GraduationCap, label: "Website Training", note: "Be self-sufficient", color: "#F9A349" },
  { icon: KeyRound, label: "Admin Access", note: "Full control", color: "#16A7E0" },
];

export function ServicesIslands() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden" style={{ background: "#FFFFFF" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Included Services" title="Services Included with Your Store" subtitle="Everything you need to go live — bundled in, no scavenger hunt." />

        <div className="mt-16 relative">
          {/* center cloud */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex-col items-center pointer-events-none">
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-brand blur-2xl opacity-60" />
              <div className="relative rounded-3xl p-6 bg-gradient-blue shadow-glow">
                <Cloud className="h-12 w-12 text-white" />
              </div>
            </motion.div>
            <p className="mt-3 font-bold" style={{ color: "var(--brand-dark)" }}>Uniweb Cloud</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 60, x: i % 2 ? 30 : -30 }}
                  whileInView={{ opacity: 1, y: 0, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: i * 0.08, type: "spring", stiffness: 80 }}
                  whileHover={{ y: -8, rotate: -2 }}
                  className="relative rounded-3xl p-5 bg-white border border-white shadow-soft hover:shadow-glow transition-shadow"
                  style={{ background: `linear-gradient(135deg,#fff 0%, ${s.color}10 100%)` }}
                >
                  <motion.div
                    animate={{ y: [0, -6, 0] }} transition={{ duration: 3 + i*0.2, repeat: Infinity }}
                    className="rounded-2xl p-3 w-fit"
                    style={{ background: s.color, boxShadow: `0 12px 30px -8px ${s.color}80` }}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </motion.div>
                  <p className="mt-4 text-base font-bold" style={{ color: "var(--brand-dark)" }}>{s.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.note}</p>
                  <div className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${s.color}15`, color: s.color }}>
                    Included
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}