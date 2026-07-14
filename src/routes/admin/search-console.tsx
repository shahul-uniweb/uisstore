import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import {
  MousePointerClick,
  Eye,
  Percent,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  FileText,
  Globe,
  Monitor,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { BreakdownCard } from "@/components/admin/BreakdownCard";
import { countryFlag } from "@/lib/admin";
import {
  scSummary,
  scDaily,
  scQueries,
  scPages,
  scCountries,
  scDevices,
  scAppearance,
  scCoverage,
} from "@/lib/search-console-mock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/search-console")({
  component: () => (
    <AdminShell menu="search-console">
      <SearchConsolePage />
    </AdminShell>
  ),
});

const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

function Delta({ value, invert = false }: { value: number; invert?: boolean }) {
  // invert=true for "position" where a lower number is better
  const good = invert ? value < 0 : value > 0;
  const Icon = value >= 0 ? ArrowUp : ArrowDown;
  return (
    <span className={`inline-flex items-center gap-0.5 text-[11px] font-bold ${good ? "text-emerald-600" : "text-rose-500"}`}>
      <Icon className="h-3 w-3" />
      {invert ? Math.abs(value).toFixed(1) : `${Math.abs(value * 100).toFixed(0)}%`}
    </span>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  delta,
}: {
  icon: typeof Eye;
  label: string;
  value: string;
  color: string;
  delta?: React.ReactNode;
}) {
  return (
    <Card className="border-none shadow-soft">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <span className="grid h-10 w-10 place-items-center rounded-2xl" style={{ background: `${color}18` }}>
            <Icon className="h-5 w-5" style={{ color }} />
          </span>
          {delta}
        </div>
        <p className="mt-3 text-2xl font-extrabold" style={{ color: "var(--brand-dark)", fontFamily: "'Space Grotesk', sans-serif" }}>
          {value}
        </p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}

function SearchConsolePage() {
  const [tab, setTab] = useState<"queries" | "pages">("queries");
  const totalCountryClicks = scCountries.reduce((s, c) => s + c.clicks, 0);
  const totalDeviceClicks = scDevices.reduce((s, c) => s + c.clicks, 0);
  const totalAppearance = scAppearance.reduce((s, c) => s + c.clicks, 0);

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: "var(--brand-dark)", fontFamily: "'Space Grotesk', sans-serif" }}>
            Search Console
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">How uisstore.net performs in Google Search — last 28 days.</p>
        </div>
        <Badge variant="secondary" className="w-fit gap-1.5">
          <Sparkles className="h-3.5 w-3.5" /> Demo data — connect Google API to go live
        </Badge>
      </div>

      {/* summary cards */}
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCard icon={MousePointerClick} label="Total Clicks" value={scSummary.clicks.toLocaleString()} color="#16A7E0" delta={<Delta value={scSummary.clicksDelta} />} />
        <StatCard icon={Eye} label="Total Impressions" value={scSummary.impressions.toLocaleString()} color="#E61C83" delta={<Delta value={scSummary.impressionsDelta} />} />
        <StatCard icon={Percent} label="Average CTR" value={pct(scSummary.ctr)} color="#F9A349" delta={<Delta value={scSummary.ctrDelta} />} />
        <StatCard icon={TrendingUp} label="Average Position" value={scSummary.position.toFixed(1)} color="#0D7ABD" delta={<Delta value={scSummary.positionDelta} invert />} />
      </div>

      {/* performance chart */}
      <Card className="mt-4 border-none shadow-soft lg:mt-6">
        <CardHeader>
          <CardTitle className="text-sm font-bold">Performance — Clicks &amp; Impressions</CardTitle>
        </CardHeader>
        <CardContent className="h-72 pl-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={scDaily} margin={{ left: -6, right: 8 }}>
              <defs>
                <linearGradient id="gClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16A7E0" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#16A7E0" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gImpr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E61C83" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#E61C83" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#eef1f6" />
              <XAxis dataKey="date" fontSize={11} tickLine={false} axisLine={false} interval={3} />
              <YAxis yAxisId="l" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis yAxisId="r" orientation="right" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eee", fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area yAxisId="r" type="monotone" dataKey="impressions" name="Impressions" stroke="#E61C83" strokeWidth={2} fill="url(#gImpr)" />
              <Area yAxisId="l" type="monotone" dataKey="clicks" name="Clicks" stroke="#16A7E0" strokeWidth={2} fill="url(#gClicks)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* queries / pages tabbed table */}
      <Card className="mt-4 border-none shadow-soft lg:mt-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="flex gap-1 rounded-full bg-muted p-1">
            <button
              onClick={() => setTab("queries")}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${tab === "queries" ? "bg-white shadow" : "text-muted-foreground"}`}
            >
              Top Queries
            </button>
            <button
              onClick={() => setTab("pages")}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${tab === "pages" ? "bg-white shadow" : "text-muted-foreground"}`}
            >
              Top Pages
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{tab === "queries" ? "Search query (keyword)" : "Page"}</TableHead>
                <TableHead className="text-right">Clicks</TableHead>
                <TableHead className="hidden text-right sm:table-cell">Impressions</TableHead>
                <TableHead className="hidden text-right sm:table-cell">CTR</TableHead>
                <TableHead className="text-right">Position</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(tab === "queries" ? scQueries : scPages).map((r) => (
                <TableRow key={r.key}>
                  <TableCell className="max-w-[240px] truncate font-medium" title={r.key}>
                    {r.key}
                  </TableCell>
                  <TableCell className="text-right font-semibold">{r.clicks}</TableCell>
                  <TableCell className="hidden text-right text-muted-foreground sm:table-cell">{r.impressions.toLocaleString()}</TableCell>
                  <TableCell className="hidden text-right text-muted-foreground sm:table-cell">{pct(r.ctr)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{r.position.toFixed(1)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* breakdowns */}
      <div className="mt-4 grid gap-4 lg:mt-6 lg:grid-cols-3">
        <BreakdownCard
          title="Countries"
          icon={Globe}
          total={totalCountryClicks}
          color="#0D7ABD"
          rows={scCountries.map((c) => ({ label: c.key, value: c.clicks, prefix: countryFlag(c.code) }))}
        />
        <BreakdownCard
          title="Devices"
          icon={Monitor}
          total={totalDeviceClicks}
          color="#F9A349"
          rows={scDevices.map((d) => ({ label: d.key, value: d.clicks }))}
        />
        <BreakdownCard
          title="Search Appearance"
          icon={Sparkles}
          total={totalAppearance}
          color="#E61C83"
          rows={scAppearance.map((a) => ({ label: a.key, value: a.clicks }))}
        />
      </div>

      {/* coverage / indexing */}
      <Card className="mt-4 border-none shadow-soft lg:mt-6">
        <CardHeader>
          <CardTitle className="text-sm font-bold">Indexing &amp; Coverage</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Coverage label="Indexed pages" value={String(scCoverage.indexed)} ok />
          <Coverage label="Sitemap" value={scCoverage.sitemapSubmitted ? "Submitted" : "Missing"} ok={scCoverage.sitemapSubmitted} />
          <Coverage label="Mobile usable" value={scCoverage.mobileUsable ? "Yes" : "Issues"} ok={scCoverage.mobileUsable} />
          <Coverage label="Core Web Vitals" value={scCoverage.coreWebVitalsGood ? "Good" : "Needs work"} ok={scCoverage.coreWebVitalsGood} />
          <div className="text-sm sm:col-span-2 lg:col-span-4">
            <span className="text-muted-foreground">Last crawled: </span>
            <span className="font-semibold">{scCoverage.lastCrawl}</span>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 rounded-2xl border border-dashed p-4 text-xs text-muted-foreground" style={{ borderColor: "var(--brand-sky)" }}>
        <FileText className="mb-1 inline h-4 w-4" style={{ color: "var(--brand-deep)" }} /> This page shows <strong>demo data</strong>.
        To show live numbers, connect the Google Search Console API (Search Analytics + URL Inspection) — the page already
        reads the exact data shape the API returns, so only the data source needs swapping.
      </div>
    </div>
  );
}

function Coverage({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border p-3">
      <CheckCircle2 className={`h-5 w-5 ${ok ? "text-emerald-600" : "text-amber-500"}`} />
      <div>
        <p className="text-sm font-bold" style={{ color: "var(--brand-dark)" }}>{value}</p>
        <p className="text-[11px] text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
