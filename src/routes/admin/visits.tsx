import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Loader2, Globe2, Users, UserPlus, Repeat, Compass, Globe, Monitor, MapPinned } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { VisitsMap } from "@/components/admin/VisitsMap";
import { BreakdownCard } from "@/components/admin/BreakdownCard";
import { DateRangeFilter, presetToRange, DEFAULT_PRESET, type RangePreset } from "@/components/admin/DateRangeFilter";
import {
  fetchVisits,
  fetchLeads,
  computeVisitAnalytics,
  countryFlag,
  type VisitRecord,
  type LeadRecord,
} from "@/lib/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/admin/visits")({
  component: () => (
    <AdminShell menu="visits">
      <VisitsPage />
    </AdminShell>
  ),
});

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Users;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <Card className="border-none shadow-soft">
      <CardContent className="flex items-center gap-3 p-4 sm:gap-4 sm:p-5">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl sm:h-11 sm:w-11" style={{ background: `${color}18` }}>
          <Icon className="h-5 w-5" style={{ color }} />
        </span>
        <div>
          <p className="text-xl font-extrabold sm:text-2xl" style={{ color: "var(--brand-dark)", fontFamily: "'Space Grotesk', sans-serif" }}>
            {value}
          </p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function VisitsPage() {
  const [visits, setVisits] = useState<VisitRecord[] | null>(null);
  const [leads, setLeads] = useState<LeadRecord[] | null>(null);
  const [error, setError] = useState("");
  const [preset, setPreset] = useState<RangePreset>(DEFAULT_PRESET);

  useEffect(() => {
    setVisits(null);
    const range = presetToRange(preset);
    Promise.all([fetchVisits(2000, range), fetchLeads(2000, range)])
      .then(([v, l]) => {
        setVisits(v);
        setLeads(l);
      })
      .catch(() => setError("Couldn't load visits — check Firestore rules allow reading /visits."));
  }, [preset]);

  const stats = useMemo(() => (visits ? computeVisitAnalytics(visits) : null), [visits]);
  const located = useMemo(() => (visits ?? []).filter((v) => v.ipLocation?.latitude && v.ipLocation?.longitude), [visits]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: "var(--brand-dark)", fontFamily: "'Space Grotesk', sans-serif" }}>
            Visits &amp; Map
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Every visitor to uisstore.net, located by IP address.</p>
        </div>
        <DateRangeFilter value={preset} onChange={setPreset} />
      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {visits === null && !error ? (
        <div className="flex h-64 items-center justify-center text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading…
        </div>
      ) : (
        <>
          {/* headline stat cards */}
          {stats && (
            <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
              <StatCard icon={Globe} label="Total Visits" value={stats.total} color="#16A7E0" />
              <StatCard icon={Users} label="Unique Visitors" value={stats.unique} color="#E61C83" />
              <StatCard icon={UserPlus} label="New Visitors" value={stats.newVisitors} color="#F9A349" />
              <StatCard icon={Repeat} label="Returning" value={stats.returning} color="#0D7ABD" />
            </div>
          )}

          {/* sources / browsers / devices breakdowns */}
          {stats && (
            <div className="mt-4 grid gap-4 lg:mt-6 lg:grid-cols-3">
              <BreakdownCard
                title="Top Sources"
                icon={Compass}
                total={stats.total}
                color="#E61C83"
                rows={stats.sources.map(([label, value]) => ({ label, value }))}
              />
              <BreakdownCard
                title="Browsers"
                icon={Globe}
                total={stats.total}
                color="#16A7E0"
                rows={stats.browsers.map(([label, value]) => ({ label, value }))}
              />
              <BreakdownCard
                title="Devices"
                icon={Monitor}
                total={stats.total}
                color="#F9A349"
                rows={stats.devices.map(([label, value]) => ({ label, value }))}
              />
            </div>
          )}

          {/* countries with flags */}
          {stats && (
            <div className="mt-4 lg:mt-6">
              <BreakdownCard
                title="Top Countries"
                icon={MapPinned}
                total={stats.total}
                color="#0D7ABD"
                rows={stats.countries.map(([name, value, code]) => ({ label: name, value, prefix: countryFlag(code) }))}
              />
            </div>
          )}

          <Card className="mt-4 border-none shadow-soft lg:mt-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2 text-sm font-bold">
                <Globe2 className="h-4 w-4" style={{ color: "var(--brand-deep)" }} />
                Interactive Map
              </CardTitle>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#16A7E0" }} /> Visits
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#E61C83" }} /> Form leads
                </span>
              </div>
            </CardHeader>
            <CardContent className="h-[360px] sm:h-[420px]">
              <VisitsMap visits={visits ?? []} leads={leads ?? []} />
            </CardContent>
          </Card>

          <Card className="mt-4 border-none shadow-soft lg:mt-6">
            <CardHeader>
              <CardTitle className="text-sm font-bold">
                All Visits{" "}
                <span className="font-normal text-muted-foreground">
                  ({visits?.length ?? 0} total, {located.length} located)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Location</TableHead>
                    <TableHead className="hidden sm:table-cell">Device</TableHead>
                    <TableHead className="hidden md:table-cell">Source</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(visits ?? []).map((v) => (
                    <TableRow key={v.id}>
                      <TableCell className="font-medium">
                        <span className="flex items-center gap-1.5">
                          <span>{countryFlag(v.ipLocation?.countryCode)}</span>
                          {v.ipLocation?.city ?? "Unknown"}
                        </span>
                        <span className="mt-0.5 block text-[11px] font-normal text-muted-foreground">
                          {v.ipLocation?.country ?? "—"}
                          {v.browserGeo ? " · 📍 exact GPS" : ""}
                        </span>
                      </TableCell>
                      <TableCell className="hidden text-xs text-muted-foreground sm:table-cell">
                        {v.device ?? "—"}
                        {v.browser ? ` · ${v.browser}` : ""}
                      </TableCell>
                      <TableCell className="hidden text-xs text-muted-foreground md:table-cell">{v.source ?? "—"}</TableCell>
                      <TableCell>
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                          style={
                            v.isReturning
                              ? { background: "#0D7ABD18", color: "#0D7ABD" }
                              : { background: "#F9A34918", color: "#B26a13" }
                          }
                        >
                          {v.isReturning ? "Returning" : "New"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">
                        {v.createdAt ? format(v.createdAt, "MMM d, HH:mm") : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                  {visits?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                        No visits recorded yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
