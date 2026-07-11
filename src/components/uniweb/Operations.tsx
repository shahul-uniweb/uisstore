import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import { CreditCard, Lock, Truck, MapPin, Package, Boxes } from "lucide-react";

const panels = [
  {
    title: "Secure Payments",
    desc: "KNET, Visa, MasterCard and more — checkout that just works.",
    bg: "linear-gradient(135deg,#E61C83 0%,#F9A349 100%)",
    icon: CreditCard,
    visual: "payment",
  },
  {
    title: "Delivery Integration",
    desc: "Order tracking, shipping status and live courier updates.",
    bg: "linear-gradient(135deg,#0D7ABD 0%,#16A7E0 100%)",
    icon: Truck,
    visual: "delivery",
  },
  {
    title: "Inventory Management",
    desc: "Real-time stock, categories and product variants.",
    bg: "linear-gradient(135deg,#16A7E0 0%,#E61C83 100%)",
    icon: Boxes,
    visual: "inventory",
  },
];

export function Operations() {
  return (
    <section className="relative py-12 lg:py-20 overflow-hidden" style={{ background: "linear-gradient(180deg,#FFFFFF 0%,#FFFFFF 50%,#EEF9FF 100%)" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Operations" title="Built for Real E-Commerce Operations" subtitle="The behind-the-scenes essentials, handled beautifully — so you can focus on selling." />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {panels.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.15, duration: 0.7 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative rounded-3xl overflow-hidden p-7 text-white shadow-glow"
                style={{ background: p.bg }}
              >
                {/* floating particles */}
                {[0,1,2].map((j) => (
                  <span
                    key={j}
                    className="animate-twinkle absolute h-2 w-2 rounded-full bg-white/40"
                    style={{
                      top: `${20 + j*25}%`,
                      left: `${10 + j*30}%`,
                      animationDuration: `${3 + j}s`,
                      animationDelay: `${j * 0.3}s`,
                    }}
                  />
                ))}
                <div className="min-h-[128px]">
                  <Icon className="h-8 w-8 mb-4" />
                  <h3 className="text-xl font-bold">{p.title}</h3>
                  <p className="mt-2 text-sm text-white/85">{p.desc}</p>
                </div>

                <div className="mt-6 flex flex-col justify-center rounded-2xl bg-white/15 backdrop-blur-md p-4 border border-white/20 min-h-[150px]">
                  {p.visual === "payment" && <PaymentVisual />}
                  {p.visual === "delivery" && <DeliveryVisual />}
                  {p.visual === "inventory" && <InventoryVisual />}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PaymentVisual() {
  return (
    <div className="space-y-2">
      <motion.div whileHover={{ y: -3 }} className="rounded-xl p-3 bg-white text-foreground flex items-center gap-2">
        <div className="h-7 w-10 rounded bg-gradient-warm" />
        <div className="flex-1">
          <p className="text-xs font-bold">•••• 4242</p>
          <p className="text-[10px] text-muted-foreground">KWD 24.500</p>
        </div>
        <Lock className="h-4 w-4 text-emerald-600" />
      </motion.div>
      <div className="animate-pulse-scale text-center text-xs font-bold py-2 rounded-lg bg-emerald-400/30 border border-emerald-300/50" style={{ animationDuration: "2s" }}>
        ✓ Payment Successful
      </div>
    </div>
  );
}
function DeliveryVisual() {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span>Order #1284</span>
        <span className="font-bold">Out for delivery</span>
      </div>
      <div className="mt-3 relative h-2 rounded-full bg-white/20">
        {/* progress fill */}
        <div className="animate-delivery-fill h-full rounded-full bg-white" />
        {/* truck rides the tip of the fill (same timing = stays connected) */}
        <div className="animate-delivery-truck absolute top-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="animate-truck-bob flex items-center justify-center rounded-full bg-white p-1 shadow-md">
            <Truck className="h-3 w-3" style={{ color: "#0D7ABD" }} />
          </span>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs bg-white/15 rounded-lg p-2">
        <MapPin className="h-3.5 w-3.5" />
        <span>2.4 km away · 12 min</span>
      </div>
    </div>
  );
}
function InventoryVisual() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {[
        { n: "Shoes", v: 124 },
        { n: "Bags", v: 56 },
        { n: "Tees", v: 230 },
      ].map((p, i) => (
        <motion.div key={i} whileHover={{ y: -3 }} className="rounded-lg p-2 bg-white/15 text-center">
          <Package className="h-4 w-4 mx-auto mb-1" />
          <p className="text-[10px]">{p.n}</p>
          <p className="text-sm font-bold">{p.v}</p>
        </motion.div>
      ))}
    </div>
  );
}