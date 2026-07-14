import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { X, Phone, User, Sparkles, Gift, Clock, Check, Send } from "lucide-react";
import { Logo } from "./Logo";
import { getBrowserLocation, getIpLocation, saveLead } from "@/lib/firebase";
import { onOpenLeadForm } from "@/lib/lead-form";

// Auto-appears this long after load, on EVERY visit/refresh (no once-per-browser
// gate) — the form is meant to be permanent. It can also be opened on demand by
// any CTA via openLeadForm().
const SHOW_DELAY_MS = 3400;

// Capture IP + GPS location and persist the lead to Firestore in the background.
async function captureAndSaveLead(name: string, mobile: string) {
  const [ipLocation, browserGeo] = await Promise.all([getIpLocation(), getBrowserLocation()]);
  await saveLead({ name, mobile, ipLocation, browserGeo });
}

export function LeadPopup() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("+965 ");
  const [error, setError] = useState("");

  // auto-show after the loading screen, every visit
  useEffect(() => {
    const t = setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  // open on demand from any CTA
  useEffect(() => {
    return onOpenLeadForm(() => {
      setSubmitted(false);
      setOpen(true);
    });
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
    // reset back to the form for the next time it opens
    setTimeout(() => setSubmitted(false), 300);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = mobile.replace(/\D/g, "");
    if (digits.length < 8 || digits.length > 15) {
      setError("Please enter a valid mobile number");
      return;
    }
    // Save to Firestore in the background; show the success state immediately.
    void captureAndSaveLead(name.trim(), mobile.trim());
    setSubmitted(true);
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
                className="absolute right-4 top-4 z-10 rounded-full p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <SuccessState key="success" name={name.trim()} onClose={close} />
                ) : (
                  <FormState
                    key="form"
                    name={name}
                    mobile={mobile}
                    error={error}
                    setName={setName}
                    setMobile={setMobile}
                    setError={setError}
                    onSubmit={submit}
                    onClose={close}
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function FormState({
  name,
  mobile,
  error,
  setName,
  setMobile,
  setError,
  onSubmit,
  onClose,
}: {
  name: string;
  mobile: string;
  error: string;
  setName: (v: string) => void;
  setMobile: (v: string) => void;
  setError: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="relative"
    >
      <div className="flex items-center gap-3">
        <Logo className="h-11 w-11" />
        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold" style={{ background: "#FFF7FB", color: "#C01368" }}>
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

      {/* limited-time discount incentive */}
      <div
        className="mt-4 flex items-center gap-2.5 rounded-2xl px-4 py-3 text-white shadow-glow"
        style={{ background: "var(--gradient-warm)" }}
      >
        <Gift className="h-5 w-5 shrink-0" />
        <p className="text-xs font-bold leading-tight">
          🎉 First 10 customers get an exclusive discount — be one of them!
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-4 space-y-3">
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
          <Send className="h-4 w-4" />
          Request a Callback
        </button>
      </form>

      <button
        onClick={onClose}
        className="mt-3 w-full text-center text-xs font-medium text-muted-foreground transition hover:text-foreground"
      >
        Maybe later
      </button>

      <p className="mt-3 text-center text-[10px] text-muted-foreground/70">
        We'll only use your number to contact you about your store. No spam.
      </p>
    </motion.div>
  );
}

function SuccessState({ name, onClose }: { name: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative flex flex-col items-center py-4 text-center"
    >
      {/* animated success badge with expanding rings + confetti */}
      <div className="relative mb-6 mt-2 grid h-24 w-24 place-items-center">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute inset-0 rounded-full"
            style={{ border: "2px solid var(--brand-magenta)" }}
            initial={{ scale: 0.6, opacity: 0.5 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.5, ease: "easeOut" }}
          />
        ))}
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
          className="grid h-20 w-20 place-items-center rounded-full bg-gradient-brand shadow-glow"
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.35, type: "spring", stiffness: 300 }}
          >
            <Check className="h-10 w-10 text-white" strokeWidth={3} />
          </motion.span>
        </motion.div>
        {/* confetti dots */}
        {[...Array(8)].map((_, i) => (
          <motion.span
            key={`c${i}`}
            className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full"
            style={{ background: ["#E61C83", "#F9A349", "#16A7E0", "#0D7ABD"][i % 4] }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0.5],
              x: Math.cos((i / 8) * Math.PI * 2) * 60,
              y: Math.sin((i / 8) * Math.PI * 2) * 60,
            }}
            transition={{ duration: 1, delay: 0.4 + i * 0.03, ease: "easeOut" }}
          />
        ))}
      </div>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-extrabold tracking-tight"
        style={{ color: "var(--brand-dark)", fontFamily: "'Space Grotesk', sans-serif" }}
      >
        Thank You{name ? `, ${name.split(" ")[0]}` : ""}! <span className="text-gradient-brand">🎉</span>
      </motion.h3>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="mt-4 flex items-center gap-2.5 rounded-2xl border px-4 py-3"
        style={{ borderColor: "var(--brand-sky)", background: "#F3FBFF" }}
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-blue">
          <Clock className="h-4 w-4 text-white" />
        </span>
        <p className="text-left text-sm font-semibold" style={{ color: "var(--brand-dark)" }}>
          Our Relationship Manager will contact you within{" "}
          <span className="text-gradient-brand">48 hours</span>.
        </p>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-3 text-xs text-muted-foreground"
      >
        We've received your request and can't wait to help you launch your online store.
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        onClick={onClose}
        className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-brand animate-gradient px-8 py-3 text-sm font-bold text-white shadow-glow transition-transform hover:scale-[1.03] active:scale-95"
      >
        Done
      </motion.button>
    </motion.div>
  );
}
