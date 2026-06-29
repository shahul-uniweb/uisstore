import { motion } from "framer-motion";
import { Instagram, Linkedin, Twitter, MessageCircle } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="relative overflow-hidden text-white" style={{ background: "linear-gradient(135deg,#0D7ABD 0%,#101828 100%)" }}>
      {/* floating shapes */}
      {[
        { c: "#E61C83", x: "10%", y: "20%", s: 60 },
        { c: "#F9A349", x: "85%", y: "30%", s: 80 },
        { c: "#16A7E0", x: "70%", y: "70%", s: 50 },
        { c: "#E61C83", x: "25%", y: "80%", s: 40 },
      ].map((b, i) => (
        <motion.div key={i} className="absolute rounded-2xl opacity-20" style={{ left: b.x, top: b.y, width: b.s, height: b.s, background: b.c, filter: "blur(2px)" }} animate={{ y: [0, -15, 0], rotate: [0, 45, 0] }} transition={{ duration: 6 + i, repeat: Infinity }} />
      ))}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <div className="rounded-xl bg-white/10 p-1.5 backdrop-blur">
                <Logo className="h-9 w-9" />
              </div>
              <div>
                <p className="font-extrabold text-lg">Uniweb IT Solutions</p>
                <p className="text-xs text-white/70">E-Commerce Packages</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-white/70 max-w-sm">Mobile-first white-label e-commerce websites designed to launch fast and scale beautifully.</p>
            <a href="https://wa.me/" className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white bg-gradient-warm shadow-glow hover:scale-105 transition-transform">
              <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
            </a>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-3">Quick Links</p>
            <ul className="space-y-2 text-sm">
              {["Features","Packages","Process","Why Uniweb","FAQ"].map((l) => (
                <li key={l}><a href={`#${l.toLowerCase().replace(/\s/g,"")}`} className="text-white/80 hover:text-white">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-3">Connect</p>
            <div className="flex gap-2">
              {[Instagram, Linkedin, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="rounded-xl p-2.5 bg-white/10 hover:bg-white/20 transition">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            <p className="mt-5 text-xs text-white/60">Kuwait · Bilingual EN/AR</p>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/60">
          <p>© {new Date().getFullYear()} Uniweb IT Solutions. All rights reserved.</p>
          <p>Crafted with ♥ for ambitious brands.</p>
        </div>
      </div>
    </footer>
  );
}