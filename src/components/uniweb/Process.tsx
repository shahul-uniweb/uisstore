import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { SectionHeader } from "./SectionHeader";
import { Package2, FileText, Code2, Rocket } from "lucide-react";

const steps = [
  { icon: Package2, title: "Choose Your Package", desc: "Pick the plan that fits your business stage and goals.", color: "#E61C83" },
  { icon: FileText, title: "Share Your Requirements", desc: "Tell us about your products, brand and operations.", color: "#F9A349" },
  { icon: Code2, title: "We Design & Develop", desc: "Our team crafts your store — pixel-perfect & blazing fast.", color: "#16A7E0" },
  { icon: Rocket, title: "Launch & Start Selling", desc: "Go live, take orders, grow with confidence.", color: "#0D7ABD" },
];

export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rocketY = useTransform(scrollYProgress, [0, 1], ["0%", "90%"]);
  const lineHeight = useTransform(scrollYProgress, [0.1, 0.85], ["0%", "100%"]);

  return (
    <section id="process" className="relative py-12 lg:py-20 overflow-hidden" style={{ background: "linear-gradient(180deg,#FFFFFF 0%,#EEF9FF 100%)" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Our Process" title="From Idea to Online Store" subtitle="A clear path from kickoff to launch — guided by experts." />

        <div ref={ref} className="mt-16 relative max-w-3xl mx-auto">
          {/* path */}
          <div className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 rounded-full bg-muted overflow-hidden">
            <motion.div className="w-full bg-gradient-brand rounded-full" style={{ height: lineHeight }} />
          </div>
          {/* rocket */}
          <motion.div
            className="absolute left-8 sm:left-1/2 -translate-x-1/2 z-20"
            style={{ top: rocketY }}
          >
            <div className="rounded-full p-2.5 bg-gradient-brand shadow-glow animate-pulse-glow">
              <Rocket className="h-5 w-5 text-white -rotate-45" />
            </div>
          </motion.div>

          <div className="space-y-12">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const left = i % 2 === 0;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: left ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.6 }}
                  className={`relative flex items-start gap-5 sm:gap-8 pl-20 sm:pl-0 ${left ? "sm:justify-start" : "sm:justify-end sm:flex-row-reverse"}`}
                >
                  <div className={`sm:w-1/2 ${left ? "sm:pr-12 sm:text-right" : "sm:pl-12"}`}>
                    <div className="rounded-2xl p-5 bg-white shadow-soft border border-white">
                      <span className="text-xs font-bold" style={{ color: s.color }}>STEP {i + 1}</span>
                      <h3 className="mt-1 text-lg font-bold" style={{ color: "var(--brand-dark)" }}>{s.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                    </div>
                  </div>
                  {/* node */}
                  <div className="absolute left-8 sm:left-1/2 top-5 -translate-x-1/2 z-10">
                    <motion.div whileInView={{ scale: [0, 1.2, 1] }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="rounded-full p-2.5 shadow-glow" style={{ background: s.color }}>
                      <Icon className="h-5 w-5 text-white" />
                    </motion.div>
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