import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Loader2, Globe2, Users, UserPlus, Repeat, Compass, Globe, Monitor, MapPinned, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { VisitsMap } from "@/components/admin/VisitsMap";
import { BreakdownCard } from "@/components/admin/BreakdownCard";
import { DateRangeFilter, presetToRange, DEFAULT_PRESET, type RangePreset } from "@/components/admin/DateRangeFilter";
import { TimeRangeFilter, inTimeWindow, ALL_HOURS, type TimeWindow } from "@/components/admin/TimeRangeFilter";
import { Button } from "@/components/ui/button";
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

// Google Maps link: exact GPS coordinates when the visitor allowed location,
// otherwise a search for their IP-derived city/country.
function mapsUrl(v: VisitRecord): string | null {
  if (v.browserGeo) return `https://www.google.com/maps?q=${v.browserGeo.latitude},${v.browserGeo.longitude}`;
  const q = [v.ipLocation?.city, v.ipLocation?.country].filter(Boolean).join(", ");
  return q ? `https://www.google.com/maps/search/${encodeURIComponent(q)}` : null;
}

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
  const [visitsRaw, setVisitsRaw] = useState<VisitRecord[] | null>(null);
  const [leadsRaw, setLeadsRaw] = useState<LeadRecord[] | null>(null);
  const [error, setError] = useState("");
  const [preset, setPreset] = useState<RangePreset>(DEFAULT_PRESET);
  const [time, setTime] = useState<TimeWindow>(ALL_HOURS);

  useEffect(() => {
    setVisitsRaw(null);
    const range = presetToRange(preset);
    Promise.all([fetchVisits(2000, range), fetchLeads(2000, range)])
      .then(([v, l]) => {
        setVisitsRaw(v);
        setLeadsRaw(l);
      })
      .catch(() => setError("Couldn't load visits — check Firestore rules allow reading /visits."));
  }, [preset]);

  // The time-of-day window filters everything on the page (stats, map, table).
  const visits = useMemo(
    () => (visitsRaw === null ? null : visitsRaw.filter((v) => inTimeWindow(v.createdAt, time))),
    [visitsRaw, time],
  );
  const leads = useMemo(
    () => (leadsRaw === null ? null : leadsRaw.filter((l) => inTimeWindow(l.createdAt, time))),
    [leadsRaw, time],
  );

  const stats = useMemo(() => (visits ? computeVisitAnalytics(visits) : null), [visits]);
  const located = useMemo(() => (visits ?? []).filter((v) => v.ipLocation?.latitude && v.ipLocation?.longitude), [visits]);

  // Pagination for the All Visits table (no separate filter — it follows the
  // page-level date + time filters).
  const [pageNum, setPageNum] = useState(1);
  const PER_PAGE = 25;
  const tableVisits = visits ?? [];
  const totalPages = Math.max(1, Math.ceil(tableVisits.length / PER_PAGE));
  useEffect(() => setPageNum(1), [preset, time, visitsRaw]);
  useEffect(() => {
    if (pageNum > totalPages) setPageNum(totalPages);
  }, [pageNum, totalPages]);
  const pageVisits = tableVisits.slice((pageNum - 1) * PER_PAGE, pageNum * PER_PAGE);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: "var(--brand-dark)", fontFamily: "'Space Grotesk', sans-serif" }}>
            Visits &amp; Map
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Every visitor to uisstore.net, located by IP address.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DateRangeFilter value={preset} onChange={setPreset} />
          <TimeRangeFilter value={time} onChange={setTime} />
        </div>
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
                  ({tableVisits.length} total, {located.length} located)
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
                    <TableHead className="hidden lg:table-cell">Page</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageVisits.map((v) => {
                    const url = mapsUrl(v);
                    return (
                      <TableRow key={v.id}>
                        <TableCell className="font-medium">
                          {url ? (
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group inline-flex items-center gap-1.5 hover:underline"
                              style={{ color: "var(--brand-deep)" }}
                              title="Open in Google Maps"
                            >
                              <span>{countryFlag(v.ipLocation?.countryCode)}</span>
                              {v.ipLocation?.city ?? "Unknown"}
                              <ExternalLink className="h-3 w-3 opacity-0 transition group-hover:opacity-100" />
                            </a>
                          ) : (
                            <span className="flex items-center gap-1.5">
                              <span>{countryFlag(v.ipLocation?.countryCode)}</span>
                              {v.ipLocation?.city ?? "Unknown"}
                            </span>
                          )}
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
                        <TableCell className="hidden font-mono text-xs text-muted-foreground lg:table-cell">{v.page || "/"}</TableCell>
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
                    );
                  })}
                  {tableVisits.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                        {visits?.length ? "No visits in this date range." : "No visits recorded yet."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* pagination */}
              {tableVisits.length > PER_PAGE && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Showing {(pageNum - 1) * PER_PAGE + 1}–{Math.min(pageNum * PER_PAGE, tableVisits.length)} of {tableVisits.length}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      disabled={pageNum <= 1}
                      onClick={() => setPageNum((n) => Math.max(1, n - 1))}
                    >
                      <ChevronLeft className="h-4 w-4" /> Prev
                    </Button>
                    <span className="text-xs font-semibold">
                      {pageNum} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      disabled={pageNum >= totalPages}
                      onClick={() => setPageNum((n) => Math.min(totalPages, n + 1))}
                    >
                      Next <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
