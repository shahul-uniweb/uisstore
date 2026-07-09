import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { X, Phone, User, MessageCircle, Sparkles } from "lucide-react";
import { Logo } from "./Logo";

const WHATSAPP_NUMBER = "96565702446";
const STORAGE_KEY = "uis-lead-popup-shown";
// LoadingScreen fades out at ~2.6s — give the hero a moment before the popup.
const SHOW_DELAY_MS = 4200;

export function LeadPopup() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("+965 ");
  const [error, setError] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  // lock page scroll + close on Escape while open
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    sessionStorage.setItem(STORAGE_KEY, "1");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = mobile.replace(/\D/g, "");
    if (digits.length < 8 || digits.length > 15) {
      setError("Please enter a valid mobile number");
      return;
    }
    const msg =
      `Hello UiS Store! 👋\n\n` +
      `I'd like to know more about your e-commerce packages.\n\n` +
      `Name: ${name.trim() || "—"}\n` +
      `Mobile: ${mobile.trim()}\n\n` +
      `Please contact me back.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
    close();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="relative w-full max-w-md rounded-3xl p-[2px] bg-gradient-brand animate-gradient shadow-glow"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative overflow-hidden rounded-[1.4rem] bg-white px-6 py-8 sm:px-8">
              {/* soft decorative blobs */}
              <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full opacity-20 blur-2xl" style={{ background: "var(--gradient-warm)" }} />
              <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full opacity-20 blur-2xl" style={{ background: "var(--gradient-blue)" }} />

              <button
                aria-label="Close"
                onClick={close}
                className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="relative">
                <div className="flex items-center gap-3">
                  <Logo className="h-11 w-11" />
                  <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold" style={{ background: "#FFF7FB", color: "var(--brand-magenta)" }}>
                    <Sparkles className="h-3 w-3" /> Free Consultation
                  </span>
                </div>

                <h3
                  className="mt-4 text-2xl font-extrabold tracking-tight"
                  style={{ color: "var(--brand-dark)", fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Get Your Online Store <span className="text-gradient-brand">Plan</span>
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Share your mobile number and our team will reach out with the perfect package for your business.
                </p>

                <form onSubmit={submit} className="mt-6 space-y-3">
                  <div className="relative">
                    <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full rounded-full border border-input bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-[var(--brand-sky)]"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => {
                        setMobile(e.target.value);
                        setError("");
                      }}
                      placeholder="+965 XXXX XXXX"
                      required
                      className="w-full rounded-full border border-input bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-[var(--brand-sky)]"
                    />
                  </div>
                  {error && <p className="px-2 text-xs font-semibold text-destructive">{error}</p>}

                  <button
                    type="submit"
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-brand animate-gradient px-6 py-3.5 text-sm font-bold text-white shadow-glow transition-transform hover:scale-[1.02] active:scale-95"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Request a Callback
                  </button>
                </form>

                <button
                  onClick={close}
                  className="mt-3 w-full text-center text-xs font-medium text-muted-foreground transition hover:text-foreground"
                >
                  Maybe later
                </button>

                <p className="mt-3 text-center text-[10px] text-muted-foreground/70">
                  We'll only use your number to contact you about your store. No spam.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
