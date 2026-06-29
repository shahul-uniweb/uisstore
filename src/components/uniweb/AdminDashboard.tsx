import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import { LayoutGrid, Package, Users, ShoppingBag, Ticket, Shield, Image as ImageIcon, Bell, TrendingUp } from "lucide-react";

const widgets = [
  { icon: LayoutGrid, label: "Categories", color: "#E61C83" },
  { icon: Package, label: "Products", color: "#F9A349" },
  { icon: Users, label: "Customers", color: "#16A7E0" },
  { icon: ShoppingBag, label: "Orders", color: "#0D7ABD" },
  { icon: Ticket, label: "Coupons", color: "#E61C83" },
  { icon: Shield, label: "Roles & Privileges", color: "#F9A349" },
  { icon: ImageIcon, label: "Banners", color: "#16A7E0" },
  { icon: Bell, label: "Notifications", color: "#0D7ABD" },
  { icon: TrendingUp, label: "Sales Tracking", color: "#E61C83" },
];

export function AdminDashboard() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden" style={{ background: "linear-gradient(180deg,#F3FBFF 0%,#FFF7FB 100%)" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Admin Control" title="Powerful Admin Panel to Manage Everything" subtitle="A complete back office for running your store — from products to promotions." />
        <div className="mt-14" style={{ perspective: "1400px" }}>
          <motion.div
            initial={{ opacity: 0, y: 80, rotateX: 30 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 8 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1 }}
            className="relative mx-auto max-w-5xl rounded-3xl p-1 bg-gradient-brand shadow-glow"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="rounded-[1.4rem] bg-white p-5 sm:p-8">
              {/* fake top bar */}
              <div className="flex items-center justify-between pb-5 border-b">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#E61C83]" />
                  <span className="h-3 w-3 rounded-full bg-[#F9A349]" />
                  <span className="h-3 w-3 rounded-full bg-[#16A7E0]" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground">store.uisstore.app/admin</span>
                <span className="text-xs font-bold text-[var(--brand-deep)]">Live</span>
              </div>
              {/* widgets grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
                {widgets.map((w, i) => {
                  const Icon = w.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 30, scale: 0.9 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.06 }}
                      whileHover={{ y: -6, rotateX: 5, rotateY: -5 }}
                      className="rounded-2xl p-4 border bg-white hover:shadow-soft transition-shadow"
                      style={{ borderColor: `${w.color}30` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="rounded-xl p-2.5" style={{ background: `${w.color}15` }}>
                          <Icon className="h-5 w-5" style={{ color: w.color }} />
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${w.color}15`, color: w.color }}>
                          Active
                        </span>
                      </div>
                      <p className="mt-3 text-sm font-bold">{w.label}</p>
                      <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }} whileInView={{ width: `${60 + (i*5)%40}%` }} viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.5 + i*0.06 }}
                          className="h-full"
                          style={{ background: w.color }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              {/* sales chart */}
              <div className="mt-5 rounded-2xl p-5 bg-gradient-to-br from-[var(--soft-blue)] to-[var(--soft-pink)]">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Sales</p>
                    <p className="text-2xl font-extrabold">KWD 12,480</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600">+24.5%</span>
                </div>
                <div className="flex items-end gap-1.5 h-20">
                  {[40, 65, 50, 80, 60, 90, 75, 100, 85, 95, 70, 100].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }} whileInView={{ height: `${h}%` }} viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.5 + i * 0.04 }}
                      className="flex-1 rounded-t"
                      style={{ background: i % 2 ? "var(--gradient-blue)" : "var(--gradient-warm)" }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* floating notif */}
            <motion.div
              initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 1 }}
              className="absolute -top-4 -right-2 sm:-right-6 glass rounded-2xl p-3 shadow-glow flex items-center gap-2 max-w-[200px]"
            >
              <div className="rounded-full p-1.5 bg-gradient-brand">
                <Bell className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold">New Order</p>
                <p className="text-[10px] text-muted-foreground">#1284 · KWD 32</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}