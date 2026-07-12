import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";

const links = [
  { label: "Home", href: "#home" },
  { label: "Feature", href: "#features" },
  { label: "Packages", href: "#packages" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-soft" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <a href="#home" className="flex items-center gap-2">
            <Logo className="h-9 w-9" />
            <span
              className="text-xl font-bold tracking-tight"
              style={{ color: "var(--brand-dark)", fontFamily: "'Space Grotesk', sans-serif" }}
            >
              UiS Store
            </span>
          </a>
          <nav className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="group relative px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition"
              >
                {l.label}
                <span className="absolute bottom-1 left-3 right-3 h-0.5 scale-x-0 origin-left bg-gradient-brand transition-transform group-hover:scale-x-100" />
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="#packages"
              className="hidden sm:inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold text-white bg-gradient-brand animate-gradient shadow-glow hover:scale-105 transition-transform"
            >
              Get Started
            </a>
            <button
              aria-label="Menu"
              className="lg:hidden p-2 rounded-lg glass"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden glass border-t"
          >
            <div className="p-4 flex flex-col gap-1">
              {links.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="px-4 py-3 rounded-xl text-base font-medium hover:bg-white/60"
                >
                  {l.label}
                </motion.a>
              ))}
              <a
                href="#packages"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex justify-center items-center rounded-full px-5 py-3 text-base font-semibold text-white bg-gradient-brand animate-gradient shadow-glow"
              >
                Get Started
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}