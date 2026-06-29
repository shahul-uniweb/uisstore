import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";

export function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [text, setText] = useState("Building Your Online Store...");

  useEffect(() => {
    const t1 = setTimeout(() => setText("Launching E-Commerce Experience"), 1400);
    const t2 = setTimeout(() => setVisible(false), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const blocks = [
    { color: "#E61C83", x: -90, y: -70 },
    { color: "#F9A349", x: 90, y: -60 },
    { color: "#16A7E0", x: -100, y: 70 },
    { color: "#0D7ABD", x: 95, y: 80 },
    { color: "#E61C83", x: 0, y: -110 },
    { color: "#16A7E0", x: 0, y: 110 },
  ];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          style={{ background: "linear-gradient(135deg,#FFF7FB 0%,#F3FBFF 50%,#EEF9FF 100%)" }}
        >
          <motion.div
            className="absolute inset-0 opacity-40"
            style={{ background: "var(--gradient-brand)", backgroundSize: "200% 200%" }}
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <div className="relative flex flex-col items-center gap-8">
            <div className="relative h-48 w-48 flex items-center justify-center">
              {blocks.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 0, rotate: 0, scale: 0 }}
                  animate={{ x: b.x, y: b.y, opacity: 0.9, rotate: 45, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.08, type: "spring", stiffness: 80 }}
                  className="absolute h-6 w-6 rounded-md"
                  style={{ background: b.color, boxShadow: `0 8px 24px ${b.color}55` }}
                />
              ))}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 grid h-28 w-28 place-items-center"
              >
                {/* pulsing glow halo that highlights the logo */}
                <motion.div
                  aria-hidden
                  className="col-start-1 row-start-1 h-full w-full rounded-full blur-2xl"
                  style={{ background: "var(--gradient-brand)" }}
                  animate={{ scale: [0.85, 1.15, 0.85], opacity: [0.45, 0.75, 0.45] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* gently floating logo, no background card */}
                <motion.div
                  className="col-start-1 row-start-1"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  style={{ filter: "drop-shadow(0 10px 30px rgba(230,28,131,0.45))" }}
                >
                  <Logo className="h-24 w-24" />
                </motion.div>
              </motion.div>
            </div>
            <motion.p
              key={text}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-base font-semibold tracking-wide"
              style={{ color: "var(--brand-dark)" }}
            >
              {text}
            </motion.p>
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-2 w-2 rounded-full"
                  style={{ background: ["#E61C83", "#F9A349", "#16A7E0"][i] }}
                  animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}