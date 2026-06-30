import { motion } from "framer-motion";
import { Instagram, Linkedin, Twitter, MessageCircle, MapPin, Globe, ArrowUp } from "lucide-react";
import { Logo } from "./Logo";

const socials = [
  { Icon: Instagram, href: "#", label: "Instagram" },
  { Icon: Linkedin, href: "#", label: "LinkedIn" },
  { Icon: Twitter, href: "#", label: "Twitter" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden text-white" style={{ background: "linear-gradient(160deg,#131C30 0%,#0A0E1A 100%)" }}>
      {/* floating shapes (kept) */}
      {[
        { c: "#E61C83", x: "10%", y: "20%", s: 60 },
        { c: "#F9A349", x: "85%", y: "30%", s: 80 },
        { c: "#16A7E0", x: "70%", y: "70%", s: 50 },
        { c: "#E61C83", x: "25%", y: "80%", s: 40 },
      ].map((b, i) => (
        <motion.div key={i} className="absolute rounded-2xl opacity-20" style={{ left: b.x, top: b.y, width: b.s, height: b.s, background: b.c, filter: "blur(2px)" }} animate={{ y: [0, -15, 0], rotate: [0, 45, 0] }} transition={{ duration: 6 + i, repeat: Infinity }} />
      ))}

      {/* gradient hairline at the top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-brand opacity-70" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
          {/* brand + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3">
              <Logo className="h-12 w-12" />
              <div>
                <p className="text-xl font-extrabold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>UiS Store</p>
                <p className="text-xs text-white/60">E-Commerce Packages</p>
              </div>
            </div>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/70">
              Mobile-first, white-label e-commerce websites designed to launch fast and scale beautifully — built for ambitious brands in Kuwait &amp; beyond.
            </p>
            <a
              href="https://wa.me/message/W47MG2LLOHCBJ1"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-warm px-6 py-3 text-sm font-bold text-white shadow-glow transition-transform hover:scale-105"
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
              <ArrowUp className="h-4 w-4 rotate-45 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </motion.div>

          {/* contact + socials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:justify-self-end"
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Get in touch</p>
            <ul className="mt-4 space-y-3 text-sm text-white/75">
              <li className="flex items-center gap-3">
                <span className="rounded-lg bg-white/10 p-2"><MapPin className="h-4 w-4" /></span>
                Kuwait City, Kuwait
              </li>
              <li className="flex items-center gap-3">
                <span className="rounded-lg bg-white/10 p-2"><Globe className="h-4 w-4" /></span>
                Bilingual · English / العربية
              </li>
            </ul>

            <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-white/50">Follow us</p>
            <div className="mt-4 flex gap-2.5">
              {socials.map(({ Icon, href, label }, i) => (
                <a
                  key={i}
                  href={href}
                  aria-label={label}
                  className="rounded-xl border border-white/10 bg-white/5 p-2.5 transition-all hover:scale-110 hover:border-transparent hover:bg-gradient-brand"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} UiS Store. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Crafted with <span className="text-base text-[#E61C83]">♥</span> for ambitious brands.
          </p>
          <a
            href="#home"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 transition hover:bg-white/10"
          >
            Back to top <ArrowUp className="h-3 w-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}
