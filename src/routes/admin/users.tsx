import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Loader2, UserPlus, Lock, Pencil, Trash2, Ban, CircleCheck } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import {
  fetchAllUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  isSuperAdminEmail,
  MENU_ITEMS,
  type AdminProfile,
  type MenuKey,
} from "@/lib/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/admin/users")({
  component: () => (
    <AdminShell menu="users">
      <UsersPage />
    </AdminShell>
  ),
});

const ROLE_PRESETS = ["Admin", "Manager", "Viewer"];

function PermissionCheckboxes({
  value,
  onChange,
}: {
  value: MenuKey[];
  onChange: (next: MenuKey[]) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {MENU_ITEMS.map((item) => {
        const checked = value.includes(item.key);
        return (
          <label
            key={item.key}
            className="flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted"
          >
            <Checkbox
              checked={checked}
              onCheckedChange={(c) => onChange(c ? [...value, item.key] : value.filter((k) => k !== item.key))}
            />
            {item.label}
          </label>
        );
      })}
    </div>
  );
}

function AddUserDialog({ onCreated, createdBy }: { onCreated: () => void; createdBy: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Admin");
  const [permissions, setPermissions] = useState<MenuKey[]>(["dashboard"]);
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRole("Admin");
    setPermissions(["dashboard"]);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setSubmitting(true);
    try {
      await createAdminUser({ name: name.trim(), email: email.trim(), password, role, permissions, createdBy });
      toast.success(`${name} was added. They can sign in with the email & password you set.`);
      setOpen(false);
      reset();
      onCreated();
    } catch (err) {
      const code = (err as { code?: string })?.code ?? "";
      if (code.includes("email-already-in-use")) toast.error("That email already has an account.");
      else if (code.includes("weak-password")) toast.error("Password is too weak — use at least 6 characters.");
      else toast.error("Couldn't create the user. Check Firestore/Auth rules and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)} className="gap-2 bg-gradient-brand text-white hover:opacity-90">
        <UserPlus className="h-4 w-4" /> Add User
      </Button>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add admin user</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="new-name">Name</Label>
            <Input id="new-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new-email">Email</Label>
            <Input
              id="new-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@uniwebonline.com"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new-password">Password</Label>
            <Input
              id="new-password"
              type="text"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              autoComplete="new-password"
            />
            <p className="text-[11px] text-muted-foreground">
              Share these credentials with the user. They can change the password later via "Forgot password".
            </p>
          </div>
          <div className="space-y-1.5">
            <Label>Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLE_PRESETS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Menu access</Label>
            <PermissionCheckboxes value={permissions} onChange={setPermissions} />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={submitting} className="w-full bg-gradient-brand text-white hover:opacity-90">
              {submitting ? "Creating…" : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditUserDialog({
  user,
  open,
  onClose,
  onSaved,
}: {
  user: AdminProfile | null;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("Admin");
  const [permissions, setPermissions] = useState<MenuKey[]>([]);
  const [active, setActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setRole(user.role);
      setPermissions(user.permissions);
      setActive(user.active);
    }
  }, [user]);

  if (!user) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updateAdminUser(user.uid, { name: name.trim(), role, permissions, active });
      toast.success("User updated");
      onClose();
      onSaved();
    } catch {
      toast.error("Couldn't save changes. Check Firestore rules.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit {user.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="edit-name">Name</Label>
            <Input id="edit-name" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLE_PRESETS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Menu access</Label>
            <PermissionCheckboxes value={permissions} onChange={setPermissions} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={active} onCheckedChange={(c) => setActive(!!c)} />
            Active (unchecking blocks their sign-in access)
          </label>
          <DialogFooter>
            <Button type="submit" disabled={submitting} className="w-full bg-gradient-brand text-white hover:opacity-90">
              {submitting ? "Saving…" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function UsersPage() {
  const { profile } = useAdminAuth();
  const [users, setUsers] = useState<AdminProfile[] | null>(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<AdminProfile | null>(null);

  const load = () => {
    fetchAllUsers()
      .then(setUsers)
      .catch(() => setError("Couldn't load users — check Firestore rules allow reading /users."));
  };

  useEffect(load, []);

  const toggleActive = async (u: AdminProfile) => {
    try {
      await updateAdminUser(u.uid, { active: !u.active });
      toast.success(u.active ? `${u.name} disabled` : `${u.name} enabled`);
      load();
    } catch {
      toast.error("Couldn't update the user.");
    }
  };

  const removeUser = async (u: AdminProfile) => {
    if (!window.confirm(`Remove ${u.name}? They will lose all admin access. This cannot be undone.`)) return;
    try {
      await deleteAdminUser(u.uid);
      toast.success(`${u.name} removed`);
      load();
    } catch {
      toast.error("Couldn't remove the user.");
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: "var(--brand-dark)", fontFamily: "'Space Grotesk', sans-serif" }}>
            Users
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage who can access the admin panel, and what they can see.</p>
        </div>
        {profile && <AddUserDialog onCreated={load} createdBy={profile.email} />}
      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {users === null && !error ? (
        <div className="flex h-64 items-center justify-center text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading…
        </div>
      ) : (
        <Card className="mt-6 border-none shadow-soft">
          <CardHeader>
            <CardTitle className="text-sm font-bold">
              All Users <span className="font-normal text-muted-foreground">({users?.length ?? 0})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden lg:table-cell">Access</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(users ?? []).map((u) => {
                  const protectedUser = isSuperAdminEmail(u.email);
                  return (
                    <TableRow key={u.uid}>
                      <TableCell className="font-medium">
                        {u.name}
                        {/* email shown inline under the name on phones, where its column is hidden */}
                        <span className="mt-0.5 block text-[11px] font-normal text-muted-foreground md:hidden">{u.email}</span>
                      </TableCell>
                      <TableCell className="hidden text-xs text-muted-foreground md:table-cell">{u.email}</TableCell>
                      <TableCell>
                        <Badge variant={protectedUser ? "default" : "secondary"} className={protectedUser ? "bg-gradient-brand" : ""}>
                          {protectedUser ? "Super Admin" : u.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {protectedUser
                            ? MENU_ITEMS.map((m) => (
                                <Badge key={m.key} variant="outline" className="text-[10px]">
                                  {m.label}
                                </Badge>
                              ))
                            : u.permissions.length === 0
                              ? <span className="text-xs text-muted-foreground">None</span>
                              : u.permissions.map((p) => (
                                  <Badge key={p} variant="outline" className="text-[10px]">
                                    {MENU_ITEMS.find((m) => m.key === p)?.label ?? p}
                                  </Badge>
                                ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={u.active ? "default" : "destructive"} className={u.active ? "bg-emerald-600" : ""}>
                          {u.active ? "Active" : "Disabled"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden text-xs text-muted-foreground sm:table-cell">
                        {u.createdAt && typeof (u.createdAt as { toDate?: unknown }).toDate === "function"
                          ? format((u.createdAt as { toDate: () => Date }).toDate(), "MMM d, yyyy")
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        {protectedUser ? (
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <Lock className="h-3.5 w-3.5" /> Protected
                          </span>
                        ) : (
                          <div className="flex items-center justify-end gap-0.5">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditing(u)} aria-label="Edit user" title="Edit">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className={`h-8 w-8 ${u.active ? "text-amber-600" : "text-emerald-600"}`}
                              onClick={() => toggleActive(u)}
                              aria-label={u.active ? "Disable user" : "Enable user"}
                              title={u.active ? "Disable" : "Enable"}
                            >
                              {u.active ? <Ban className="h-4 w-4" /> : <CircleCheck className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => removeUser(u)}
                              aria-label="Delete user"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {users?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-sm text-muted-foreground">
                      No users yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <EditUserDialog user={editing} open={!!editing} onClose={() => setEditing(null)} onSaved={load} />
    </div>
  );
}
