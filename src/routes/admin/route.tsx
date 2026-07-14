import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { AdminAuthProvider } from "@/components/admin/AdminAuthProvider";

// Layout for everything under /admin. Deliberately has no visual chrome of its
// own (no sidebar) — /admin/login needs a different shell than the dashboard
// pages, so each protected page wraps itself in <AdminShell>. This route only
// provides the shared auth listener and keeps the section out of Google's index.
export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — UiS Store" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <AdminAuthProvider>
      <Outlet />
      <Toaster position="top-right" richColors />
    </AdminAuthProvider>
  );
}
