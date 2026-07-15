import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Loader2, MessageCircle, Pencil, MapPin, Save, Plus, Search, UserPlus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { presetToRange, presetLabel, PRESET_ORDER, type RangePreset } from "@/components/admin/DateRangeFilter";
import {
  fetchLeads,
  updateLead,
  deleteLead,
  createLeadManually,
  LEAD_STATUSES,
  LEAD_PACKAGES,
  LEAD_SOURCES,
  type LeadRecord,
  type LeadStatus,
  type LeadPackage,
  type LeadSource,
  type LeadCrmFields,
} from "@/lib/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/admin/forms")({
  component: () => (
    <AdminShell menu="forms">
      <FormsPage />
    </AdminShell>
  ),
});

function whatsappLink(mobile: string) {
  return `https://wa.me/${mobile.replace(/\D/g, "")}`;
}

const STATUS_STYLES: Record<LeadStatus, string> = {
  New: "bg-sky-100 text-sky-700",
  Contacted: "bg-amber-100 text-amber-700",
  Interested: "bg-fuchsia-100 text-fuchsia-700",
  Converted: "bg-emerald-100 text-emerald-700",
  Lost: "bg-gray-200 text-gray-600",
};

function StatusBadge({ status }: { status?: LeadStatus }) {
  const s = status ?? "New";
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${STATUS_STYLES[s]}`}>{s}</span>;
}

function FormsPage() {
  const [leads, setLeads] = useState<LeadRecord[] | null>(null);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<LeadRecord | null>(null);
  const [adding, setAdding] = useState(false);

  // filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [datePreset, setDatePreset] = useState<RangePreset>("all");

  const load = () => {
    fetchLeads(5000)
      .then(setLeads)
      .catch(() => setError("Couldn't load form submissions — check Firestore rules allow reading /leads."));
  };

  useEffect(load, []);

  const removeLead = async (l: LeadRecord) => {
    if (!window.confirm(`Delete this lead (${l.customerName || l.name || l.mobile})? This cannot be undone.`)) return;
    try {
      await deleteLead(l.id);
      toast.success("Lead deleted");
      load();
    } catch {
      toast.error("Couldn't delete — check Firestore rules allow deleting /leads.");
    }
  };

  const filtered = useMemo(() => {
    if (!leads) return [];
    const q = search.trim().toLowerCase();
    const range = presetToRange(datePreset);
    return leads.filter((l) => {
      if (statusFilter !== "all" && (l.status ?? "New") !== statusFilter) return false;
      if (sourceFilter !== "all" && (l.source ?? "Manual") !== sourceFilter) return false;
      if (range.since && l.createdAt && l.createdAt < range.since) return false;
      if (range.until && l.createdAt && l.createdAt > range.until) return false;
      if (q) {
        const hay = [
          l.customerName,
          l.name,
          l.mobile,
          l.mobile2,
          l.email1,
          l.email2,
          l.ipLocation?.city,
          l.ipLocation?.country,
          l.address,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [leads, search, statusFilter, sourceFilter, datePreset]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: "var(--brand-dark)", fontFamily: "'Space Grotesk', sans-serif" }}>
            Forms
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Every "Get Your Store" popup submission — plus leads you add by hand.</p>
        </div>
        <Button onClick={() => setAdding(true)} className="gap-2 bg-gradient-brand text-white hover:opacity-90">
          <Plus className="h-4 w-4" /> Add Lead
        </Button>
      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {leads === null && !error ? (
        <div className="flex h-64 items-center justify-center text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading…
        </div>
      ) : (
        <>
          {/* filter bar */}
          <div className="mt-6 flex flex-col gap-2 rounded-2xl border bg-white p-3 shadow-soft sm:flex-row sm:flex-wrap sm:items-center">
            <div className="relative flex-1 sm:min-w-[200px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, mobile, email, location…"
                className="h-9 pl-9"
              />
            </div>
            <FilterSelect
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="All Status"
              options={["all", ...LEAD_STATUSES]}
              labelFor={(v) => (v === "all" ? "All Status" : v)}
            />
            <FilterSelect
              value={sourceFilter}
              onChange={setSourceFilter}
              placeholder="All Sources"
              options={["all", ...LEAD_SOURCES]}
              labelFor={(v) => (v === "all" ? "All Sources" : v)}
            />
            <FilterSelect
              value={datePreset}
              onChange={(v) => setDatePreset(v as RangePreset)}
              placeholder="All Dates"
              options={PRESET_ORDER}
              labelFor={(v) => (v === "all" ? "All Dates" : presetLabel(v as RangePreset))}
            />
          </div>

          <Card className="mt-4 border-none shadow-soft">
            <CardHeader>
              <CardTitle className="text-sm font-bold">
                Submissions{" "}
                <span className="font-normal text-muted-foreground">
                  ({filtered.length}
                  {filtered.length !== leads?.length ? ` of ${leads?.length}` : ""})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead className="hidden sm:table-cell">Source</TableHead>
                    <TableHead className="hidden lg:table-cell">Package</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell className="font-medium">
                        {l.customerName || l.name || "—"}
                        <span className="mt-0.5 block text-[11px] font-normal text-muted-foreground sm:hidden">
                          {l.source ?? "—"} · {l.ipLocation?.city ?? "Unknown"}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{l.mobile}</TableCell>
                      <TableCell className="hidden text-xs text-muted-foreground sm:table-cell">{l.source ?? "—"}</TableCell>
                      <TableCell className="hidden text-xs text-muted-foreground lg:table-cell">{l.packageInterest ?? "—"}</TableCell>
                      <TableCell>
                        <StatusBadge status={l.status} />
                      </TableCell>
                      <TableCell className="hidden text-xs text-muted-foreground md:table-cell">
                        {l.createdAt ? format(l.createdAt, "MMM d, yyyy · HH:mm") : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-0.5">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelected(l)} aria-label="Edit lead" title="Edit / details">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <a href={whatsappLink(l.mobile)} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-600" aria-label="Open WhatsApp" title="WhatsApp">
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                          </a>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeLead(l)} aria-label="Delete lead" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-sm text-muted-foreground">
                        {leads?.length ? "No leads match these filters." : "No submissions yet."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      <LeadDialog lead={selected} onClose={() => setSelected(null)} onSaved={load} />
      <AddLeadDialog open={adding} onClose={() => setAdding(false)} onSaved={load} />
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  placeholder,
  options,
  labelFor,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: readonly string[];
  labelFor: (v: string) => string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-9 w-full bg-white sm:w-[150px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {labelFor(o)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// Shared editable CRM fields, used by both the edit and add-lead dialogs.
function CrmFields({
  form,
  set,
  showName = false,
}: {
  form: LeadCrmFields & { name?: string; mobile?: string };
  set: (k: string, v: unknown) => void;
  showName?: boolean;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {showName && (
        <>
          <Field label="Customer name *">
            <Input value={form.name ?? ""} onChange={(e) => set("name", e.target.value)} placeholder="Customer name" />
          </Field>
          <Field label="Mobile *">
            <Input value={form.mobile ?? ""} onChange={(e) => set("mobile", e.target.value)} placeholder="+965 …" />
          </Field>
        </>
      )}
      {!showName && (
        <Field label="Customer name">
          <Input value={form.customerName ?? ""} onChange={(e) => set("customerName", e.target.value)} placeholder="Customer name" />
        </Field>
      )}
      <Field label="Lead status">
        <Select value={form.status} onValueChange={(v) => set("status", v as LeadStatus)}>
          <SelectTrigger>
            <SelectValue placeholder="New" />
          </SelectTrigger>
          <SelectContent>
            {LEAD_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Source">
        <Select value={form.source} onValueChange={(v) => set("source", v as LeadSource)}>
          <SelectTrigger>
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            {LEAD_SOURCES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Package">
        <Select value={form.packageInterest} onValueChange={(v) => set("packageInterest", v as LeadPackage)}>
          <SelectTrigger>
            <SelectValue placeholder="Undecided" />
          </SelectTrigger>
          <SelectContent>
            {LEAD_PACKAGES.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Second number">
        <Input value={form.mobile2 ?? ""} onChange={(e) => set("mobile2", e.target.value)} placeholder="+965 …" />
      </Field>
      <Field label="Email 1">
        <Input type="email" value={form.email1 ?? ""} onChange={(e) => set("email1", e.target.value)} placeholder="name@email.com" />
      </Field>
      <Field label="Email 2">
        <Input type="email" value={form.email2 ?? ""} onChange={(e) => set("email2", e.target.value)} placeholder="name@email.com" />
      </Field>
      <Field label="Google Maps link">
        <Input value={form.mapLink ?? ""} onChange={(e) => set("mapLink", e.target.value)} placeholder="Paste maps.google.com link" />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Address">
          <Textarea value={form.address ?? ""} onChange={(e) => set("address", e.target.value)} placeholder="Customer address" rows={2} />
        </Field>
      </div>
    </div>
  );
}

function AddLeadDialog({ open, onClose, onSaved }: { open: boolean; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<LeadCrmFields & { name: string; mobile: string }>({
    name: "",
    mobile: "+965 ",
    status: "New",
    source: "Manual",
    packageInterest: "Undecided",
  });
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.name.trim() || form.mobile.replace(/\D/g, "").length < 6) {
      toast.error("Enter at least a customer name and mobile number.");
      return;
    }
    setSaving(true);
    try {
      await createLeadManually({ ...form, name: form.name.trim(), mobile: form.mobile.trim() });
      toast.success("Lead added");
      onSaved();
      onClose();
      setForm({ name: "", mobile: "+965 ", status: "New", source: "Manual", packageInterest: "Undecided" });
    } catch {
      toast.error("Couldn't add the lead — check Firestore rules allow creating /leads.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[88vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" style={{ color: "var(--brand-magenta)" }} /> Add lead manually
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <CrmFields form={form} set={set} showName />
          <Button onClick={save} disabled={saving} className="w-full gap-2 bg-gradient-brand text-white hover:opacity-90">
            <Save className="h-4 w-4" /> {saving ? "Saving…" : "Add Lead"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function LeadDialog({ lead, onClose, onSaved }: { lead: LeadRecord | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<LeadCrmFields>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!lead) return;
    setForm({
      customerName: lead.customerName ?? lead.name ?? "",
      mobile2: lead.mobile2 ?? "",
      email1: lead.email1 ?? "",
      email2: lead.email2 ?? "",
      address: lead.address ?? "",
      mapLink: lead.mapLink ?? "",
      packageInterest: lead.packageInterest ?? "Undecided",
      status: lead.status ?? "New",
      source: lead.source ?? "Direct",
    });
  }, [lead]);

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!lead) return;
    setSaving(true);
    try {
      await updateLead(lead.id, form);
      toast.success("Lead updated");
      onSaved();
      onClose();
    } catch {
      toast.error("Couldn't save — check Firestore rules allow updating /leads.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={!!lead} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[88vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Lead — {lead?.name || lead?.mobile}</DialogTitle>
        </DialogHeader>
        {lead && (
          <div className="space-y-4">
            <CrmFields form={form} set={set} />
            <div className="flex items-center gap-2">
              <Button onClick={save} disabled={saving} className="flex-1 gap-2 bg-gradient-brand text-white hover:opacity-90">
                <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save"}
              </Button>
              {form.mapLink && (
                <a href={form.mapLink} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="gap-1.5">
                    <MapPin className="h-4 w-4" /> Open
                  </Button>
                </a>
              )}
            </div>

            <div className="rounded-xl bg-muted/40 p-3 text-sm">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Captured automatically</p>
              <Row label="Submitted" value={lead.createdAt ? format(lead.createdAt, "PPpp") : "—"} />
              <Row label="Original name" value={lead.name ?? "—"} />
              <Row label="IP address" value={lead.ipLocation?.ip ?? "—"} />
              <Row
                label="IP location"
                value={lead.ipLocation ? `${lead.ipLocation.city ?? "?"}, ${lead.ipLocation.country ?? "?"}` : "—"}
              />
              <Row label="Device" value={[lead.device, lead.browser].filter(Boolean).join(" · ") || "—"} />
              <Row
                label="Browser GPS"
                value={lead.browserGeo ? `${lead.browserGeo.latitude.toFixed(5)}, ${lead.browserGeo.longitude.toFixed(5)}` : "Not granted"}
              />
              {lead.browserGeo && (
                <a
                  className="mt-1 inline-block text-xs font-semibold text-[var(--brand-deep)] hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://www.google.com/maps?q=${lead.browserGeo.latitude},${lead.browserGeo.longitude}`}
                >
                  Open exact GPS in Google Maps →
                </a>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b py-1.5 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
