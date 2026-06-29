import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

const faqs = [
  { q: "Which package is best for startups?", a: "The Basic package is built specifically for startups — up to 500 products, English store, 1 payment gateway and everything you need to launch." },
  { q: "Do you support Arabic language stores?", a: "Yes — Advanced and Premium packages include full English & Arabic bilingual experiences with RTL support." },
  { q: "Can payment gateways be integrated?", a: "Absolutely. KNET, Visa, MasterCard and other regional gateways are supported." },
  { q: "Is delivery integration included?", a: "Yes — Basic ships with standard delivery integration; Advanced and Premium support advanced and custom courier integrations." },
  { q: "Can I upgrade my product limit later?", a: "Yes — upgrade your package at any time and we'll migrate your store seamlessly." },
  { q: "Is hosting included?", a: "All packages include 1 year of web hosting, domain registration and SSL certificate." },
  { q: "Do you provide technical support?", a: "Yes — every package comes with technical support: 1, 3 or 6 months depending on the plan." },
  { q: "Can I request custom features?", a: "Premium packages are fully custom — share your requirements and we'll quote a tailored build." },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative py-20 lg:py-28 overflow-hidden" style={{ background: "linear-gradient(180deg,#FFF7FB 0%,#F3FBFF 100%)" }}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="FAQ" title="Questions Before You Start?" subtitle="Answers to the most common questions about our packages." />
        <div className="mt-12 space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                className="rounded-2xl p-[1.5px]"
                style={{ background: isOpen ? "var(--gradient-brand)" : "rgba(255,255,255,0.6)" }}
              >
                <div className="rounded-2xl glass overflow-hidden">
                  <button onClick={() => setOpen(isOpen ? null : i)} className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left">
                    <span className="font-semibold text-sm sm:text-base" style={{ color: "var(--brand-dark)" }}>{f.q}</span>
                    <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.3 }} className="rounded-full p-1.5 bg-gradient-brand shrink-0">
                      <Plus className="h-4 w-4 text-white" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                        <p className="px-5 pb-5 text-sm text-muted-foreground">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}