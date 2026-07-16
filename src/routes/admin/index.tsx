import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Users, Globe, UserPlus, Repeat, FileText, Loader2, Search, MousePointerClick, Eye, TrendingUp } from "lucide-react";
import { format, subDays, startOfDay } from "date-fns";
import { AdminShell } from "@/components/admin/AdminShell";
import { DateRangeFilter, presetToRange, DEFAULT_PRESET, type RangePreset } from "@/components/admin/DateRangeFilter";
import { TimeRangeFilter, inTimeWindow, ALL_HOURS, type TimeWindow } from "@/components/admin/TimeRangeFilter";
import { fetchVisits, fetchLeads, computeVisitAnalytics, type VisitRecord, type LeadRecord } from "@/lib/admin";
import { scSummary, scQueries } from "@/lib/search-console-mock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/admin/")({
  component: () => (
    <AdminShell menu="dashboard">
      <Dashboard />
    </AdminShell>
  ),
});

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  to,
}: {
  icon: typeof Users;
  label: string;
  value: string | number;
  color: string;
  to?: string; // if set, the whole card links to that admin page
}) {
  const inner = (
    <Card className={`border-none shadow-soft transition ${to ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-glow" : ""}`}>
      <CardContent className="flex items-center gap-4 p-5">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl" style={{ background: `${color}18` }}>
          <Icon className="h-5 w-5" style={{ color }} />
        </span>
        <div>
          <p className="text-2xl font-extrabold" style={{ color: "var(--brand-dark)", fontFamily: "'Space Grotesk', sans-serif" }}>
            {value}
          </p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
  return to ? (
    <Link to={to} className="block">
      {inner}
    </Link>
  ) : (
    inner
  );
}

function MiniStat({ icon: Icon, label, value, color }: { icon: typeof Users; label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl border p-3">
      <Icon className="h-4 w-4" style={{ color }} />
      <p className="mt-1.5 text-lg font-extrabold" style={{ color: "var(--brand-dark)", fontFamily: "'Space Grotesk', sans-serif" }}>
        {value}
      </p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}

function buildDailySeries(visits: VisitRecord[], leads: LeadRecord[]) {
  const days = [...Array(14)].map((_, i) => startOfDay(subDays(new Date(), 13 - i)));
  return days.map((day) => {
    const key = format(day, "MMM d");
    const dayEnd = subDays(day, -1);
    const visitCount = visits.filter((v) => v.createdAt && v.createdAt >= day && v.createdAt < dayEnd).length;
    const leadCount = leads.filter((l) => l.createdAt && l.createdAt >= day && l.createdAt < dayEnd).length;
    return { day: key, Visits: visitCount, Leads: leadCount };
  });
}

function Dashboard() {
  const [visitsRaw, setVisitsRaw] = useState<VisitRecord[] | null>(null);
  const [leadsRaw, setLeadsRaw] = useState<LeadRecord[] | null>(null);
  const [error, setError] = useState("");
  const [preset, setPreset] = useState<RangePreset>(DEFAULT_PRESET);
  const [time, setTime] = useState<TimeWindow>(ALL_HOURS);

  useEffect(() => {
    setVisitsRaw(null);
    setLeadsRaw(null);
    const range = presetToRange(preset);
    Promise.all([fetchVisits(2000, range), fetchLeads(2000, range)])
      .then(([v, l]) => {
        setVisitsRaw(v);
        setLeadsRaw(l);
      })
      .catch(() => setError("Couldn't load data — check Firestore rules allow reading /visits and /leads."));
  }, [preset]);

  // Time-of-day filter applies to everything on the dashboard.
  const visits = useMemo(
    () => (visitsRaw === null ? null : visitsRaw.filter((v) => inTimeWindow(v.createdAt, time))),
    [visitsRaw, time],
  );
  const leads = useMemo(
    () => (leadsRaw === null ? null : leadsRaw.filter((l) => inTimeWindow(l.createdAt, time))),
    [leadsRaw, time],
  );

  const series = useMemo(() => (visits && leads ? buildDailySeries(visits, leads) : []), [visits, leads]);
  const stats = useMemo(() => (visits ? computeVisitAnalytics(visits) : null), [visits]);
  const topCountries = stats?.countries ?? [];

  const recent = useMemo(() => {
    if (!leads) return [];
    return [...leads].slice(0, 6);
  }, [leads]);

  const loading = visits === null || leads === null;

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: "var(--brand-dark)", fontFamily: "'Space Grotesk', sans-serif" }}>
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Overview of website visitors and form submissions.</p>
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

      {loading && !error ? (
        <div className="flex h-64 items-center justify-center text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading…
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard icon={Globe} label="Total Visits" value={stats?.total ?? 0} color="#16A7E0" to="/admin/visits" />
            <StatCard icon={Users} label="Unique Visitors" value={stats?.unique ?? 0} color="#E61C83" to="/admin/visits" />
            <StatCard icon={UserPlus} label="New Visitors" value={stats?.newVisitors ?? 0} color="#F9A349" to="/admin/visits" />
            <StatCard icon={Repeat} label="Returning" value={stats?.returning ?? 0} color="#0D7ABD" to="/admin/visits" />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StatCard icon={FileText} label="Form Submissions" value={leads?.length ?? 0} color="#0D7ABD" to="/admin/forms" />
            <StatCard icon={Repeat} label="Returning Rate" value={`${stats && stats.total ? Math.round((stats.returning / stats.total) * 100) : 0}%`} color="#E61C83" to="/admin/visits" />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <Card className="border-none shadow-soft">
              <CardHeader>
                <CardTitle className="text-sm font-bold">Last 14 Days</CardTitle>
              </CardHeader>
              <CardContent className="h-72 pl-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={series} margin={{ left: -10 }}>
                    <CartesianGrid vertical={false} stroke="#eef1f6" />
                    <XAxis dataKey="day" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip cursor={{ fill: "#f5f7fb" }} contentStyle={{ borderRadius: 12, border: "1px solid #eee", fontSize: 12 }} />
                    <Bar dataKey="Visits" fill="#16A7E0" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Leads" fill="#E61C83" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-none shadow-soft">
              <CardHeader>
                <CardTitle className="text-sm font-bold">Top Countries</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topCountries.length === 0 && <p className="text-xs text-muted-foreground">No visit location data yet.</p>}
                {topCountries.map(([country, count]) => (
                  <div key={country} className="flex items-center justify-between text-sm">
                    <span className="font-medium">{country}</span>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-bold text-muted-foreground">{count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Search Console snapshot (demo data) */}
          <Card className="mt-6 border-none shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2 text-sm font-bold">
                <Search className="h-4 w-4" style={{ color: "var(--brand-deep)" }} /> Google Search Console
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">demo</span>
              </CardTitle>
              <Link to="/admin/search-console" className="text-xs font-semibold text-[var(--brand-deep)] hover:underline">
                Open →
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                <MiniStat icon={MousePointerClick} label="Clicks" value={scSummary.clicks.toLocaleString()} color="#16A7E0" />
                <MiniStat icon={Eye} label="Impressions" value={scSummary.impressions.toLocaleString()} color="#E61C83" />
                <MiniStat icon={TrendingUp} label="Avg Position" value={scSummary.position.toFixed(1)} color="#0D7ABD" />
              </div>
              <p className="mt-4 mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Top keywords</p>
              <div className="space-y-2">
                {scQueries.slice(0, 4).map((q) => (
                  <div key={q.key} className="flex items-center justify-between text-sm">
                    <span className="truncate font-medium">{q.key}</span>
                    <span className="ml-3 shrink-0 text-xs text-muted-foreground">
                      {q.clicks} clicks · pos {q.position.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6 border-none shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-bold">Recent Form Submissions</CardTitle>
              <Link to="/admin/forms" className="text-xs font-semibold text-[var(--brand-deep)] hover:underline">
                View all →
              </Link>
            </CardHeader>
            <CardContent>
              {recent.length === 0 ? (
                <p className="text-xs text-muted-foreground">No submissions yet.</p>
              ) : (
                <div className="space-y-3">
                  {recent.map((l) => (
                    <div key={l.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                      <div>
                        <p className="text-sm font-semibold">{l.name || "—"}</p>
                        <p className="text-xs text-muted-foreground">
                          {l.mobile} · {l.ipLocation?.city ?? "Unknown"}, {l.ipLocation?.country ?? "—"}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {l.createdAt ? format(l.createdAt, "MMM d, HH:mm") : "—"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
