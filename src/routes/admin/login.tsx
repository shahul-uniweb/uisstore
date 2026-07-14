import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lock, Mail, LogIn, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { signInAdmin, sendAdminPasswordReset, bootstrapSuperAdmin, isSuperAdminEmail } from "@/lib/admin";
import { Logo } from "@/components/uniweb/Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function firebaseAuthErrorMessage(err: unknown): string {
  const code = (err as { code?: string })?.code ?? "";
  if (code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found")) {
    return "Incorrect email or password.";
  }
  if (code.includes("too-many-requests")) return "Too many attempts. Try again in a few minutes.";
  if (code.includes("user-disabled")) return "This account has been disabled.";
  return "Sign in failed. Please try again.";
}

function isNoSuchAccount(err: unknown): boolean {
  const code = (err as { code?: string })?.code ?? "";
  return code.includes("user-not-found") || code.includes("invalid-credential");
}

function AdminLogin() {
  const { profile, loading } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [offerBootstrap, setOfferBootstrap] = useState(false);

  useEffect(() => {
    if (!loading && profile) navigate({ to: "/admin" });
  }, [loading, profile, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOfferBootstrap(false);
    setSubmitting(true);
    try {
      await signInAdmin(email.trim(), password);
      navigate({ to: "/admin" });
    } catch (err) {
      if (isNoSuchAccount(err) && isSuperAdminEmail(email.trim())) {
        // Could be a first-ever sign-in for a permanent super admin, or just a
        // typo'd password on an existing account — offer setup either way,
        // and bootstrapSuperAdmin below reports "already exists" if it is one.
        setOfferBootstrap(true);
        setError("");
      } else {
        setError(firebaseAuthErrorMessage(err));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const runBootstrap = async () => {
    if (password.length < 6) {
      setError("Choose a password with at least 6 characters, then try again.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await bootstrapSuperAdmin(email.trim(), password);
      toast.success("Super admin account created");
      navigate({ to: "/admin" });
    } catch (err) {
      const code = (err as { code?: string })?.code ?? "";
      if (code.includes("email-already-in-use")) {
        setError("An account already exists for this email — check your password, or use Forgot password.");
        setOfferBootstrap(false);
      } else {
        setError("Couldn't create the account. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const forgotPassword = async () => {
    if (!email.trim()) {
      setError("Enter your email above first, then click 'Forgot password?'");
      return;
    }
    try {
      await sendAdminPasswordReset(email.trim());
      setResetSent(true);
      toast.success("Password reset email sent");
    } catch {
      // Firebase returns the same error whether the account exists or not
      // (privacy), so we show a generic confirmation either way.
      setResetSent(true);
    }
  };

  if (loading || profile) {
    return <div className="min-h-screen" style={{ background: "linear-gradient(160deg,#131C30 0%,#0A0E1A 100%)" }} />;
  }

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4"
      style={{ background: "linear-gradient(160deg,#131C30 0%,#0A0E1A 100%)" }}
    >
      {/* animated aurora blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="animate-drift absolute -left-24 -top-24 h-96 w-96 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle,#E61C83,transparent 70%)" }}
        />
        <div
          className="animate-drift-rev absolute -bottom-32 -right-24 h-[28rem] w-[28rem] rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle,#16A7E0,transparent 70%)" }}
        />
        <div
          className="animate-pulse-scale absolute left-1/3 top-1/2 h-72 w-72 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle,#F9A349,transparent 70%)" }}
        />
        {/* gradient hairline top */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-brand opacity-70" />
        {/* faint grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-sm rounded-3xl p-[2px] bg-gradient-brand animate-gradient shadow-glow"
      >
        <div className="rounded-[1.4rem] bg-white px-7 py-9">
          <div className="flex flex-col items-center text-center">
            <Logo className="h-12 w-12" />
            <h1 className="mt-4 text-xl font-extrabold" style={{ color: "var(--brand-dark)", fontFamily: "'Space Grotesk', sans-serif" }}>
              Admin Panel
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">Sign in to manage UiS Store</p>
          </div>

          <form onSubmit={submit} className="mt-7 space-y-3">
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="email"
                required
                autoComplete="username"
                placeholder="you@uniwebonline.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="password"
                required
                autoComplete="current-password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
              />
            </div>

            {error && <p className="text-xs font-semibold text-destructive">{error}</p>}
            {resetSent && !error && (
              <p className="text-xs font-semibold text-emerald-600">
                If an account exists for that email, a reset link is on its way.
              </p>
            )}

            {offerBootstrap ? (
              <div className="rounded-xl border border-dashed p-3" style={{ borderColor: "var(--brand-sky)" }}>
                <p className="flex items-center gap-1.5 text-xs font-bold" style={{ color: "var(--brand-deep)" }}>
                  <Sparkles className="h-3.5 w-3.5" /> First time signing in?
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  No account exists yet for this permanent super admin email. Create it now with the password
                  you entered above.
                </p>
                <Button
                  type="button"
                  onClick={runBootstrap}
                  disabled={submitting}
                  className="mt-2.5 w-full gap-2 bg-gradient-brand text-white hover:opacity-90"
                >
                  {submitting ? "Creating…" : "Create My Super Admin Account"}
                </Button>
              </div>
            ) : (
              <Button
                type="submit"
                disabled={submitting}
                className="w-full gap-2 bg-gradient-brand text-white hover:opacity-90"
              >
                <LogIn className="h-4 w-4" />
                {submitting ? "Signing in…" : "Sign In"}
              </Button>
            )}

            <button
              type="button"
              onClick={forgotPassword}
              className="w-full text-center text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Forgot password?
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
