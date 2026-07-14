import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

export const faqs = [
  { q: "How much does an e-commerce website cost in Kuwait?", a: "UiS Store packages start at just 250 K.D per year for the Starter package, 450 K.D for Basic and 850 K.D for Advanced, with custom pricing for Premium. Every package includes hosting, domain, SSL certificate, delivery integration and 0% commission on your sales." },
  { q: "What is UiS Store?", a: "UiS Store is a white-label e-commerce platform for building online stores in Kuwait and the GCC. It is a product of Uniweb IT Solutions, a Kuwait-based technology company with 8 years in the market, 60+ clients and 150+ delivered projects." },
  { q: "Do you build online stores in Arabic?", a: "Yes — every UiS Store package includes a fully bilingual English & Arabic online store with RTL support, built for customers in Kuwait and across the GCC." },
  { q: "Which payment gateways do you support in Kuwait?", a: "We integrate KNET, Visa, MasterCard and other regional payment gateways. The Basic package includes 1 gateway, Advanced includes 2, and Premium supports multiple custom gateways." },
  { q: "Do you deliver outside Kuwait?", a: "Yes. All packages include delivery management with GCC countries delivery — Saudi Arabia, UAE, Qatar, Bahrain and Oman — so your online store can sell across the Gulf." },
  { q: "Is hosting, domain and SSL included?", a: "Yes — one year of web hosting, domain registration and an SSL certificate are included in every package, along with technical support and website training." },
  { q: "Do you provide a POS system or store management app?", a: "Yes — the Premium package includes a Point of Sales (P.O.S) system and a dedicated Store Management App, ideal for retail businesses in Kuwait that sell in-store and online." },
  { q: "Can I upgrade my package later?", a: "Yes — you can upgrade from Basic to Advanced or Premium at any time and we'll migrate your online store seamlessly, with no downtime and no data loss." },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative py-12 lg:py-20 overflow-hidden" style={{ background: "linear-gradient(180deg,#FFF7FB 0%,#F3FBFF 100%)" }}>
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