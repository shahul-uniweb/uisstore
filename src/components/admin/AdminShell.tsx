import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  MapPin,
  FileText,
  Users,
  LogOut,
  Menu as MenuIcon,
  X,
  ShieldAlert,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useAdminAuth } from "./AdminAuthProvider";
import { hasPermission, isSuperAdminEmail, signOutAdmin, MENU_ITEMS, type MenuKey } from "@/lib/admin";
import { Logo } from "@/components/uniweb/Logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const ICONS: Record<MenuKey, typeof LayoutDashboard> = {
  dashboard: LayoutDashboard,
  visits: MapPin,
  forms: FileText,
  users: Users,
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

function FullScreenLoader({ label }: { label?: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#0A0E1A]">
      <Loader2 className="h-6 w-6 animate-spin text-white/60" />
      {label && <p className="text-sm text-white/50">{label}</p>}
    </div>
  );
}

// Signed in with a real Firebase account, but not provisioned with any admin
// access. Shown full-screen instead of an empty panel.
function NotAuthorized({ name, email, onSignOut }: { name: string; email: string; onSignOut: () => void }) {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
      style={{ background: "linear-gradient(160deg,#131C30 0%,#0A0E1A 100%)" }}
    >
      <div className="w-full max-w-md rounded-3xl p-[2px] bg-gradient-brand shadow-glow">
        <div className="rounded-[1.4rem] bg-white px-7 py-9">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-destructive/10">
            <ShieldAlert className="h-7 w-7 text-destructive" />
          </div>
          <h1 className="mt-4 text-xl font-extrabold" style={{ color: "var(--brand-dark)", fontFamily: "'Space Grotesk', sans-serif" }}>
            Account not authorized
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You're signed in as <span className="font-semibold text-foreground">{name}</span> ({email}), but your
            account hasn't been granted access to the admin panel yet.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Please contact a super administrator to enable your access.
          </p>
          <Button onClick={onSignOut} className="mt-6 w-full gap-2 bg-gradient-brand text-white hover:opacity-90">
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}

// Wraps every protected /admin page: redirects to /admin/login when signed out,
// shows an access-denied state when signed in but lacking the page's menu
// permission, and otherwise renders the sidebar shell around `children`.
export function AdminShell({ menu, children }: { menu: MenuKey; children: ReactNode }) {
  const { profile, loading } = useAdminAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !profile) {
      navigate({ to: "/admin/login" });
    }
  }, [loading, profile, navigate]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await signOutAdmin();
    toast.success("Signed out");
    navigate({ to: "/admin/login" });
  };

  // Wait for Firebase Auth AND the Firestore role lookup to finish before
  // deciding what to show — no flash of the panel before roles are known.
  if (loading) return <FullScreenLoader label="Checking your access…" />;
  if (!profile) return <FullScreenLoader />; // redirecting to login

  const allowed = hasPermission(profile, menu);
  const visibleMenus = MENU_ITEMS.filter((m) => hasPermission(profile, m.key));

  // Signed in, but authorized for nothing → not a valid admin yet.
  if (visibleMenus.length === 0) {
    return <NotAuthorized name={profile.name} email={profile.email} onSignOut={handleSignOut} />;
  }

  const nav = (
    <>
      <Link to="/admin" className="flex items-center gap-2.5 px-2">
        <Logo className="h-8 w-8" />
        <div>
          <p className="text-sm font-extrabold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            UiS Store
          </p>
          <p className="text-[10px] text-white/40">Admin Panel</p>
        </div>
      </Link>

      <nav className="mt-8 flex-1 space-y-1">
        {visibleMenus.map((item) => {
          const Icon = ICONS[item.key];
          const active = pathname === item.path;
          return (
            <Link
              key={item.key}
              to={item.path}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span
                className={`grid h-7 w-7 place-items-center rounded-lg ${active ? "bg-gradient-brand" : "bg-white/5"}`}
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-white/10 pt-4">
        <div className="flex items-center gap-2.5 px-2">
          <Avatar className="h-9 w-9 border border-white/10">
            <AvatarFallback className="bg-gradient-brand text-xs font-bold text-white">
              {initials(profile.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-white">{profile.name}</p>
            <p className="truncate text-[10px] text-white/40">
              {isSuperAdminEmail(profile.email) ? "Super Admin" : profile.role}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-white/50 hover:bg-white/10 hover:text-white"
            onClick={handleSignOut}
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
        <Link to="/" className="mt-3 block px-2 text-[11px] text-white/30 hover:text-white/60">
          ← Back to website
        </Link>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-[#F5F7FB] lg:h-screen lg:overflow-hidden">
      {/* desktop sidebar — fixed full-height; it never scrolls, only the content does */}
      <aside
        className="hidden w-64 shrink-0 flex-col p-5 lg:sticky lg:top-0 lg:flex lg:h-screen"
        style={{ background: "linear-gradient(180deg,#131C30 0%,#0A0E1A 100%)" }}
      >
        {nav}
      </aside>

      {/* mobile topbar + slide-over — min-w-0 lets this flex child shrink to the
          viewport so wide tables/maps scroll inside their cards instead of
          pushing the whole page past the screen edge. */}
      <div className="flex w-full min-w-0 flex-1 flex-col lg:hidden">
        <header className="flex items-center justify-between border-b bg-white px-4 py-3">
          <Link to="/admin" className="flex items-center gap-2">
            <Logo className="h-7 w-7" />
            <span className="text-sm font-bold" style={{ color: "var(--brand-dark)" }}>
              Admin Panel
            </span>
          </Link>
          <button
            aria-label="Menu"
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-foreground/70 hover:bg-muted"
          >
            <MenuIcon className="h-5 w-5" />
          </button>
        </header>
        <main className="min-w-0 flex-1 overflow-x-hidden p-4">
          {allowed ? children : <AccessDenied />}
        </main>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/50 lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 26, stiffness: 260 }}
              className="relative flex h-full w-64 flex-col p-5"
              style={{ background: "linear-gradient(180deg,#131C30 0%,#0A0E1A 100%)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-3 z-10 rounded-lg p-1.5 text-white/60 hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
              {nav}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* desktop content — the only scrolling region */}
      <main className="hidden min-w-0 flex-1 overflow-x-hidden p-6 lg:block lg:h-screen lg:overflow-y-auto lg:p-10">
        {allowed ? children : <AccessDenied />}
      </main>
    </div>
  );
}

function AccessDenied() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="rounded-2xl bg-destructive/10 p-4">
        <ShieldAlert className="h-8 w-8 text-destructive" />
      </div>
      <h2 className="mt-4 text-lg font-bold" style={{ color: "var(--brand-dark)" }}>
        Access denied
      </h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        You don't have permission to view this page. Ask a super admin to grant you access from the
        Users menu.
      </p>
    </div>
  );
}
