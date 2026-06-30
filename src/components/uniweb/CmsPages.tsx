import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";

const pages = [
  { title: "About Us", color: "#E61C83" },
  { title: "Contact Us", color: "#F9A349" },
  { title: "Privacy Policy", color: "#16A7E0" },
  { title: "Shipping Information", color: "#0D7ABD" },
  { title: "Returns & Exchange", color: "#E61C83" },
  { title: "Terms & Conditions", color: "#F9A349" },
];

export function CmsPages() {
  return (
    <section className="relative pt-12 pb-8 lg:pt-20 lg:pb-10 overflow-hidden" style={{ background: "linear-gradient(180deg,#EEF9FF 0%,#FFFFFF 100%)" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="CMS Pages" title="Essential Pages Included" subtitle="Pre-built, fully editable pages — ready from day one." />
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pages.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40, rotateX: 30 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -8, rotateX: -3 }}
              className="group rounded-2xl glass shadow-soft overflow-hidden border border-white/60 hover:shadow-glow transition-shadow"
              style={{ perspective: "1000px" }}
            >
              {/* browser bar */}
              <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/40 bg-white/40">
                <span className="h-2.5 w-2.5 rounded-full bg-[#E61C83]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#F9A349]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#16A7E0]" />
                <span className="ml-3 flex-1 truncate text-[10px] text-muted-foreground bg-white/60 rounded-full px-3 py-1">store.com/{p.title.toLowerCase().replace(/[^a-z]+/g, "-")}</span>
              </div>
              <div className="p-5">
                <div className="rounded-xl h-20 mb-3" style={{ background: `linear-gradient(135deg,${p.color}40 0%,#FFFFFF 100%)` }} />
                <p className="font-bold" style={{ color: "var(--brand-dark)" }}>{p.title}</p>
                <div className="mt-3 space-y-1.5">
                  <div className="h-1.5 rounded-full bg-muted w-full" />
                  <div className="h-1.5 rounded-full bg-muted w-5/6" />
                  <div className="h-1.5 rounded-full bg-muted w-2/3 group-hover:w-3/4 transition-all" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}