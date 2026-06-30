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
    <section className="relative py-12 lg:py-20 overflow-hidden" style={{ background: "linear-gradient(180deg,#FFF7FB 0%,#FFFFFF 50%,#FFF7FB 100%)" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Included Services" title="Services Included with Your Store" subtitle="Everything you need to go live — bundled in, no scavenger hunt." />

        <div className="mt-12 lg:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                whileHover={{ y: -6 }}
                className="group relative rounded-3xl border border-white p-5 shadow-soft transition-shadow hover:shadow-glow"
                style={{ background: `linear-gradient(135deg,#ffffff 0%, ${s.color}12 100%)` }}
              >
                <motion.div
                  animate={{ y: [0, -6] }}
                  transition={{ duration: 3 + (i % 3) * 0.4, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: i * 0.15 }}
                  className="w-fit rounded-2xl p-3 transition-transform group-hover:scale-110"
                  style={{ background: s.color, boxShadow: `0 12px 30px -8px ${s.color}80`, willChange: "transform" }}
                >
                  <Icon className="h-6 w-6 text-white" />
                </motion.div>
                <p className="mt-4 text-base font-bold" style={{ color: "var(--brand-dark)" }}>{s.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.note}</p>
                <div
                  className="absolute right-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-bold"
                  style={{ background: `${s.color}15`, color: s.color }}
                >
                  Included
                </div>
              </motion.div>
            );
          })}

          {/* UiS Store Cloud — featured hub card fills the 8th slot */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.42, duration: 0.5 }}
            whileHover={{ y: -6 }}
            className="relative flex flex-col justify-center overflow-hidden rounded-3xl p-5 text-white shadow-glow"
            style={{ background: "var(--gradient-blue)" }}
          >
            <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/20 blur-2xl" />
            <motion.div
              animate={{ y: [0, -6] }}
              transition={{ duration: 4, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
              className="w-fit rounded-2xl bg-white/20 p-3 backdrop-blur"
              style={{ willChange: "transform" }}
            >
              <Cloud className="h-6 w-6 text-white" />
            </motion.div>
            <p className="mt-4 text-base font-bold">UiS Store Cloud</p>
            <p className="mt-1 text-xs text-white/80">All your services, managed in one place.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}