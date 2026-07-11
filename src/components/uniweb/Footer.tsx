import { animate, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Instagram,
  Linkedin,
  Twitter,
  Facebook,
  Youtube,
  MessageCircle,
  MapPin,
  Phone,
  Mail,
  Globe,
  ArrowUp,
  Building2,
} from "lucide-react";
import { Logo } from "./Logo";

function TikTokIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

const socials = [
  { Icon: Facebook, href: "https://www.facebook.com/Uniweb-It-Solutions-592337707835011/", label: "Facebook", color: "#1877F2" },
  { Icon: Instagram, href: "https://www.instagram.com/Uniweb_IT_Solutions/", label: "Instagram", color: "#E4405F" },
  { Icon: Twitter, href: "https://twitter.com/uniweb008", label: "Twitter", color: "#1DA1F2" },
  { Icon: Linkedin, href: "https://www.linkedin.com/company/uniweb-it-solutions/", label: "LinkedIn", color: "#0A66C2" },
  { Icon: Youtube, href: "https://www.youtube.com/channel/UCrf6TZek9ND-u2evvnJ7sRg", label: "YouTube", color: "#FF0000" },
  { Icon: TikTokIcon, href: "https://www.tiktok.com/@uniwebitsolutions?is_from_webapp=1&sender_device=pc", label: "TikTok", color: "#25F4EE" },
];

const contacts = [
  {
    Icon: MapPin,
    label: "Visit us",
    value: "10th Floor, Office No.2, Sama Tower, Kuwait City",
    href: "https://maps.google.com/?q=Sama+Tower+Kuwait+City",
  },
  { Icon: Phone, label: "Call us", value: "+965 6570 2446", href: "tel:+96565702446" },
  { Icon: Mail, label: "Email us", value: "contact@uniwebonline.com", href: "mailto:contact@uniwebonline.com" },
  { Icon: Globe, label: "Language", value: "Bilingual · English / العربية" },
];

const stats = [
  { value: 8, suffix: "", label: "Years in Market" },
  { value: 60, suffix: "+", label: "Happy Clients" },
  { value: 150, suffix: "+", label: "Projects Delivered" },
];

// Animated count-up number that starts when it scrolls into view.
function StatNumber({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.8,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref} className="text-gradient-brand text-3xl sm:text-4xl font-extrabold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      {display}
      {suffix}
    </span>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden text-white" style={{ background: "linear-gradient(160deg,#131C30 0%,#0A0E1A 100%)" }}>
      {/* floating shapes */}
      {[
        { c: "#E61C83", x: "8%", y: "18%", s: 60 },
        { c: "#F9A349", x: "88%", y: "26%", s: 80 },
        { c: "#16A7E0", x: "72%", y: "72%", s: 50 },
        { c: "#0D7ABD", x: "22%", y: "82%", s: 40 },
      ].map((b, i) => (
        <div
          key={i}
          className="animate-float-rotate absolute rounded-2xl opacity-15"
          style={{
            left: b.x,
            top: b.y,
            width: b.s,
            height: b.s,
            background: b.c,
            filter: "blur(2px)",
            animationDuration: `${6 + i}s`,
          }}
        />
      ))}

      {/* gradient hairline at the top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-brand opacity-70" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        {/* stats band — powered by Uniweb IT Solutions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur px-6 py-8 sm:px-10"
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-brand opacity-20 blur-3xl" />
          <div className="grid gap-8 sm:grid-cols-[1.2fr_1fr_1fr_1fr] sm:items-center">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-white/50">
                <Building2 className="h-4 w-4" /> Powered by
              </p>
              <p className="mt-2 text-lg font-extrabold leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Uniweb IT Solutions
              </p>
              <p className="mt-1 text-xs text-white/60">Trusted technology partner since 2018.</p>
            </div>
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.1 }}
                className="text-center sm:border-l sm:border-white/10"
              >
                <StatNumber value={s.value} suffix={s.suffix} />
                <p className="mt-1 text-xs text-white/60">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* main grid */}
        <div className="mt-14 grid gap-12 lg:grid-cols-[1.3fr_1.2fr_0.9fr] lg:gap-14">
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

          {/* contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Get in touch</p>
            <ul className="mt-5 space-y-3">
              {contacts.map(({ Icon, label, value, href }, i) => {
                const row = (
                  <span className="flex items-start gap-3">
                    <span className="rounded-xl bg-white/10 p-2.5 transition-colors group-hover:bg-gradient-brand">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-[11px] uppercase tracking-wider text-white/40">{label}</span>
                      <span className="block text-sm text-white/80 transition-colors group-hover:text-white">{value}</span>
                    </span>
                  </span>
                );
                return (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + i * 0.08 }}
                  >
                    {href ? (
                      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined} className="group block rounded-2xl p-1 -m-1 hover:bg-white/5 transition-colors">
                        {row}
                      </a>
                    ) : (
                      <span className="group block p-1 -m-1">{row}</span>
                    )}
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>

          {/* socials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Follow us</p>
            <div className="mt-5 grid grid-cols-3 gap-2.5 max-w-[13rem]">
              {socials.map(({ Icon, href, label, color }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.06, type: "spring" }}
                  whileHover={{ y: -4, scale: 1.08 }}
                  className="flex aspect-square items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition-colors"
                  style={{ ["--hover-c" as string]: color }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = color; (e.currentTarget as HTMLElement).style.borderColor = "transparent"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ""; (e.currentTarget as HTMLElement).style.borderColor = ""; }}
                >
                  <Icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
            <p className="mt-4 text-xs text-white/40">@Uniweb_IT_Solutions on all platforms</p>
          </motion.div>
        </div>

        {/* bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} UiS Store. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Crafted with <span className="text-base text-[#E61C83]">♥</span> by{" "}
            <a
              href="https://www.linkedin.com/company/uniweb-it-solutions/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-white/70 transition-colors hover:text-white"
            >
              Uniweb IT Solutions
            </a>
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
